#!/usr/bin/env python3
"""
把「AI 大模型三榜对比」HTML 的数据同步到官网首页「AI 大模型竞争格局」四个 Tab。

用法：
  python3 tools/sync-ai-rankings.py [三榜HTML路径]

不传路径时，自动取
  /Users/huangjia1/WorkBuddy/2026-08-18-16-07-00/AI大模型三榜对比_*.html
中文件名日期最新的一份。

设计原则：
- 只从图表 HTML 读取，不额外推测或补数。
- A 栏取「基模（国内）」与「海外模型」两组；B/C 栏取全部行。
- 中文数值保留 亿/万，英文换算为 B/M/K。
- 保留现有站点 Tab 文案结构，刷新数值、日期口径和排序。
"""
import glob
import html
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHART_DIR = Path("/Users/huangjia1/WorkBuddy/2026-08-18-16-07-00")
CONTENT_ZH = ROOT / "assets/data/content.js"
CONTENT_EN = ROOT / "assets/data/content.en.js"

BASE_EN = {
    "豆包": "Doubao",
    "千问": "Qwen",
    "DeepSeek": "DeepSeek",
    "腾讯元宝": "Tencent Yuanbao",
    "Kimi": "Kimi",
    "纳米AI搜索": "Nano AI Search",
    "文心": "ERNIE Bot",
    "智谱清言": "ChatGLM",
    "MiniMax": "MiniMax",
    "ChatGPT": "ChatGPT",
    "Gemini": "Gemini",
    "Grok": "Grok",
    "Claude": "Claude",
    "Perplexity": "Perplexity",
    "Character.AI": "Character.AI",
    "Nova": "Nova",
    "纳米AI": "Nano AI",
    "百度文库": "Baidu Wenku",
    "百度搭子": "Baidu Dazi",
    "WorkBuddy": "WorkBuddy",
}
VENDOR_EN = {
    "字节": "ByteDance",
    "阿里": "Alibaba",
    "月之暗面": "Moonshot AI",
    "360": "360",
    "百度": "Baidu",
    "深度求索": "DeepSeek",
    "腾讯": "Tencent",
    "OpenAI": "OpenAI",
    "Google": "Google",
    "xAI": "xAI",
    "Anthropic": "Anthropic",
    "亚马逊": "Amazon",
    "稀宇科技": "MiniMax",
    "智谱": "Zhipu",
    "小米": "Xiaomi",
    "MiniMax": "MiniMax",
    "NVIDIA": "NVIDIA",
}
EXTRA_VENDOR = {
    "DeepSeek": "深度求索",
    "智谱清言": "智谱",
    "MiniMax": "稀宇科技",
    "腾讯元宝": "腾讯",
}


def clean(text: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", text or "")).strip()


def find_latest_chart() -> Path:
    files = glob.glob(str(CHART_DIR / "AI大模型三榜对比_*.html"))
    if not files:
        raise SystemExit(f"未找到三榜图：{CHART_DIR}/AI大模型三榜对比_*.html")

    def stamp(p: str) -> str:
        m = re.search(r"_(\d{8})\.html$", p)
        return m.group(1) if m else "0"

    return Path(sorted(files, key=stamp)[-1])


def split_columns(source: str) -> list[str]:
    starts = [m.start() for m in re.finditer(r'<div class="col(?: [^"]*)?">', source)]
    if len(starts) < 3:
        raise SystemExit(f"三榜 HTML 栏目数异常：{len(starts)}")
    foot = source.find('<div class="foot">', starts[2])
    if foot < 0:
        foot = len(source)
    ends = starts[1:3] + [foot]
    return [source[a:b] for a, b in zip(starts[:3], ends)]


def parse_rows(segment: str) -> dict[str, list[dict]]:
    """返回 {section 名称: [row]}；row 含 name/tag/value/mom。"""
    groups: dict[str, list[dict]] = {}
    current = ""
    token_re = re.compile(
        r'<div class="sec">(.*?)</div>|<div class="row">([\s\S]*?)</div></div>'
    )
    for match in token_re.finditer(segment):
        if match.group(1):
            current = clean(match.group(1))
            groups.setdefault(current, [])
            continue
        raw = match.group(2)
        name_match = re.search(
            r'<span class="name">([\s\S]*?)</span><span class="val">', raw
        )
        val_match = re.search(r'<span class="val">(.*?)</span>', raw)
        mom_match = re.search(r'<span class="mom[^"]*">(.*?)</span>', raw)
        rank_match = re.search(r'<span class="rank">(.*?)</span>', raw)
        if not name_match or not val_match:
            continue
        if not current:
            current = "__all__"
            groups.setdefault(current, [])
        name_html = name_match.group(1)
        tag_match = re.search(r'<span class="tag"[^>]*>(.*?)</span>', name_html)
        tag = clean(tag_match.group(1)) if tag_match else ""
        name = clean(re.sub(r'<span class="tag"[^>]*>.*?</span>', "", name_html))
        if not name:
            continue
        groups.setdefault(current, []).append(
            {
                "name": name,
                "tag": tag,
                "value": clean(val_match.group(1)),
                "mom": clean(mom_match.group(1)) if mom_match else "",
                "rank": clean(rank_match.group(1)) if rank_match else "",
            }
        )
    return groups


def zh_value(value: str) -> str:
    value = value.strip()
    value = re.sub(r"\s*([亿万])\s*", r" \1", value)
    return value


def en_value(value: str) -> str:
    value = value.strip().replace(" ", "")
    match = re.fullmatch(r"([\d.]+)(亿|万|T|B|M|K)?", value, re.I)
    if not match:
        return value
    num = float(match.group(1))
    unit = (match.group(2) or "").upper()
    if unit in ("亿", "万"):
        base = num * (1e8 if unit == "亿" else 1e4)
    elif unit == "T":
        return f"{num:g}T"
    elif unit == "B":
        base = num * 1e9
    elif unit == "M":
        base = num * 1e6
    elif unit == "K":
        base = num * 1e3
    else:
        return f"{num:g}"
    if base >= 1e9:
        return f"{base / 1e9:g}B"
    if base >= 1e6:
        return f"{base / 1e6:g}M"
    if base >= 1e3:
        return f"{base / 1e3:g}K"
    return f"{base:g}"


def en_base(name: str) -> str:
    return BASE_EN.get(name, name)


def en_vendor(tag: str) -> str:
    return VENDOR_EN.get(tag, tag)


def a_items(rows: list[dict], lang: str) -> list[dict]:
    out = []
    for row in rows:
        name = row["name"]
        tag = row["tag"] or EXTRA_VENDOR.get(name, "")
        if lang == "zh":
            label = f"{name}（{tag}）" if tag else name
            value = zh_value(row["value"])
            note = f"环比 {row['mom']}" if row["mom"] else ""
        else:
            base_en, vendor_en = en_base(name), en_vendor(tag)
            label = f"{base_en} ({vendor_en})" if tag and vendor_en != base_en else base_en
            value = en_value(row["value"])
            note = f"MoM {row['mom']}" if row["mom"] else ""
        out.append({"label": label, "value": value, "note": note})
    return out


def split_b_name(name: str) -> tuple[str, str]:
    parts = re.split(r"\s*[｜|]\s*", name, maxsplit=1)
    if len(parts) == 2:
        return parts[0], parts[1]
    return name, ""


def table_rows(rows: list[dict], lang: str, kind: str) -> list[list[str]]:
    out = []
    for row in rows:
        if kind == "b":
            base, vendor = split_b_name(row["name"])
            if not vendor:
                vendor = row["tag"]
        else:
            base, vendor = row["name"], row["tag"]
        if lang == "zh":
            name = f"{base} | {vendor}" if vendor else base
            value = zh_value(row["value"])
            mom = row["mom"]
        else:
            if kind == "b":
                name = f"{en_base(base)} | {en_vendor(vendor)}" if vendor else en_base(base)
            else:
                name = f"{base} · {en_vendor(vendor)}" if vendor else base
            value = en_value(row["value"])
            mom = row["mom"]
        out.append([name, value, mom])
    return out


def load_content(path: Path, global_name: str) -> dict:
    raw = path.read_text(encoding="utf-8")
    start = raw.find("{")
    end = raw.rfind("}")
    if start < 0 or end < 0:
        raise SystemExit(f"内容文件结构异常：{path}")
    return json.loads(raw[start : end + 1])


def save_content(path: Path, global_name: str, data: dict) -> None:
    if global_name == "SITE_DATA":
        header = (
            "/* 京东科技 GEO 产品介绍站 · 中文内容数据\n"
            "   所有页面集中在 pages 下；修改后请运行 node tools/build-i18n.js 校验中英文结构。 */\n\n"
        )
    else:
        header = (
            "/* JD Technology GEO Product Site · English content data\n"
            "   Keep this structure aligned with content.js and run node tools/build-i18n.js after edits. */\n\n"
        )
    path.write_text(
        header + f"window.{global_name} = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )


def period_info(raw: str) -> dict:
    """从栏头日期文本中取月份、期数或 OpenRouter 截止日。"""
    month = re.search(r"(\d{4})\s*年\s*(\d{1,2})\s*月", raw)
    issue = re.search(r"第\s*(\d+)\s*期", raw)
    as_of = re.search(r"(\d{4}-\d{2}-\d{2})", raw)
    return {
        "month": f"{month.group(1)} 年 {int(month.group(2))} 月" if month else "",
        "month_en": f"{month.group(1)}-{int(month.group(2)):02d}" if month else "",
        "issue": issue.group(1) if issue else "",
        "as_of": as_of.group(1) if as_of else "",
    }


def sync_language(data: dict, parsed: dict, lang: str, chart_date: str) -> None:
    engine = next(s for s in data["pages"]["home"]["sections"] if s.get("id") == "engine")
    tabs_block = next(b for b in engine["blocks"] if b.get("type") == "tabs")
    tabs = tabs_block["items"]
    if len(tabs) != 4:
        raise SystemExit(f"站点三榜 Tab 数异常：{len(tabs)}")

    domestic = next(rows for sec, rows in parsed["a"].items() if "基模" in sec)
    overseas = next(rows for sec, rows in parsed["a"].items() if "海外" in sec)
    if not domestic or not overseas:
        raise SystemExit("A 栏未解析到「基模」或「海外模型」完整数据")

    tabs[0]["panels"][0]["items"] = a_items(domestic, lang)
    tabs[1]["panels"][0]["items"] = a_items(overseas, lang)
    tabs[2]["panels"][0]["rows"] = table_rows(parsed["b"], lang, "b")
    tabs[3]["panels"][0]["rows"] = table_rows(parsed["c"], lang, "c")

    a = period_info(parsed["dates"]["a"])
    b = period_info(parsed["dates"]["b"])
    c = period_info(parsed["dates"]["c"])
    if lang == "zh":
        tabs[0]["panels"][0]["note"] = (
            f"最新数据日期：{a['month']} · AI 产品榜第 {a['issue']} 期 · 名单制（基模）· 单位：月活跃用户。"
            "口径：GEO 客户关注入口名单制看板，组内按 MAU 降序，与三榜图同步更新。"
        )
        tabs[1]["panels"][0]["note"] = (
            f"最新数据日期：{a['month']} · AI 产品榜第 {a['issue']} 期 · 海外取全球榜 · 按 MAU 降序，与三榜图同步更新。"
        )
        tabs[2]["panels"][0]["note"] = (
            f"最新数据日期：{b['month']} · 网站榜第 {b['issue']} 期 · 国内 TOP10 · 单位：月访问量，与三榜图同步更新；含重复访问。"
        )
        tabs[3]["panels"][0]["note"] = (
            f"截至 {c['as_of']} · OpenRouter 官方周榜 · 滚动 7 天窗口 · 单位：万亿 Token/周，与三榜图同步更新。"
        )
    else:
        tabs[0]["panels"][0]["note"] = (
            f"Latest data: {a['month_en']} · AI Product Rankings No. {a['issue']} · curated foundation-model list · monthly active users. "
            "Sorted by MAU within the group and synced with the three-ranking chart."
        )
        tabs[1]["panels"][0]["note"] = (
            f"Latest data: {a['month_en']} · AI Product Rankings No. {a['issue']} · global ranking for overseas models · sorted by MAU and synced with the three-ranking chart."
        )
        tabs[2]["panels"][0]["note"] = (
            f"Latest data: {b['month_en']} · Website Rankings No. {b['issue']} · China TOP 10 · monthly visits, synced with the three-ranking chart; includes repeat visits."
        )
        tabs[3]["panels"][0]["note"] = (
            f"As of {c['as_of']} · OpenRouter official weekly ranking · rolling 7-day window · trillions of tokens per week, synced with the three-ranking chart."
        )
    data["meta"]["updated"] = chart_date


def main() -> None:
    chart = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else find_latest_chart()
    if not chart.exists():
        raise SystemExit(f"文件不存在：{chart}")
    source = chart.read_text(encoding="utf-8")
    columns = split_columns(source)
    parsed = {
        "a": parse_rows(columns[0]),
        "b": next(iter(parse_rows(columns[1]).values()), []),
        "c": next(iter(parse_rows(columns[2]).values()), []),
        "dates": {},
    }
    if not parsed["b"] or not parsed["c"]:
        raise SystemExit("B/C 栏数据解析为空，已中止，不写入站点")
    if not any("基模" in sec for sec in parsed["a"]) or not any("海外" in sec for sec in parsed["a"]):
        raise SystemExit("A 栏分组解析失败，已中止，不写入站点")

    date_tags = [clean(x) for x in re.findall(r'<div class="col-date">([\s\S]*?)</div>', source)]
    if len(date_tags) < 3:
        raise SystemExit("未读取到三栏日期口径，已中止")
    parsed["dates"]["a"], parsed["dates"]["b"], parsed["dates"]["c"] = date_tags[:3]
    header_match = re.search(r"更新日期：\s*([0-9]{4}-[0-9]{2}-[0-9]{2})", source)
    chart_date = header_match.group(1) if header_match else re.search(r"_(\d{8})", chart.name).group(1)
    if re.fullmatch(r"\d{8}", chart_date):
        chart_date = f"{chart_date[:4]}-{chart_date[4:6]}-{chart_date[6:]}"

    zh = load_content(CONTENT_ZH, "SITE_DATA")
    en = load_content(CONTENT_EN, "SITE_DATA_EN")
    sync_language(zh, parsed, "zh", chart_date)
    sync_language(en, parsed, "en", chart_date)
    save_content(CONTENT_ZH, "SITE_DATA", zh)
    save_content(CONTENT_EN, "SITE_DATA_EN", en)

    print(f"已同步三榜：{chart.name}")
    print(f"  更新日期：{chart_date}")
    print(f"  A 国内 {len(parsed['a'].get(next(sec for sec in parsed['a'] if '基模' in sec), []))} 条 / "
          f"海外 {len(parsed['a'].get(next(sec for sec in parsed['a'] if '海外' in sec), []))} 条 / "
          f"B {len(parsed['b'])} 条 / C {len(parsed['c'])} 条")
    print("下一步：node tools/build-i18n.js && node tools/build-singlefile.js && node tools/push-github.js")


if __name__ == "__main__":
    main()
