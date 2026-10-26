/* ============================================================
   JD Technology GEO · English content data (parallel to content.js)
   ------------------------------------------------------------
   Structure is identical to content.js — same keys, same array
   lengths, same flags. Only the strings differ.
   Regenerate with:  node tools/build-i18n.js --check
   ============================================================ */

window.SITE_DATA_EN = {

  /* ---------- Site meta ---------- */
  meta: {
    brand: 'JD Technology',
    title: 'JD Technology GEO — Generative Engine Optimization',
    version: 'v1.0',
    updated: '2026-10-26',
    ctaLabel: 'Get a Proposal',
    updatedLabel: 'Updated'
  },

  /* ---------- Footer ---------- */
  footer: {
    brand: 'JD Technology · AI Applications Division | Generative Engine Optimization (GEO) solutions that make your brand a trusted recommendation inside AI answers.',
    copy: '© 2026 JD Technology · GEO Solutions',
    cols: [
      {
        title: 'Product',
        items: [
          { text: 'Domestic GEO Solution', href: 'index.html' },
          { text: 'Overseas GEO Solution', href: 'overseas.html' },
          { text: 'AI User Intent Insights', href: 'insight.html' }
        ]
      },
      {
        title: 'Capabilities',
        items: [
          { text: 'AI Perception Audit' },
          { text: 'Intent Question Bank' },
          { text: 'AIGC Content & Source Strategy' },
          { text: 'Citation & Trust Boosting' },
          { text: 'Monitoring & Review Iteration' }
        ]
      },
      {
        title: 'Contact',
        items: [
          { text: 'Website: geo.jdcloud.com' },
          { text: 'Platforms: Doubao / Qwen / DeepSeek / Yuanbao' },
          { text: 'Overseas platforms: ChatGPT / Claude / Gemini / Perplexity' }
        ]
      }
    ]
  },

  /* ==========================================================
     Page 1: Home — Domestic GEO Solution
     ========================================================== */
  pages: {

    /* ============================================================
       HOME — Domestic GEO
       ============================================================ */
    home: {
      title: 'Domestic GEO Solution',
      nav: [
        { label: 'Why GEO', href: '#why' },
        { label: 'What Is GEO', href: '#what' },
        { label: 'Core Value', href: '#value' },
        { label: 'Capabilities', href: '#engine' },
        { label: 'Delivery', href: '#delivery' },
        { label: 'Metrics', href: '#metrics' },
        { label: 'Cases', href: '#cases' },
        { label: 'FAQ', href: '#faq' }
      ],
      sections: [
        /* ===== Hero ===== */
        {
          type: 'hero',
          kicker: 'JD Technology · AI Applications Division',
          title: ['Harness the AI Era', 'Win the Traffic of Tomorrow'],
          accentLines: [1],
          desc: 'Enterprise-grade Generative Engine Optimization (GEO) — making your brand the trusted recommendation inside AI answers.',
          sub: 'Covering Doubao, Qwen, DeepSeek, Yuanbao and other leading AI scenarios · End-to-end delivery from diagnosis and strategy to content production, monitoring and review',
          buttons: [
            { label: 'Explore GEO Capabilities', href: '#engine' },
            { label: 'Get a Tailored Plan', href: '#contact', style: 'ghost' }
          ],
          meta: [
            { value: '1B+', label: 'Daily active users on top AI platforms' },
            { value: '68%', label: 'of consumers use AI recommendations when buying' },
            { value: '2 wks', label: 'Fastest time to results' },
            { value: '10+', label: 'Leading LLM platforms covered' }
          ]
        },

        /* ===== Why GEO ===== */
        {
          type: 'section', id: 'why', tone: 'surface',
          blocks: [
            {
              type: 'secHead',
              kicker: 'Market Inflection Point',
              title: 'AI Search Is Restructuring the Traffic Ecosystem',
              desc: 'Traffic power is shifting from "indexing" to "seeding" and then to "generation". If AI does not recognise you, you go silent in the world of user answers.'
            },
            {
              type: 'eras',
              items: [
                {
                  kicker: 'Search-Dependent Era · SEO',
                  title: 'The Search-Dependent Era',
                  desc: 'Consumers habitually type "which brand makes the best XX product" into the search box before ordering, and build their picture of a brand from Baidu Baike endorsements and parameter rankings on vertical platforms.'
                },
                {
                  kicker: 'Social Seeding Era · LSO / VSO',
                  title: 'The Social Seeding Era',
                  desc: 'Users no longer settle for passive search — they actively browse genuine user reviews on Douyin, Xiaohongshu and other platforms, so purchase decisions now carry strong social proof and experiential resonance.'
                },
                {
                  kicker: 'AI Decision Era · GEO',
                  title: 'The AI Decision Era',
                  desc: 'In the era of large models, more and more users turn to AI search tools to find answers and make decisions before buying. AI has become the new decision entry point.',
                  now: true
                }
              ]
            },
            {
              type: 'secHead',
              kicker: 'Risk Scenarios',
              title: 'Without GEO, How Does Your Brand Look in AI?',
              desc: 'These six outcomes are already happening in the AI answers of a large number of brands.'
            },
            {
              type: 'cards', cols: 3,
              items: [
                { title: 'Invisible', desc: 'You are "not there at all" in the AI corpus — users never think of you when they ask.' },
                { title: 'Competitor Wins', desc: 'For the same question, AI recommends a competitor — and the reasons it gives work against you.' },
                { title: 'Stale Information', desc: 'What you want users to see is either not indexed by AI or still cited from an outdated version.' },
                { title: 'Ranked Low', desc: 'AI can see you but does not recommend you first — you sit at the tail of the candidate set.' },
                { title: 'Overwhelmed by Negatives', desc: 'Negative reviews become the only content AI cites, and your strengths never surface.' },
                { title: 'Wrong Information', desc: 'Price, official website and other key facts appear wrong in AI answers, directly hurting conversion.' }
              ]
            }
          ]
        },

        /* ===== What Is GEO ===== */
        {
          type: 'section', id: 'what',
          blocks: [
            {
              type: 'secHead',
              kicker: 'Definition',
              title: 'What Is GEO?',
              desc: 'GEO (Generative Engine Optimization) is the growth discipline for AI search, Q&A and agent entry points. By "feeding" large models high-quality content, it lifts a brand\'s citation rate and recommendation placement in AI-generated answers.'
            },
            {
              type: 'cards', cols: 4,
              items: [
                { title: 'Shift in User Entry', desc: 'From clicking search links to simply asking AI.' },
                { title: 'Shift in Growth Logic', desc: 'From competing for click rankings to owning the answer slot.' },
                { title: 'Shift in Brand Mission', desc: 'From optimising site rankings to building source-of-truth assets.' },
                { title: 'Shift in Core Goal', desc: 'From being seen to being cited and being recommended.' }
              ]
            },
            {
              type: 'secHead',
              kicker: 'Comparison',
              title: 'How GEO Differs from Traditional SEO',
              desc: 'GEO is often called the "new SEO" for large models, but the two are built on different objectives, logics and measurement systems.'
            },
            {
              type: 'compare',
              head: ['Traditional SEO', 'GEO — Generative Engine Optimization'],
              rows: [
                ['Core objective', 'Win search rankings and clicks', 'Be cited by AI and become part of the generated answer'],
                ['User role', 'Users actively sift through links', 'Users ask AI and receive the answer directly'],
                ['Growth model', 'Improve keyword rankings', 'Improve authority and recommendation placement in AI answers'],
                ['Brand mission', 'Optimise site rankings and traffic', 'Become the "single answer" that AI generates'],
                ['Metrics', 'Rank, CTR, backlinks', 'Mention rate, recommendation rate, accuracy rate, positive rate']
              ]
            },
            {
              type: 'notice',
              icon: '※',
              title: 'In One Sentence',
              desc: 'SEO helps users find you in search results; GEO makes AI speak on your behalf when it generates answers.'
            }
          ]
        },

        /* ===== Core Value ===== */
        {
          type: 'section', id: 'value', tone: 'surface',
          blocks: [
            {
              type: 'secHead',
              kicker: 'Core Value',
              title: 'What GEO Brings to Your Brand',
              desc: 'AI conversations are reshaping how users discover, compare and decide. JD Technology GEO rebuilds a brand\'s presence in the AI ecosystem across four dimensions.'
            },
            {
              type: 'cards', cols: 4,
              items: [
                {
                  no: '01',
                  title: 'Own the New AI Decision Entry Points',
                  desc: 'Coverage across Doubao, Qwen, DeepSeek, Yuanbao, Quark, Kimi and other leading AI scenarios, so the brand enters the candidate set.'
                },
                {
                  no: '02',
                  title: 'Build a Brand-Friendly Source Asset Base',
                  desc: 'Technical weighting of brand-friendly sources makes AI prefer citing brand information.'
                },
                {
                  no: '03',
                  title: 'Guard Against Misread Information',
                  desc: 'Continuous monitoring of negative, outdated and incorrect answers, with timely correction to protect long-term brand perception.'
                },
                {
                  no: '04',
                  title: 'Shorten the Purchase Decision Path',
                  desc: 'Turn high-frequency user questions into citable answers, cutting repeated search and price-comparison effort.'
                }
              ]
            }
          ]
        },

        /* ===== Capability Engine ===== */
        {
          type: 'section', id: 'engine', tone: 'dark',
          blocks: [
            {
              type: 'secHead',
              kicker: 'Core Capability Engine',
              title: 'Discover → Diagnose → Produce → Distribute → Weight → Monitor → Iterate',
              desc: 'A standardised service loop covering the entire AI decision chain — not point-by-point placement, but an operating system that keeps converging.'
            },
            {
              type: 'cards', cols: 4,
              items: [
                {
                  no: '01',
                  title: 'Intent Question Radar',
                  list: [
                    'Content trend signals across AI search and seeding communities',
                    'JD.com in-site search, review and Q&A data',
                    'Question bank segmented by audience, scenario and intent'
                  ]
                },
                {
                  no: '02',
                  title: 'Content & Source Strategy',
                  list: [
                    'AIGC generation plus human editorial review',
                    'Technical crawler intervention to raise citation probability',
                    'One playbook per platform to match platform preferences'
                  ]
                },
                {
                  no: '03',
                  title: 'Impartial Monitoring & Evidence Retention',
                  list: [
                    'Multi-platform, multi-question, multi-frequency sampling',
                    'Snapshots of original AI answers retained',
                    'Competitor, source and sentiment comparison supported'
                  ]
                },
                {
                  no: '04',
                  title: 'Review & Counter-Attack Iteration',
                  list: [
                    'BI dashboards tracking core metrics',
                    'Detection of misreads, negatives and competitor squeeze',
                    'Weekly / monthly review to refine strategy'
                  ]
                }
              ]
            },
            {
              type: 'secHead',
              kicker: 'Product Capabilities',
              title: 'Six Capabilities Form the Complete Delivery Base',
              desc: 'From category insight to the results dashboard, every step has a matching platform capability and a deliverable.'
            },
            {
              type: 'table',
              head: ['Capability', 'What it solves'],
              rows: [
                ['AI Perception Audit', 'Category insight built on social listening, journey analysis and full-funnel VOC collection'],
                ['Semantic Keyword Mining', 'Keyword expansion, question phrasing diversity and a scenario-segmented user question bank'],
                ['AIGC Content Generation', 'Knowledge-graph correction plus official-site Schema upgrades, automating high-authority structured content'],
                ['GEO Optimization', 'Intent interception plus corpus-saturation feeding, ensuring priority recommendation in AI answers'],
                ['Performance Monitoring', 'BI dashboard visualisation'],
                ['GEO Metrics Monitoring', 'Tracking mention rate, recommendation rate, SOV and other core GEO metrics']
              ]
            },
            {
              type: 'secHead',
              kicker: 'Competitive Landscape',
              title: 'The AI Model Landscape: Three Rankings That Matter for GEO',
              desc: 'JD Technology continuously tracks AI platform traffic patterns to give brands an objective basis for platform selection.'
            },
            {
              type: 'tabs',
              items: [
                {
                  label: 'Consumer App MAU · Domestic Foundation Models',
                  panels: [
                    {
                      type: 'bars', max: 100,
                      note: 'Latest data: September 2026 · AI Product Ranking, week 40 · Named-list (base set) · Unit: monthly active users. Basis: the GEO client watchlist dashboard, sorted by MAU within each group.',
                      items: [
                        { label: 'Doubao (ByteDance)', value: '313M', note: 'MoM -0.39%' },
                        { label: 'Qwen (Alibaba)', value: '276M', note: 'MoM +1.71%' },
                        { label: 'DeepSeek (DeepSeek)', value: '139M', note: 'MoM +3.98%' },
                        { label: 'Tencent Yuanbao (Tencent)', value: '92.27M', note: 'MoM -4.81%' },
                        { label: 'Kimi (Moonshot AI)', value: '23.15M', note: 'MoM -12.38%' },
                        { label: 'Nami AI Search (360)', value: '6.62M', note: 'MoM -7.64%' },
                        { label: 'ERNIE Bot (Baidu)', value: '5.46M', note: 'MoM -3.47%' },
                        { label: 'ChatGLM (Zhipu AI)', value: '4.12M', note: 'MoM -4.32%' },
                        { label: 'MiniMax (MiniMax)', value: '3.62M', note: 'MoM +3.18%' }
                      ]
                    }
                  ]
                },
                {
                  label: 'Consumer App MAU · Overseas Models',
                  panels: [
                    {
                      type: 'bars', max: 100,
                      note: 'Latest data: September 2026 · AI Product Ranking, week 40 · Overseas figures taken from the global ranking · Sorted by MAU',
                      items: [
                        { label: 'ChatGPT (OpenAI)', value: '1.09B', note: 'MoM +6.13%' },
                        { label: 'Gemini (Google)', value: '240M', note: 'MoM +27.17%' },
                        { label: 'Grok (xAI)', value: '66.97M', note: 'MoM -0.82%' },
                        { label: 'Claude (Anthropic)', value: '58.96M', note: 'MoM +36.63%' },
                        { label: 'Perplexity', value: '22.66M', note: 'MoM -4.62%' },
                        { label: 'Character.AI', value: '18.25M', note: 'MoM -10.28%' },
                        { label: 'Nova (Amazon)', value: '17.48M', note: 'MoM -67.96%' }
                      ]
                    }
                  ]
                },
                {
                  label: 'B2B Web Monthly Visits',
                  panels: [
                    {
                      type: 'table',
                      head: ['Platform', 'Monthly Visits', 'MoM'],
                      numCols: [1, 2],
                      rows: [
                        ['DeepSeek', '448M', '-1.4%'],
                        ['Doubao | ByteDance', '162M', '+4.6%'],
                        ['Nami AI | 360', '119M', '-10.0%'],
                        ['ERNIE | Baidu', '56.79M', '+92.8%'],
                        ['Kimi | Moonshot AI', '52.11M', '-14.8%'],
                        ['DeepSeek API', '36.59M', '+45.3%'],
                        ['Qwen | Alibaba', '35.10M', '-2.9%'],
                        ['Baidu Wenku', '24.15M', '-5.6%'],
                        ['WorkBuddy | Tencent', '14.61M', '+135.0%'],
                        ['Tencent Yuanbao', '13.44M', '+8.4%']
                      ],
                      note: 'Latest data: August 2026 · Website ranking, domestic TOP10 (week 40 not yet published)'
                    }
                  ]
                },
                {
                  label: 'API Call Volume (Weekly Tokens)',
                  panels: [
                    {
                      type: 'table',
                      head: ['Model / Provider', 'Call Volume', 'MoM'],
                      numCols: [1, 2],
                      rows: [
                        ['DS V4.1 Flash · DeepSeek', '27.3T', '-7.8%'],
                        ['GLM 5.3 Flash · Zhipu', '11.6T', '-2.5%'],
                        ['DS V4.1 Flash 1017 · DeepSeek', '11.5T', '+56.7%'],
                        ['MiMo-V2.6-Flash · Xiaomi', '9.05T', '-5.4%'],
                        ['Hy4 preview · Tencent', '8.16T', '+4.3%'],
                        ['Claude Opus 5.5 · Anthropic', '6.80T', '+5.1%'],
                        ['GPT-6 Luna · OpenAI', '6.21T', '-0.3%'],
                        ['Step 5 Preview', '5.82T', '-29.2%'],
                        ['GLM 5.3 · Zhipu', '5.32T', '+0.6%'],
                        ['MiniMax M3.1 Flash', '4.97T', 'New entrant']
                      ],
                      note: 'As of 2026-10-20 · Official OpenRouter weekly ranking. Window moved 10/19 → 10/20: the new DeepSeek V4.1 Flash 1017 rose to #3'
                    }
                  ]
                }
              ]
            }
          ]
        },

        /* ===== Delivery Process ===== */
        {
          type: 'section', id: 'delivery', tone: 'surface',
          blocks: [
            {
              type: 'secHead',
              kicker: 'End-to-End Delivery Process',
              title: 'Eight Steps, From Perception Audit to Performance Review',
              desc: 'Diagnose → Strategise → Execute → Monitor → Review: a closed-loop, standardised delivery. The client only provides core materials — everything else is on us.'
            },
            {
              type: 'flow',
              items: [
                { no: '01', title: 'Align Requirements', desc: 'Target platforms, core KPIs' },
                { no: '02', title: 'AI Perception Audit', desc: 'Baseline sampling, competitor comparison' },
                { no: '03', title: 'Intent Question Bank', desc: 'Audience, scenario and query tiering' },
                { no: '04', title: 'Strategy Design', desc: 'One playbook per engine, source planning' },
                { no: '05', title: 'Source Content', desc: 'Content standards, authoritative publishing' },
                { no: '06', title: 'Citation Boosting', desc: 'Crawler intervention, higher citation rate' },
                { no: '07', title: 'Monitor & Defend', desc: 'Periodic retesting, sentiment correction' },
                { no: '08', title: 'Review & Handover', desc: 'Performance report, in-site closed loop' }
              ]
            },
            {
              type: 'secHead',
              kicker: 'Service Cadence',
              title: 'Three Phases, With a Clear Timeline'
            },
            {
              type: 'cards', cols: 3,
              items: [
                {
                  title: 'Kickoff (Week 1)',
                  desc: 'Confirm goals and industry, then run the AI perception audit.',
                  list: ['Diagnostic report delivered', 'Initial optimisation recommendations']
                },
                {
                  title: 'Ramp-up (Months 1–2)',
                  desc: 'Build the four-dimensional question bank, upgrade official-site Schema, lay the first resource matrix.',
                  list: ['Knowledge base and content rollout', 'Visible results within a single week']
                },
                {
                  title: 'Scale-up (Months 3–6)',
                  desc: 'Dynamic defence operations, monthly review reporting, full monitoring report delivery.',
                  list: ['Daily / weekly / monthly / quarterly review', 'Continuous strategy iteration']
                }
              ]
            },
            {
              type: 'secHead',
              kicker: 'Step-by-Step Breakdown',
              title: 'What Each Step Does, What We Deliver, and What We Need From You'
            },
            {
              type: 'table',
              head: ['Step', 'Duration', 'Objective', 'JD Technology Delivers', 'Client Provides'],
              rows: [
                ['Question Discovery', '1–3 days', 'Find the high-frequency questions relevant to the client', 'Question list', 'Provide a brief covering: ① the brand/product to optimise and its advantages ② the AI platforms to optimise for ③ the target KPI (e.g. presence, top-3)'],
                ['Intent Diagnosis', '2–3 days', 'Query performance data and optimisation recommendations', 'Diagnostic report', 'None'],
                ['Difficulty Assessment', '2–3 days', 'Analyse optimisation difficulty and recommend KPIs and targets', 'Assessment report (recommended KPIs, pricing)', 'None'],
                ['Knowledge Base Build', '5 days', 'Generate a brand-specific, accurate knowledge base', 'The generated knowledge base', 'Provide and confirm knowledge base materials (whitepapers, assessment documents, etc.)'],
                ['Content Generation', '2 weeks – 1 month', 'Produce articles that large models cite heavily', 'The generated articles', 'None'],
                ['Article Publication', '2 weeks – 1 month', 'Secure high-authority media placements and publish', 'None', 'None'],
                ['Data Monitoring', '1–2 weeks', 'Data observation and performance tracking', 'A selection of published article links for verification', 'None'],
                ['Ongoing Maintenance', 'Ongoing', 'Data observation and optimisation of underperforming areas', 'None', 'Acceptance of the phase report or project review report'],
                ['Project Delivery', 'Ongoing', 'Daily / weekly / monthly reports or a review report; analysis of current data and the optimisation strategy ahead', 'Review report', 'Acceptance of the phase report or project review report']
              ],
              note: 'The citation-optimisation track requires no knowledge base build and no article publishing; ramp-up takes 2 weeks.'
            }
          ]
        },

        /* ===== Metrics ===== */
        {
          type: 'section', id: 'metrics',
          blocks: [
            {
              type: 'secHead',
              kicker: 'Core Evaluation Metrics',
              title: 'From Visibility and Trust to Positivity, Recommendation and Conversion',
              desc: 'Six rate-based metrics quantify performance in the AI ecosystem. Each has a precise calculation basis, retested continuously with the same basis, sample and cycle.'
            },
            {
              type: 'cards', cols: 3,
              items: [
                { title: 'Brand Mention Rate', desc: 'How often the brand or product appears in AI answers' },
                { title: 'Top Recommendation Rate', desc: 'How often the brand or product takes the primary recommendation slot' },
                { title: 'SOV Share of Voice', desc: 'The brand or product share within category AI answers' },
                { title: 'Information Accuracy Rate', desc: 'How correct brand or product information is in AI answers' },
                { title: 'Positive Sentiment Rate', desc: 'Share of brand or product answers expressed positively' },
                { title: 'Key Message Mention Rate', desc: 'How often target messages — value propositions, selling points, campaign information — appear in AI answers' }
              ]
            },
            {
              type: 'secHead',
              kicker: 'Calculation Basis',
              title: 'Metric Definitions and How They Are Calculated'
            },
            {
              type: 'table',
              head: ['Metric', 'Definition', 'Calculation'],
              rows: [
                ['Share of Voice (SOV)', 'The share of times a brand is mentioned in AI search', 'SOV = (total mentions of a brand ÷ total mentions across all brands) × 100%'],
                ['Share of Voice (SOV, deduplicated)', 'The deduplicated share of times a brand is mentioned in AI search', 'SOV (deduplicated) = (number of answers mentioning a brand ÷ total number of answers mentioning any brand) × 100%'],
                ['Mention Rate', 'The share of times a brand appears in AI search results', 'Brand mention rate = (mentions ÷ questions asked) × 100%'],
                ['Top-1 Share', 'The share of AI answers where the brand ranks #1', 'TOP-1 recommendation rate = (number of TOP-1 occurrences ÷ questions asked) × 100%'],
                ['Top-3 Share', 'The share of AI answers where the brand ranks in the top 3', 'TOP-3 recommendation rate = (number of TOP-3 occurrences ÷ questions asked) × 100%'],
                ['AI Answer Count', 'The total number of AI answers collected across all platforms', 'Direct count']
              ]
            },
            {
              type: 'secHead',
              kicker: 'Platform User Profiles',
              title: 'AI Users on Different Platforms Decide Differently',
              desc: 'Profiles drawn from the QuestMobile "2026 GEO Research Report on AI E-commerce and Consumer Categories".'
            },
            {
              type: 'table',
              head: ['Platform', 'Vendor', 'Gender skew', 'Core age', 'City tier', 'Spending power', 'Core audience'],
              rows: [
                ['Doubao', 'ByteDance', 'Slightly female-skewed', 'Young adults', 'Mid-to-high tier cities', 'Mid-to-high online spend', 'Core decision-makers for skincare, cosmetics and small appliances'],
                ['Qwen (Tongyi)', 'Alibaba', 'Slightly female-skewed', 'Mainly post-90s', 'Concentrated in tier-1 cities', 'High (strong above ¥2,000)', 'Spec-sensitive 3C buyers, early adopters'],
                ['DeepSeek', 'DeepSeek', 'Slightly male-skewed', 'Young adults', 'Mainly tier-1/2 cities', 'Mid-to-high', 'Tech enthusiasts, developers, professional users'],
                ['Tencent Yuanbao', 'Tencent', 'Fairly balanced', 'All ages', 'All city tiers', 'Medium', 'WeChat-ecosystem users, socially driven'],
                ['ERNIE Bot', 'Baidu', 'Mostly male', 'Core: post-90s / post-80s', 'High-tier cities', 'Strongly high spending power', 'Core target audience for tech and home appliances'],
                ['Kimi', 'Moonshot AI', 'Fairly balanced', 'Students / young professionals', 'High-tier cities', 'Medium', 'Long-form, academic and workplace document processing']
              ]
            },
            {
              type: 'split', wide: true,
              left: {
                type: 'checks',
                title: 'Doubao | An All-Rounder AI for Everyone',
                desc: 'Mainly 18–35, slightly female-skewed, covering tier-1/2 and new tier-1 cities, with continuing penetration into lower-tier markets.',
                items: [
                  'Core needs: study Q&A, office documents, copywriting and everyday advice — solved in one lightweight place',
                  'Behaviour: values speed and immediate results, content that can be reused as-is, tuned to native Chinese context',
                  'Core trait: both a practical tool and an emotional-value companion, with broad accessibility'
                ]
              },
              right: {
                type: 'checks',
                title: 'DeepSeek | A Preference for Structured Depth',
                desc: 'Mainly 18–35, concentrated among students, developers, product managers, data analysts and other knowledge workers.',
                items: [
                  'Core needs: code generation and debugging, document processing and summarisation, logical reasoning and decision support',
                  'Behaviour: prefers structured output — lists, tables, code blocks — and values continuity of context',
                  'User trait: efficiency-driven, resistant to advertising and entertainment content'
                ]
              }
            },
            {
              type: 'split', wide: true,
              left: {
                type: 'checks',
                title: 'Qwen | Oriented to Transaction Scenarios',
                desc: 'Clearly younger-skewed: post-00s and post-90s together make up 52.9%, and male users account for 83.0%.',
                items: [
                  'Geography: deeper penetration in lower-tier markets, with 46.9% of users in tier-3 cities and below',
                  'User behaviour: everyday-services orientation, with 78% relying on the "order in one sentence" feature',
                  'Core trait: hard specs and technology-led, with a focus on transaction scenarios'
                ]
              },
              right: {
                type: 'checks',
                title: 'Tencent Yuanbao | Working Life Inside the WeChat Ecosystem',
                desc: '72% are 18–35, mostly WeChat-ecosystem professionals (roughly 46% aged 25–35) and university students.',
                items: [
                  'Core scenarios: lightweight office work inside WeChat, social creation, everyday Q&A and light entertainment',
                  'User trait: heavily dependent on the WeChat ecosystem, seeking no app switching, fast responses and lightweight efficiency',
                  'Commercial trait: high acceptance of AI but low willingness to pay, preferring free plus social-referral mechanics'
                ]
              }
            }
          ]
        },

        /* ===== Case Studies ===== */
        {
          type: 'section', id: 'cases', tone: 'surface',
          blocks: [
            {
              type: 'secHead',
              kicker: 'Case Studies',
              title: 'From 26% to 75%, From 3% to 24%',
              desc: 'All cases below are based on re-running the keyword baseline on real projects, showing honestly how brand mention rates and recommendation placement moved from before to after optimisation.'
            },
            {
              type: 'cases',
              items: [
                {
                  tag: 'Domestic Case · 3C & Digital',
                  title: 'A Domestic E-commerce Platform, 618 Campaign',
                  desc: 'Despite an commanding lead in the digital category, AI large models captured the campaign information late and without focus, so the 618 benefit points never reached users in time. The task was to plant benefit points for consumer intent questions of the "which channel to buy digital and audio products from" type on mainstream AI search platforms.',
                  metrics: [
                    { label: 'Platforms optimised', value: 'DeepSeek / Doubao / Qwen' },
                    { label: 'Single-benefit exposure rate', value: '26%' },
                    { label: 'Full-benefit exposure rate', value: '75%' }
                  ],
                  foot: 'After optimisation, coverage extended from a single benefit point to the complete benefit set.'
                },
                {
                  tag: 'Domestic Case · Semiconductors',
                  title: 'A Global Leading Chip Platform',
                  desc: 'The goal was to raise the exposure share of host SKUs built on its chips when consumers search for intent questions such as "student laptop recommendations" on leading AI search platforms, and to shift exposure from legacy models to new ones.',
                  metrics: [
                    { label: 'Platforms optimised', value: 'Doubao / Qwen' },
                    { label: 'Overall exposure share, first month', value: '34% → 65%' },
                    { label: 'New-product share', value: '0% → 55%' }
                  ],
                  foot: 'The main benchmark competitor\'s share was compressed from 28% to 23%.'
                },
                {
                  tag: 'Domestic Case · Computers',
                  title: 'A Leading PC Brand, New-Product Launch Period',
                  desc: 'The task was to win recommendation slots on leading AI search platforms, solving insufficient new-product exposure when consumers search for intent questions such as "slim laptop recommendations".',
                  metrics: [
                    { label: 'Platforms optimised', value: 'Doubao / Qwen' },
                    { label: 'New-product exposure share, first month', value: '3% → 24%' },
                    { label: 'Recommendation rank', value: 'Stable Top 3' }
                  ],
                  foot: 'In the relevant Q&A scenarios the brand holds a stable top-3 recommendation rank, and most prompts reach top-1.'
                }
              ]
            },
            {
              type: 'secHead',
              kicker: 'First-Party Validation · Home Appliances',
              title: 'JD Air Conditioners: The First Purchase Channel in AI Answers',
              desc: 'By planting JD\'s core advantages — genuine self-operated products, delivery-and-installation in one go, and full-cycle after-sales — across major AI platforms, we guide AI answers to recommend JD as the preferred online purchase channel.'
            },
            {
              type: 'table',
              head: ['Target keyword root', 'Brand Visibility', 'TOP-1 Recommendation', 'MoM Lift'],
              highlight: [0, 1, 2],
              rows: [
                ['Where is it safest to buy an air conditioner', '86.6%', '78.9%', 'Visibility +51.9PP / TOP-1 +51.5PP'],
                ['Recommended channel for buying air conditioners', '75.15%', '66.26%', 'Visibility +45.38PP / TOP-1 +39.57PP'],
                ['Any good air conditioner deals recently?', '73.6%', '—', 'Visibility +64PP / TOP-1 +46.46PP'],
                ['How to buy central air conditioning online?', '70.72%', '67.6%', 'Visibility +69.59PP / TOP-1 from 0 to 67.6%']
              ],
              note: 'The above reflects results after one month of optimisation.'
            },
            {
              type: 'notice',
              icon: '※',
              title: 'Speed to Results',
              desc: 'Industry agencies commonly suffer from long optimisation cycles and lagged feedback, with a full effect cycle of roughly 20–30 days. JD Technology GEO, backed by mature technical methods and high-authority content templates, approaches the problem across multiple scenarios and audience segments, lifting core metrics significantly in just 1–2 weeks.'
            },
            {
              type: 'table',
              head: ['Keyword root', 'Brand visibility MoM lift', 'TOP-1 recommendation MoM lift', 'TOP-3 recommendation MoM lift'],
              numCols: [1, 2, 3],
              rows: [
                ['How to pick an affordable AC for a one-bedroom rental?', '11.43%', '18.15%', '18.23%'],
                ['How to buy cost-effective whole-home ACs for a small flat', '25.43%', '21.70%', '22.15%'],
                ['618: which AC to choose when replacing one in a two-bedroom home?', '21.20%', '11.53%', '22.31%'],
                ['How to choose ACs for a family of three in an 80 m² two-bedroom home?', '29.56%', '14.33%', '14.64%'],
                ['How to pick a more practical AC for a nursery or elder room?', '16.95%', '5.13%', '5.46%'],
                ['How best to buy a full AC set for a family with pets', '9.20%', '7.68%', '7.68%']
              ],
              note: 'The above reflects a single week of results. A nursery or elder room falls into "high-consideration purchasing": the decision chain is long, a single piece of content rarely converts directly, and the algorithm judges its "commercial decision value" insufficient — so the lift is comparatively modest. Pet households are a small, niche vertical need with limited overall search volume, so the addressable increment naturally has an upper bound.'
            },
            {
              type: 'secHead',
              kicker: 'First-Party Validation · Cookware & Services',
              title: 'JD Cookware and JD Services: Even Categories With Weak Brand Recall Can Be Built',
              desc: 'In cookware, users have weaker brand and channel recall and more dispersed purchase decisions; services categories have longer decision chains. Through a standardised approach — customised AI content models, authoritative source matrix placement, and full-funnel cross-engine monitoring — JD Technology GEO finds efficient optimisation paths in both categories too.'
            },
            {
              type: 'table',
              head: ['Category / Keyword root', 'Metric', 'Before', 'After', 'MoM Growth'],
              numCols: [2, 3, 4],
              rows: [
                ['Cookware · Which channel sells good-looking bowls, lunch boxes and pots with trustworthy materials?', 'Brand visibility', '8.49%', '90.68%', '+82.19PP'],
                ['Cookware · Which channel sells good-looking bowls, lunch boxes and pots with trustworthy materials?', 'TOP-3 recommendation', '8.49%', '90.36%', '—'],
                ['Cookware · Where do I buy pots with safe materials?', 'Brand visibility', '4.63%', '89.17%', '+84.54PP'],
                ['Cookware · Where do I buy practical and good-looking teacups and teapots?', 'Brand visibility', '13.09%', '78.49%', '+65.4PP'],
                ['Cookware · Where do I buy teacups and teapots with genuinely non-fake materials?', 'TOP-3 recommendation', '8.06%', '68.14%', '—'],
                ['Services · Where can I book a reliable home cleaning service?', 'Brand visibility', '9.8%', '72.51%', '+62.71PP'],
                ['Services · Recommend some well-known on-site laundry and shoe-cleaning platforms', 'Brand visibility', '33.17%', '77.58%', '+44.41PP'],
                ['Services · My appliance is old — I want a professional technician to clean it at home', 'Brand visibility', '24.37%', '83.18%', '+58.81PP'],
                ['Services · Where can I book appliance repair online with good service and low prices?', 'Brand visibility', '60.62%', '81.06%', '+20.98PP']
              ],
              note: 'For cookware, information implanted across major AI platforms covers a varied range of styles, food-grade material certification and genuine after-sales guarantees. For services, the work focuses on the core requirement of "self-operated and legitimate, transparent pricing, after-sales backup".'
            },
            {
              type: 'secHead',
              kicker: 'Real Answers',
              title: 'Actual Answers on AI Platforms',
              desc: 'The following are real AI answer screenshots from JD Home Services and JD Services on Qwen, DeepSeek and Yuanbao. The red box marks where JD Services was recommended first.'
            },
            {
              type: 'gallery',
              items: [
                {
                  src: 'assets/img/proof-clean.jpg',
                  alt: 'Real AI answer screenshots on Qwen, DeepSeek and Yuanbao recommending JD home cleaning services',
                  cap: '<b>Home Cleaning</b> | "Where can I book a reliable home cleaning service?" — all three platforms (Qwen, DeepSeek, Yuanbao) recommend JD Home Services first, with brand visibility rising from 9.8% to 72.51%.'
                },
                {
                  src: 'assets/img/proof-laundry.jpg',
                  alt: 'Real AI answer screenshots on Qwen, DeepSeek and Yuanbao recommending JD laundry services',
                  cap: '<b>On-site Laundry & Shoe Cleaning</b> | "Can you recommend a good on-site laundry and shoe-cleaning platform?" — all three platforms list JD Services (JD Laundry) as the top choice, with brand visibility rising from 33.17% to 77.58%.'
                },
                {
                  src: 'assets/img/proof-cleaning.jpg',
                  alt: 'Real AI answer screenshots on Qwen, DeepSeek and Yuanbao recommending JD appliance cleaning services',
                  cap: '<b>Appliance Cleaning</b> | "My appliance is old and I want a professional technician to clean it at home — where can I book it directly?" — JD Services is recommended first on speed and after-sales guarantees, with brand visibility rising from 24.37% to 83.18%.'
                },
                {
                  src: 'assets/img/proof-repair.jpg',
                  alt: 'Real AI answer screenshots on Qwen, DeepSeek and Yuanbao recommending JD appliance repair services',
                  cap: '<b>Appliance Repair</b> | "Where can I book appliance repair online with good service and low prices?" — JD Services takes the top slot with self-operated certified engineers, original parts and a 90-day warranty, with brand visibility rising from 60.62% to 81.06%.'
                }
              ]
            }
          ]
        },

        /* ===== Differentiators ===== */
        {
          type: 'section', id: 'advantage', tone: 'dark',
          blocks: [
            {
              type: 'secHead',
              kicker: 'Three Differentiators',
              title: 'Why JD Technology for GEO',
              desc: 'Not an agency that first built a service and then looked for scenarios — but an ecosystem with its own e-commerce platform, its own technology and its own validation ground.'
            },
            {
              type: 'cards', cols: 3,
              items: [
                {
                  no: '01',
                  title: 'JD Ecosystem Data Advantage',
                  desc: 'Fuses trending-search data from Doubao (exclusive), JD.com, Xiaohongshu, Douyin, WeChat and Weibo, so the questions we optimise are more accurate.'
                },
                {
                  no: '02',
                  title: 'Exclusive JD Cloud Optimisation Technology',
                  desc: 'A high-authority media matrix plus citation optimisation and structured Schema build the AI preferred-citation chain — faster to take effect (as quick as 2 weeks) and stable in outcome.'
                },
                {
                  no: '03',
                  title: 'Validated Across Industries',
                  desc: 'Proven in 3C, home appliances, travel and culture and other industries. The GEO team that builds it for JD.com now brings that capability to clients, so optimisation quality is better guaranteed.'
                }
              ]
            },
            {
              type: 'secHead',
              kicker: 'Engagement Model',
              title: 'Minimal Input, Fast Start'
            },
            {
              type: 'cards', cols: 4,
              items: [
                { title: 'Full-Platform Coverage', desc: 'Fits mainstream AI platforms including Doubao, DeepSeek, Tencent Yuanbao, Kimi and Baidu ERNIE Bot.' },
                { title: 'Kickoff in 1 Week', desc: 'One set of core brand materials is all we need to start the project quickly.' },
                { title: 'Minimal Client Effort', desc: '15 minutes a week to accept results, plus 30 minutes a month for review.' },
                { title: '1V1 in a Single Vertical', desc: 'Only one brand is served in a given vertical, so the whole team is focused on getting that brand results.' }
              ]
            },
            {
              type: 'notice',
              icon: '※',
              title: 'KPI Guarantee',
              desc: 'KPIs are written into the contract. We typically commit to a 60% TOP-3 recommendation rate. If the target is missed, the client chooses either: ① settlement in proportion to the days actually met; or ② an extension of the delivery deadline, with the service provider continuing to work until the shortfall is made up.',
              tone: 'neutral'
            }
          ]
        },

        /* ===== FAQ ===== */
        {
          type: 'section', id: 'faq', tone: 'surface',
          blocks: [
            {
              type: 'secHead',
              kicker: 'FAQ',
              title: 'The Seven Questions Clients Ask Most About GEO'
            },
            {
              type: 'faq',
              items: [
                { q: 'How is GEO different from SEO?', a: 'SEO optimises how a website ranks in search engines; GEO optimises a brand\'s citation rate and recommendation placement in AI-generated answers. As users shift from clicking links to asking AI, GEO is becoming the new battleground for brand traffic.' },
                { q: 'How soon do results show?', a: 'The first 1–2 weeks after kickoff are the ramp-up phase, with visible results from week 3. In past cases, some brands lifted visibility from 10% to over 75% within a month and a half.' },
                { q: 'Which industries suit GEO?', a: 'Industries already validated include automotive, financial services, maternal and baby, 3C and home appliances, FMCG, education and training, enterprise services, travel and culture, and health supplements. Any industry where consumers use AI search to make purchase decisions is a good fit.' },
                { q: 'What does the client need to do?', a: 'Minimal — one set of core brand materials, 15 minutes a week to accept results, and 30 minutes a month to join the review.' },
                { q: 'What if results fall short?', a: 'The client chooses either: ① settlement in proportion to the days met — for example, if 15 days were committed and 10 met, settlement is 10/15 of the amount for the keyword set; or ② an extension of the delivery deadline, with the provider continuing to serve until the missing days are made up.' },
                { q: 'Which AI platforms are covered?', a: 'All mainstream AI platforms today, including DeepSeek, Doubao, Kimi, Tencent Yuanbao, Baidu ERNIE Bot, ChatGPT, Claude and 10+ large models in total.' },
                { q: 'What are the core deliverables?', a: 'An AI market status analysis report, a tailored GEO service plan, a brand-specific knowledge base, content distribution and indexing monitoring reports, and periodic GEO performance reports (with changes in adoption rate, mention rate, TOP-3 ranking rate and other key metrics).' }
              ]
            }
          ]
        },

        /* ===== CTA ===== */
        {
          type: 'section', id: 'contact',
          blocks: [
            {
              type: 'cta',
              title: 'Start with an AI Perception Audit — See Where Your Brand Really Stands in AI',
              desc: 'Based on your industry and target keyword roots, we produce a baseline diagnosis: brand mention rate, Top-1/Top-3 recommendation rates, competitor comparison and source distribution. You can see the data first, then decide how to proceed.',
              buttons: [
                { label: 'Get a Tailored Plan', href: '#contact' },
                { label: 'See the Overseas GEO Plan', href: 'overseas.html', style: 'ghost' }
              ]
            }
          ]
        }
      ]
    },

    /* ============================================================
       OVERSEAS — Overseas GEO
       ============================================================ */
    overseas: {
      title: 'Overseas GEO Solution',
      nav: [
        { label: 'Opportunity', href: '#opp' },
        { label: 'Framework', href: '#diag' },
        { label: 'Capabilities', href: '#engine' },
        { label: 'Platforms', href: '#platform' },
        { label: 'Ads & Community', href: '#ads' },
        { label: 'Content', href: '#content' },
        { label: 'Delivery & Cases', href: '#delivery' }
      ],
      sections: [
        {
          type: 'hero',
          kicker: 'JD Technology · Overseas GEO Solution',
          title: ['Harness the AI Era', 'Win Global Traffic'],
          accentLines: [1],
          desc: 'From "being seen" to "being understood, verified and recommended" — getting your brand into AI answers worldwide.',
          sub: 'Covering five major platforms: ChatGPT, Claude, Gemini, Google AI Overviews and Perplexity',
          buttons: [
            { label: 'Explore Overseas Capabilities', href: '#engine' },
            { label: 'Get the Overseas Plan', href: '#contact', style: 'ghost' }
          ],
          meta: [
            { value: '5', label: 'Key overseas AI platforms covered' },
            { value: '5-Layer', label: 'Standard diagnostic framework' },
            { value: '12-Week', label: 'Standard execution path' },
            { value: '5', label: 'Core evaluation metrics' }
          ]
        },

        {
          type: 'section', id: 'opp', tone: 'surface',
          blocks: [
            {
              type: 'secHead',
              kicker: 'The Overseas AI Search Opportunity',
              title: 'AI Is Taking Over the First Half of Overseas Purchase Decisions',
              desc: 'Users no longer click through pages to compare — in a single conversation, AI summarises the need, ranks the brands and gives the reasons.'
            },
            {
              type: 'flow',
              items: [
                { no: '01', title: 'Ask the Question', desc: 'What is the best…?' },
                { no: '02', title: 'Understand & Shortlist', desc: 'AI summarises the need and candidate brands' },
                { no: '03', title: 'Compare & Recommend', desc: 'A recommendation rationale and priority order emerges' },
                { no: '04', title: 'Verify & Act', desc: 'Check citations, the official site, the store or enquire' }
              ]
            },
            {
              type: 'notice',
              icon: '※',
              title: 'More Than "Rankings"',
              desc: 'What matters is how AI defines your brand on the questions that matter.'
            },
            {
              type: 'secHead',
              kicker: 'GEO Definition and Core Value',
              title: 'Five Core Values of Overseas GEO: Owning the AI Decision Chain'
            },
            {
              type: 'cards', cols: 5,
              items: [
                { no: '01', title: 'Brand Visibility', desc: 'Enter the candidate set for more categories, scenarios and recommendation questions.' },
                { no: '02', title: 'Accurate Perception', desc: 'Let AI consistently understand your positioning, product capability and applicable scenarios.' },
                { no: '03', title: 'Recommendation Priority', desc: 'Build differentiated recommendation reasons that are explainable and verifiable.' },
                { no: '04', title: 'Credible Sources', desc: 'Use the official site, media, communities and reviews to cross-verify from multiple sources.' },
                { no: '05', title: 'Traffic Conversion', desc: 'Turn interest in AI answers into visits to your site, store, trial or enquiry.' }
              ]
            }
          ]
        },

        {
          type: 'section', id: 'diag',
          blocks: [
            {
              type: 'secHead',
              kicker: 'Standard Diagnostic System',
              title: 'The Five-Layer Overseas GEO Diagnostic Framework',
              desc: 'The diagnosis must answer directly: why does AI recommend a competitor? Is the brand missing entity information, scenario evidence, differentiated expression, or third-party trust?'
            },
            {
              type: 'cards', cols: 5,
              items: [
                { no: '01', title: 'Exposure Layer', desc: 'Does the brand enter the AI candidate set? Measure how often it appears in AI answers for the target categories, scenarios and languages.' },
                { no: '02', title: 'Perception Layer', desc: 'How does AI define the brand and product? Assess the accuracy of its descriptions of positioning, capability and applicable scenarios.' },
                { no: '03', title: 'Rationale Layer', desc: 'What are the reasons for recommending or not? Decompose the AI recommendation logic and find where the differentiated rationale is missing.' },
                { no: '04', title: 'Source Layer', desc: 'Which sites, media and communities do the answers depend on? Map the source landscape and separate controllable sources from those you cannot control.' },
                { no: '05', title: 'Action Layer', desc: 'Can users move smoothly to a purchase or enquiry entry point? Check whether AI answers link to the site, store, trial and other conversion paths.' }
              ]
            },
            {
              type: 'secHead',
              kicker: 'Five Anchors of Brand Perception',
              title: 'The Diagnosis Must Land on What Exactly Is Missing'
            },
            {
              type: 'flow',
              items: [
                { no: '1', title: 'Entity Anchor', desc: 'Brand, product, model' },
                { no: '2', title: 'Scenario Anchor', desc: 'Who needs it, in what situation' },
                { no: '3', title: 'Capability Anchor', desc: 'Key features and verifiable advantages' },
                { no: '4', title: 'Comparison Anchor', desc: 'Why it suits better than competitors' },
                { no: '5', title: 'Trust Anchor', desc: 'Reviews, media and community word of mouth' }
              ]
            },
            {
              type: 'secHead',
              kicker: 'Prompt & Intent Map',
              title: 'Prompt Intent Matrix and Cross-Platform Baseline Diagnosis',
              desc: 'Three intent types covering the real purchase path. Each core intent is expanded into many natural phrasings and cross-tested across five platforms, target countries and languages.'
            },
            {
              type: 'cards', cols: 3,
              items: [
                {
                  title: 'Brand Perception — Purchase Evaluation',
                  desc: 'Reputation and fact gaps',
                  list: ['"Is Brand X good?"', '"Brand X reviews"', '"Is Brand X worth it?"']
                },
                {
                  title: 'Competitive Comparison',
                  desc: 'Differentiated rationale and ranking position',
                  list: ['"Brand X vs Brand Y"', '"Which is better for…?"', '"Best alternative to…?"']
                },
                {
                  title: 'Seeking Recommendations',
                  desc: 'Category mindshare and candidate coverage',
                  list: ['"Best product for…"', '"Top tools for…"', '"What should I buy for…?"']
                }
              ]
            },
            {
              type: 'secHead',
              kicker: 'Cross-Platform Baseline Illustration',
              title: 'A diagnosis looks beyond "present or not" at position, rationale, sources and conversion'
            },
            {
              type: 'bars', max: 100,
              note: 'Figures shown are illustrative; formal diagnosis is based on measured keyword baselines.',
              items: [
                { label: 'ChatGPT', value: '72%' },
                { label: 'Claude', value: '58%' },
                { label: 'Gemini', value: '60%' },
                { label: 'AI Overviews', value: '48%' },
                { label: 'Perplexity', value: '66%' }
              ]
            },
            {
              type: 'checks',
              title: 'The Diagnosis Must Answer Five Questions',
              items: [
                'Did it enter the candidate set',
                'Is the recommendation position stable',
                'Does the recommendation rationale match the positioning',
                'Are the cited sources credible',
                'Do the answers link to conversion entry points'
              ]
            }
          ]
        },

        {
          type: 'section', id: 'engine', tone: 'surface',
          blocks: [
            {
              type: 'secHead',
              kicker: 'Core Capability Engine',
              title: 'Three Optimisation Tracks Form a Closed Loop',
              desc: 'Monitor → Review → Iterate: keeping brand perception and platform answers continuously converged.'
            },
            {
              type: 'cards', cols: 3,
              items: [
                { no: '01', title: 'Content Assets', desc: 'Build the brand knowledge base and produce answer-type, comparison-type, review-type and scenario-type content.' },
                { no: '02', title: 'Technical Foundation', desc: 'Improve how the official site can be crawled, understood and cited, and upgrade structured data.' },
                { no: '03', title: 'Global Sources', desc: 'Establish multi-source cross-verification through Digital PR, reviews, communities and commerce platforms.' }
              ]
            },
            {
              type: 'secHead',
              kicker: 'K-I-R-O',
              title: 'A Four-Stage Model from Knowledge to Output'
            },
            {
              type: 'flow',
              items: [
                { no: 'K', title: 'Knowledge', desc: 'Brand facts and differentiated knowledge anchors' },
                { no: 'I', title: 'Intent', desc: 'Intent matrix and prompt coverage' },
                { no: 'R', title: 'Reasoning', desc: 'Recommendation rationale and comparison framing' },
                { no: 'O', title: 'Output', desc: 'Platform answers and citation placement' }
              ]
            }
          ]
        },

        {
          type: 'section', id: 'platform', tone: 'dark',
          blocks: [
            {
              type: 'secHead',
              kicker: 'Platform Playbook',
              title: 'Differentiated Strategy for Five Platforms',
              desc: 'The same user question can produce different answers, different cited sources and different recommendation orders across five platforms. That demands a cross-platform baseline and unified brand knowledge anchors.'
            },
            {
              type: 'platforms',
              items: [
                {
                  no: 'C', name: 'ChatGPT', role: 'Conversational decision entry point',
                  handles: ['GPTBot / ChatGPT-User access', 'Bing / web sources', 'Answer-type content'],
                  results: ['Recommendation rationale, brand facts, comparison and scenario coverage'],
handles: ['GPTBot / ChatGPT-User access', 'Bing / web sources', 'Answer-type content'],
                  results: ['Recommendation rationale, brand facts, comparison and scenario coverage'],handlesLabel: 'Key levers',
handles: ['GPTBot / ChatGPT-User access', 'Bing / web sources', 'Answer-type content'],
                  results: ['Recommendation rationale, brand facts, comparison and scenario coverage'],resultsLabel: 'Core results',
handles: ['GPTBot / ChatGPT-User access', 'Bing / web sources', 'Answer-type content'],
                  results: ['Recommendation rationale, brand facts, comparison and scenario coverage'],goalLabel: 'Optimisation goal',
                  goal: 'Visible · Accurate · Prioritised · Citable'
                },
                {
                  no: 'C', name: 'Claude', role: 'Anthropic deep-reasoning assistant',
                  handles: ['ClaudeBot access', 'High-quality source citation', 'Long-context understanding and analytical answers'],
                  results: ['Deep analytical citations, professional scenario recommendations and technical documentation coverage'],
handles: ['ClaudeBot access', 'High-quality source citation', 'Long-context understanding and analytical answers'],
                  results: ['Deep analytical citations, professional scenario recommendations and technical documentation coverage'],handlesLabel: 'Key levers',
handles: ['ClaudeBot access', 'High-quality source citation', 'Long-context understanding and analytical answers'],
                  results: ['Deep analytical citations, professional scenario recommendations and technical documentation coverage'],resultsLabel: 'Core results',
handles: ['ClaudeBot access', 'High-quality source citation', 'Long-context understanding and analytical answers'],
                  results: ['Deep analytical citations, professional scenario recommendations and technical documentation coverage'],goalLabel: 'Optimisation goal',
                  goal: 'Visible · Accurate · Prioritised · Citable'
                },
                {
                  no: 'G', name: 'Gemini', role: 'AI assistant across the Google ecosystem',
                  handles: ['Google indexing', 'Entity relations', 'Authoritative web pages and multimodal content'],
                  results: ['Cross-web consistency, knowledge understanding and multi-turn answers'],
handles: ['Google indexing', 'Entity relations', 'Authoritative web pages and multimodal content'],
                  results: ['Cross-web consistency, knowledge understanding and multi-turn answers'],handlesLabel: 'Key levers',
handles: ['Google indexing', 'Entity relations', 'Authoritative web pages and multimodal content'],
                  results: ['Cross-web consistency, knowledge understanding and multi-turn answers'],resultsLabel: 'Core results',
handles: ['Google indexing', 'Entity relations', 'Authoritative web pages and multimodal content'],
                  results: ['Cross-web consistency, knowledge understanding and multi-turn answers'],goalLabel: 'Optimisation goal',
                  goal: 'Visible · Accurate · Prioritised · Citable'
                },
                {
                  no: 'G', name: 'Google AI Overviews', role: 'The answer layer of the search results page',
                  handles: ['Search intent coverage', 'Summarisability of pages', 'Schema and citation value'],
                  results: ['Summary inclusion, citation position and downstream clicks'],
handles: ['Search intent coverage', 'Summarisability of pages', 'Schema and citation value'],
                  results: ['Summary inclusion, citation position and downstream clicks'],handlesLabel: 'Key levers',
handles: ['Search intent coverage', 'Summarisability of pages', 'Schema and citation value'],
                  results: ['Summary inclusion, citation position and downstream clicks'],resultsLabel: 'Core results',
handles: ['Search intent coverage', 'Summarisability of pages', 'Schema and citation value'],
                  results: ['Summary inclusion, citation position and downstream clicks'],goalLabel: 'Optimisation goal',
                  goal: 'Visible · Accurate · Prioritised · Citable'
                },
                {
                  no: 'P', name: 'Perplexity AI', role: 'Citation-driven answer search',
                  handles: ['High-quality primary sources', 'Transparent citations', 'Latest facts and research content'],
                  results: ['Citation rate, source diversity and research-question coverage'],
handles: ['High-quality primary sources', 'Transparent citations', 'Latest facts and research content'],
                  results: ['Citation rate, source diversity and research-question coverage'],handlesLabel: 'Key levers',
handles: ['High-quality primary sources', 'Transparent citations', 'Latest facts and research content'],
                  results: ['Citation rate, source diversity and research-question coverage'],resultsLabel: 'Core results',
handles: ['High-quality primary sources', 'Transparent citations', 'Latest facts and research content'],
                  results: ['Citation rate, source diversity and research-question coverage'],goalLabel: 'Optimisation goal',
                  goal: 'Visible · Accurate · Prioritised · Citable'
                }
              ]
            }
          ]
        },

        {
          type: 'section', id: 'ads',
          blocks: [
            {
              type: 'secHead',
              kicker: 'ChatGPT Ads',
              title: 'Conversation Is the Entry Point · Advertising Is the Decision',
              desc: 'GEO + GAO working in tandem, turning high-intent traffic inside AI conversations directly into attributable conversion.'
            },
            {
              type: 'stats', cols: 4,
              items: [
                { value: '900M', label: 'Weekly active users' },
                { value: '2.5B+', label: 'Average daily conversations' },
                { value: '10×', label: 'CTR vs chatbot benchmark' },
                { value: '+54%', label: 'ARI conversion lift (Adobe)' }
              ]
            },
            {
              type: 'secHead',
              kicker: 'Placement Benchmarks',
              title: 'Early-Stage Placement Benchmarks'
            },
            {
              type: 'table',
              head: ['Metric', 'Range', 'Notes'],
              rows: [
                ['CTR', '1.5% – 4%', 'Mid-funnel native content ads'],
                ['CPC', '$0.3 – $4', 'AI tooling $1.8–2.0; travel B2B $3–3.5'],
                ['Coverage', 'US / CA / AU / NZ / UK', 'Japan and Korea recently opened; Brazil and Mexico rolling out']
              ]
            },
            {
              type: 'split', wide: true,
              left: {
                type: 'checks',
                title: 'Context Hints · Task-Scenario Targeting',
                desc: 'Keywords answer "what users search for"; Hints answer "what users are trying to solve".',
                items: [
                  'Who the user is: role · scenario · identity',
                  'The task: the problem being solved',
                  'Constraints: time · platform · format',
                  'Desired outcome: the next step the user has in mind'
                ]
              },
              right: {
                type: 'checks',
                title: 'JD Technology Fully-Managed Placement Service',
                desc: 'From strategy to creative to attribution — one team owns it end to end.',
                items: [
                  'Strategy: scenario selection · Hint design · audience and budget planning',
                  'Account management: continuous placement optimisation · creative A/B testing · review experience',
                  'Attribution: Pixel + CAPI + GA4 · three-layer evaluation basis',
                  'Creative optimisation: UGC-style assets · scenario-led copy · native feel'
                ]
              }
            },
            {
              type: 'secHead',
              kicker: 'Three-Layer Performance Evaluation',
              title: 'From Click to Business Outcome, Attributed Layer by Layer'
            },
            {
              type: 'flow',
              items: [
                { no: 'L1', title: 'Ad Efficiency', desc: 'CTR · CPC · CPM · Click' },
                { no: 'L2', title: 'On-site Behaviour', desc: 'Signup · Trial · Core feature · Pricing page' },
                { no: 'L3', title: 'Business Outcome', desc: 'Payment · Retention · LTV · Incremental ROAS' }
              ]
            },
            {
              type: 'secHead',
              kicker: 'Reddit Community Marketing',
              title: 'The Largest Interest Community on Earth · The Preferred Source for AI Citations',
              desc: 'Reddit content appears in 68% of AI-generated answers. Gemini cites it first, ChatGPT second, and Claude and Perplexity cite it frequently — making it an important source for AI engines.'
            },
            {
              type: 'stats', cols: 2,
              items: [
                { value: '491M', label: 'Weekly active users (WAU)' },
                { value: '871K', label: 'Active communities' }
              ]
            },
            {
              type: 'table',
              head: ['Profile dimension', 'Data'],
              rows: [
                ['Geography', '48.9% from the United States'],
                ['Age', '36.9% Gen Z (18–29)'],
                ['Education', '54.5% undergraduate and above'],
                ['Gender', '62.4% male · the tech core'],
                ['Trust and intent', 'Highest ad trust, high-intent active search'],
                ['Best-fit industries', 'Gaming (9.5) · B2B SaaS (9.5) · Consumer electronics (9.2) · Electric mobility · Outdoor gear']
              ]
            },
            {
              type: 'secHead',
              kicker: 'KK-Reddit Echo Model',
              title: 'Five Stages of Community Co-Creation'
            },
            {
              type: 'flow',
              items: [
                { no: '01', title: 'Ask', desc: 'A KOC raises the pain point' },
                { no: '02', title: 'Answer', desc: 'A KOL mentions the brand naturally' },
                { no: '03', title: 'Engage', desc: 'Likes, follow-up questions, added comments' },
                { no: '04', title: 'Amplify', desc: 'Recommended plus ads pushed to the front page' },
                { no: '05', title: 'Long Tail', desc: 'Continued citation via SEO + AI' }
              ]
            },
            {
              type: 'notice',
              icon: '※',
              title: 'The Amplification Formula',
              desc: '1 question + 10 answers + 100 interactions → discussion amplification → algorithmic spread → Google indexing → continuous AI citation.'
            },
            {
              type: 'secHead',
              kicker: 'Three Core Services',
              title: 'JD Technology Reddit Service Menu'
            },
            {
              type: 'cards', cols: 3,
              items: [
                {
                  title: 'S1 Official Subreddit Operations',
                  list: ['Community setup and design', '16–30 posts per month', '7×12h sentiment monitoring', 'Building a brand-owned user base']
                },
                {
                  title: 'S2 Content Marketing (Echo Model)',
                  list: ['Market research and script design', 'High-Karma account matrix', 'Q&A posts plus engagement upkeep', 'Google indexing rate > 60%']
                },
                {
                  title: 'S3 GEO / SEO Linkage',
                  list: ['Reddit Answers placement', 'AI engine citation optimisation', 'High-authority Google SEO', 'A moat for AI visibility']
                }
              ]
            },
            {
              type: 'notice',
              icon: '※',
              title: 'Reddit Advertising · Independent Incremental Purchase',
              desc: 'Reddit Max AI automation · DPA dynamic product ads · conversational ad slots · full-day takeover. -17% CPA, 5–7× ROAS in consumer tech.'
            }
          ]
        },

        {
          type: 'section', id: 'content', tone: 'surface',
          blocks: [
            {
              type: 'secHead',
              kicker: 'Global Content & Source',
              title: 'The Global Content System and Source Building',
              desc: 'The global content system organises knowledge assets by "market × language × intent".'
            },
            {
              type: 'cards', cols: 4,
              items: [
                { title: 'Brand Truth · Fact Layer', desc: 'Positioning, products, features, specifications, target audiences, policies and updates.' },
                { title: 'Decision Content · Decision Layer', desc: 'Buying guides, comparisons, alternatives, scenario solutions and FAQs.' },
                { title: 'Proof Content · Evidence Layer', desc: 'Original data, case studies, whitepapers, expert commentary and test methodologies.' },
                { title: 'Localization · Expression Layer', desc: 'Local wording, cultural context, regulation, channels and real user questions.' }
              ]
            },
            {
              type: 'notice',
              icon: '※',
              title: 'Not Word-for-Word Translation',
              desc: 'Instead, it ensures that the real questions of every market have answer assets that AI can understand and cite.'
            },
            {
              type: 'secHead',
              kicker: 'Global Source Building',
              title: 'Building Recommendation Trust Through Multi-Source Cross-Verification'
            },
            {
              type: 'flow',
              items: [
                { no: 'O', title: 'Owned · Official site and documentation', desc: 'Fact source' },
                { no: 'E', title: 'Earned · Authoritative media / Digital PR', desc: 'Credibility' },
                { no: 'R', title: 'Review · Professional evaluations / rankings', desc: 'Comparative evidence' },
                { no: 'C', title: 'Community · Reddit / Quora / forums', desc: 'Genuine discussion' },
                { no: 'M', title: 'Commerce · Amazon / app stores', desc: 'Commercial feedback' }
              ]
            },
            {
              type: 'secHead',
              kicker: 'Technical Optimization',
              title: 'Technical Optimisation: Turning Your Brand Site Into an Authoritative Source AI Can Use'
            },
            {
              type: 'cards', cols: 5,
              items: [
                { title: 'Crawling & Indexing', desc: 'Audit robots directives and access by major AI and search crawlers; resolve JavaScript rendering, orphan pages and duplicate content.' },
                { title: 'Structured Data', desc: 'Plan Organization, Product, Article and FAQ Schema to make entity and attribute relationships explicit.' },
                { title: 'Answer-Ready Pages', desc: 'Conclusions first, clear heading hierarchy, extractable facts and specifications, transparent citations and update times.' },
                { title: 'Site Knowledge Layer', desc: 'Build brand fact pages, product comparison pages, glossary pages, help centres and reusable FAQ systems.' },
                { title: 'Continuous Maintenance', desc: 'Content updates, index submission, broken link repair and tracing of answer anomalies.' }
              ]
            },
            {
              type: 'notice',
              icon: '※',
              title: 'On llms.txt',
              desc: 'llms.txt works as a supplementary discovery file, but it does not replace robots directives, indexing, structured data and high-quality pages themselves.',
              tone: 'neutral'
            },
            {
              type: 'secHead',
              kicker: 'Monitoring System',
              title: 'Turning Answer Changes Into Actionable Data'
            },
            {
              type: 'cards', cols: 5,
              items: [
                { title: 'Mention', desc: 'Mentioned' },
                { title: 'Preference', desc: 'Prioritised' },
                { title: 'Accuracy', desc: 'Accurate' },
                { title: 'Citation', desc: 'Cited' },
                { title: 'Sentiment', desc: 'Sentiment' }
              ]
            }
          ]
        },

        {
          type: 'section', id: 'delivery',
          blocks: [
            {
              type: 'secHead',
              kicker: 'Deliverables',
              title: 'Standard Deliverables and Collaboration Model'
            },
            {
              type: 'cards', cols: 3,
              items: [
                { no: '01', title: 'Diagnostic Report', desc: 'Cross-platform visibility, competitor, prompt, source and technical diagnosis.' },
                { no: '02', title: 'Strategy Plan', desc: 'Target market / language / intent priorities and a phased roadmap.' },
                { no: '03', title: 'Brand Knowledge Base', desc: 'Brand facts, product information, differentiators and scenario knowledge anchors.' },
                { no: '04', title: 'Content & Technical Checklist', desc: 'On-site content, page upgrades, Schema and crawl optimisation recommendations.' },
                { no: '05', title: 'Source Building Log', desc: 'Digital PR, media, review, community and commerce-platform content.' },
                { no: '06', title: 'Monitoring & Review', desc: 'Weekly anomalies, monthly reports, phase summaries and next-step recommendations.' }
              ]
            },
            {
              type: 'split',
              left: {
                type: 'checks',
                title: 'JD Technology Delivers',
                items: [
                  'Strategy development and execution',
                  'Content creation and source building',
                  'Technical optimisation, monitoring and review',
                  'Performance data delivery'
                ]
              },
              right: {
                type: 'checks',
                title: 'The Brand Contributes',
                items: [
                  'Fact confirmation',
                  'Content review',
                  'Site publishing',
                  'Compliance approval'
                ]
              }
            },
            {
              type: 'secHead',
              kicker: '12-Week Roadmap',
              title: 'The 12-Week Overseas GEO Execution Path'
            },
            {
              type: 'roadmap',
              items: [
                { no: 'W1–2', title: 'Diagnosis & Baseline', desc: 'Keyword runs, competitors, sources, site technology and content asset inventory.' },
                { no: 'W3–4', title: 'Strategy & Knowledge Base', desc: 'Brand knowledge anchors, intent matrix, content blueprint and technical checklist.' },
                { no: 'W5–8', title: 'Content & Source Building', desc: 'On-site content, page upgrades, Digital PR, reviews and community coordination.' },
                { no: 'W9–12', title: 'Monitoring & Iteration', desc: 'Cross-platform retesting, answer anomaly correction, monthly reports and next-phase planning.' }
              ]
            },
            {
              type: 'notice',
              icon: '※',
              title: 'Flexible Scoping',
              desc: 'Can be split by country, language, product line and intent volume into pilot packages or ongoing-operation packages.'
            },
            {
              type: 'secHead',
              kicker: 'Core Evaluation Metrics',
              title: 'Establish Baselines by "Platform × Country × Language × Intent × Prompt"'
            },
            {
              type: 'cards', cols: 5,
              items: [
                { no: '1', title: 'Visibility · Mention Rate', desc: 'How often the brand enters answers.' },
                { no: '2', title: 'Preference · Priority Rate', desc: 'How often it reaches Top-1 / Top-3 or the shortlist set.' },
                { no: '3', title: 'Accuracy · Accuracy Rate', desc: 'Whether brand facts and product information are correct.' },
                { no: '4', title: 'Citation · Citation Rate', desc: 'How often the brand or authoritative sources are cited in answers.' },
                { no: '5', title: 'Conversion · Action Rate', desc: 'How often users move from an AI answer to the site or a conversion entry point.' }
              ]
            },
            {
              type: 'notice',
              icon: '※',
              title: 'Retesting Principle',
              desc: 'Retest continuously with the same basis, the same sample and the same cycle.',
              tone: 'neutral'
            },
            {
              type: 'secHead',
              kicker: 'Case Studies',
              title: 'Overseas GEO Case Studies',
              desc: 'Case data is based on re-running the keyword baseline on real projects, showing how brand mention rates moved from before to after optimisation.'
            },
            {
              type: 'cases',
              items: [
                {
                  tag: 'AI PC', title: 'A Leading Technology Brand', desc: 'Holds the #1 recommendation slot on core questions.',
                  metrics: [
                    { label: 'Platform', value: 'ChatGPT' },
                    { label: 'Before', value: '45%' },
                    { label: 'After', value: '86%' }
                  ]
                },
                {
                  tag: 'AI Agent', title: 'An AI Development Platform', desc: 'Stably top-3 for "best AI agent builder".',
                  metrics: [
                    { label: 'Platform', value: 'ChatGPT · Claude' },
                    { label: 'Before', value: '47%' },
                    { label: 'After', value: '85%' }
                  ]
                },
                {
                  tag: 'Cross-border Payments', title: 'A Payments Platform', desc: 'Stably top-2 on core payment scenario keywords.',
                  metrics: [
                    { label: 'Platform', value: 'ChatGPT · Claude · Gemini · Perplexity' },
                    { label: 'Before', value: '52%' },
                    { label: 'After', value: '86%' }
                  ]
                },
                {
                  tag: 'Smart Hardware', title: 'A Consumer Electronics Brand', desc: 'Stably top-4 on 75-inch recommendation lists.',
                  metrics: [
                    { label: 'Platform', value: 'ChatGPT · Gemini' },
                    { label: 'Before', value: '41%' },
                    { label: 'After', value: '76%' }
                  ]
                }
              ]
            }
          ]
        },

        {
          type: 'section', id: 'contact',
          blocks: [
            {
              type: 'cta',
              title: 'Use a Cross-Platform Baseline Diagnosis to See Where Your Brand Really Stands in Overseas AI',
              desc: 'We cross-run keywords across five platforms, target countries and languages, and deliver a diagnostic report covering visibility, position, gaps in recommendation rationale and a source map.',
              buttons: [
                { label: 'Get the Overseas Plan', href: '#contact' },
                { label: 'See the Domestic GEO Plan', href: 'index.html', style: 'ghost' }
              ]
            }
          ]
        }
      ]
    },

    /* ============================================================
       INSIGHT — AI User Intent Insight Report (sample)
       ============================================================ */
    insight: {
      title: 'AI User Intent Insights',
      nav: [
        { label: 'Overview', href: '#intro' },
        { label: 'Seed Words', href: '#seed' },
        { label: 'Tiers', href: '#level' },
        { label: 'Intents', href: '#intent' },
        { label: 'Insights', href: '#conclusion' }
      ],
      sections: [
        {
          type: 'hero',
          kicker: 'JD Technology GEO · Insight Capability Demo',
          title: ['AI User Intent Insight Report', 'JD Air Conditioners · 202609'],
          accentLines: [1],
          desc: 'Based on user questions and answers in AI search scenarios, it aggregates and identifies the core intents and typical questions related to brand, product, competitor and industry.',
          sub: 'Data range: 2026-08-17 ~ 2026-09-15 | Platform: Doubao',
          buttons: [
            { label: 'See the Method', href: '#intro' },
            { label: 'Get a Similar Report', href: '#contact', style: 'ghost' }
          ],
          meta: [
            { value: '5.1%', label: 'Grade S share (brand + strong relevance)' },
            { value: '17.7%', label: 'Grade A share' },
            { value: '77.2%', label: 'Grade B share' },
            { value: '41.5%', label: 'Share of the most frequent seed word' }
          ]
        },

        {
          type: 'section', id: 'intro', tone: 'surface',
          blocks: [
            {
              type: 'secHead',
              kicker: 'About This Report',
              title: 'What This Report Solves',
              desc: 'This report is the carrier for brand digital-demand insight analysis. Taking brand seed words, product words, competitor words and industry terms as inputs, it matches related user questions and completes classification and aggregation, helping brands capture what users care about most and uncover content, marketing and product opportunities.'
            },
            {
              type: 'cards', cols: 3,
              items: [
                { title: 'Scope of Analysis', desc: 'The set of user questions triggered by seed words related to brand digital-demand insight analysis between 2026-08-17 and 2026-09-15.' },
                { title: 'Objective', desc: 'Identify the core concerns of users in brand digital-demand insight scenarios, determine where high-frequency demand concentrates, and provide the basis for subsequent content supply, strategy optimisation and product capability building.' },
                { title: 'Outputs', desc: 'A tiered question bank, intent distribution, typical question lists and actionable insights — mapping directly onto GEO optimisation keyword roots.' }
              ]
            }
          ]
        },

        {
          type: 'section', id: 'seed',
          blocks: [
            {
              type: 'secHead',
              kicker: 'Seed Words Analysed',
              title: 'Four Seed-Word Categories Form the Analysis Entry Point'
            },
            {
              type: 'tabs',
              items: [
                {
                  label: 'Brand Words',
                  panels: [{
                    type: 'plats',
                    items: [
                      { text: '京东空调 (JD air conditioners)', hot: true }, { text: '京东家电空调 (JD home appliance ACs)' }, { text: '京东自营空调 (JD self-operated ACs)' },
                      { text: '京东空调专区 (JD AC section)' }, { text: '买空调上京东 (buy ACs on JD)' }, { text: 'jd空调 (jd air conditioner)' }
                    ]
                  }]
                },
                {
                  label: 'Product Words',
                  panels: [{
                    type: 'plats',
                    items: [
                      { text: '京东空调以旧换新 (JD AC trade-in)', hot: true }, { text: '京东空调安装服务 (JD AC installation)' }, { text: '京东空调百亿补贴 (JD AC ¥10bn subsidy)' },
                      { text: '京东空调自营款 (JD AC self-operated models)' }, { text: '京东空调套购 (JD AC bundle deals)' }, { text: '京东空调延保服务 (JD AC extended warranty)' }
                    ]
                  }]
                },
                {
                  label: 'Competitor Words',
                  panels: [{
                    type: 'plats',
                    items: [
                      { text: '天猫空调 (Tmall ACs)' }, { text: '苏宁空调 (Suning ACs)' }, { text: '国美空调 (Gome ACs)' },
                      { text: '拼多多空调 (Pinduoduo ACs)' }, { text: '线下家电城空调 (offline appliance-mall ACs)' }, { text: '品牌官网空调 (brand official-site ACs)' }
                    ]
                  }]
                },
                {
                  label: 'Industry Core Words',
                  panels: [{
                    type: 'plats',
                    items: [
                      { text: '空调推荐 (AC recommendations)' }, { text: '空调性价比排行 (AC value-for-money ranking)' }, { text: '变频空调 (inverter ACs)' },
                      { text: '家用空调 (home-use ACs)' }, { text: '空调安装服务 (AC installation service)' }, { text: '空调以旧换新 (AC trade-in)' },
                      { text: '小户型空调 (small-flat ACs)' }, { text: '节能空调 (energy-saving ACs)' }, { text: '空调价格 (AC prices)' },
                      { text: '1.5匹空调 (1.5-HP ACs)' }, { text: '中央空调 (central air conditioning)' }, { text: '空调性价比 (AC value for money)' }
                    ]
                  }]
                }
              ]
            },
            {
              type: 'secHead',
              kicker: 'Seed-Word Clustering',
              title: 'Distribution of User Questions Across the Top 15 Seed Words'
            },
            {
              type: 'bars', max: 45,
              note: 'Data range: 2026-08-17 ~ 2026-09-15',
              items: [
                { label: 'Pinduoduo ACs', value: '41.5%', note: 'General platform enquiries · 拼多多空调' },
                { label: 'AC installation', value: '21.1%', note: 'Installation bookings · 空调安装服务' },
                { label: 'JD air conditioners', value: '8.6%', note: 'Purchase and service enquiries · 京东空调' },
                { label: 'AC trade-in', value: '4.1%', note: 'Trade-in rules and subsidies · 空调以旧换新' },
                { label: 'AC prices', value: '3.7%', note: 'AC price lookups · 空调价格' },
                { label: '1.5-HP ACs', value: '3.3%', note: 'Selection and usage specs · 1.5匹空调' },
                { label: 'AC value for money', value: '3.1%', note: 'Value-for-money AC buying · 空调性价比' },
                { label: 'AC recommendations', value: '2.9%', note: 'Needs-based AC recommendations · 空调推荐' },
                { label: 'Tmall ACs', value: '2.7%', note: 'Platform product lookups · 天猫空调' },
                { label: 'Suning ACs', value: '2.1%', note: 'Offline store lookups · 苏宁空调' },
                { label: 'Energy-saving ACs', value: '1.6%', note: 'Energy consumption enquiries · 节能空调' },
                { label: 'JD self-operated ACs', value: '1.2%', note: 'Purchase enquiries · 京东自营空调' },
                { label: 'Home-use ACs', value: '1.0%', note: 'Home-use AC lookups · 家用空调' },
                { label: 'JD home appliance ACs', value: '0.4%', note: 'Delivery service enquiries · 京东家电空调' },
                { label: 'JD AC trade-in', value: '0.4%', note: 'Trade-in rules and offers · 京东空调以旧换新' }
              ]
            }
          ]
        },

        {
          type: 'section', id: 'level', tone: 'surface',
          blocks: [
            {
              type: 'secHead',
              kicker: 'Question Filtering Dimensions',
              title: 'S / A / B Question Tiering',
              desc: 'Tiering turns a vast pool of raw questions into intent assets that can directly guide optimisation.'
            },
            {
              type: 'cards', cols: 3,
              items: [
                {
                  title: 'Grade S · 5.1%',
                  desc: 'Both the user question and the model reply contain any one of the brand seed words, and the question intent is highly relevant to the seed word.',
                  list: ['"Which brand has the best value-for-money central air conditioning?"', '"Help me book an AC installation service"', '"Does the JD AC national subsidy cover Dangshan County, Suzhou, Anhui?"', '"Recommendations for new air conditioner models in 2026"']
                },
                {
                  title: 'Grade A · 17.7%',
                  desc: 'The user question contains any one of the brand seed words, and the question intent is highly relevant to the seed word.',
                  list: ['"How much is the cheapest JD air conditioner?"', '"Recommendations for 1.5-HP air conditioners"', '"Which air conditioner under ¥3,000 offers better value?"', '"Recommendations for high-value floor-standing air conditioners"']
                },
                {
                  title: 'Grade B · 77.2%',
                  desc: 'The user question contains a brand seed word, or the model reply contains a brand seed word, or the question intent is related to the seed word.',
                  list: ['"Help me open Gree AC 709"', '"I want to book an AC repair service"', '"Can you trust the machines under Pinduoduo\'s ¥10bn subsidy?"', '"Is it better to buy on Taobao or JD — will I get a fake?"']
                }
              ]
            }
          ]
        },

        {
          type: 'section', id: 'intent',
          blocks: [
            {
              type: 'secHead',
              kicker: 'Overall Intent Distribution',
              title: 'User Question Intent Categories and Their Shares'
            },
            {
              type: 'bars', max: 55,
              items: [
                { label: 'E-commerce platform usage and rules', value: '50.1%', note: 'Typical keywords: Pinduoduo, Taobao, Tmall' },
                { label: 'AC-related enquiries and services', value: '43.1%', note: 'Typical keywords: air conditioner, 1.5 HP, value for money' },
                { label: 'Product pricing and purchase enquiries', value: '0.4%', note: 'Typical keywords: how much, price, value for money' },
                { label: 'Everyday services and home appliance questions', value: '0.2%', note: 'Typical keywords: JD Home Services, JD Logistics, appliance malls' }
              ]
            },
            {
              type: 'secHead',
              kicker: 'Intent Breakdown',
              title: 'Typical User Questions by Intent'
            },
            {
              type: 'table',
              head: ['Intent type', 'Share', 'Typical user questions'],
              rows: [
                ['E-commerce platform usage and rules', '50.1%', '"Is it better to buy on Taobao or JD — will I get a fake?"　"Can you trust the machines under Pinduoduo\'s ¥10bn subsidy?"　"Do most people on Pinduoduo use group-order payment?"'],
                ['AC-related enquiries and services', '43.1%', '"What room size does a 1.5-HP AC suit?"　"My AC is old — I want a professional technician to clean it at home"　"Which brand has the best value-for-money central air conditioning?"　"How many days after delivery does JD\'s AC price protection apply?"'],
                ['Product pricing and purchase enquiries', '0.4%', '"Which platform is best for second-hand appliances?"　"Is Pinduoduo cheaper because shipping is cheaper?"'],
                ['Everyday services and home appliance questions', '0.2%', '"Is there an appliance mall near here?"']
              ]
            }
          ]
        },

        {
          type: 'section', id: 'conclusion', tone: 'dark',
          blocks: [
            {
              type: 'secHead',
              kicker: 'Distribution Insights',
              title: 'The Core Decision Blocker: Trust Concerns and Value-for-Money Trade-offs in Cross-Platform Buying'
            },
            {
              type: 'cards', cols: 2,
              items: [
                {
                  title: 'Conclusion by Seed Word',
                  desc: 'In current JD air conditioner demand, platform-comparison intent is the largest — the keyword "Pinduoduo ACs" alone drives 41.48% of enquiries, followed by AC installation service demand at 21.15%. Together these are the core interest touchpoints. Long-tail demand covers the full decision journey — trade-in rules, price lookups, 1.5-HP specification enquiries and value-for-money selection — showing how strongly users care about cross-platform price comparison and service certainty.',
                  list: ['Strengthen the differentiated message around genuine-product guarantees and transparent installation services', 'Build demand-response scenarios across the full select–install–trade-in journey to shorten user decision time']
                },
                {
                  title: 'Conclusion by Overall Intent',
                  desc: 'In current JD air conditioner intent, platform usage and rules enquiries exceed 50% and are the highest-frequency need — much of it about product trustworthiness, promotional rules and purchase comparison on competitor platforms such as Pinduoduo and Taobao. AC-related enquiries follow at 43.1%, dominated by practical questions on horsepower fit, energy efficiency, trade-in and installation after-sales.',
                  list: ['Run comparison education on genuine products, service and price advantages across platforms', 'Add one-tap lookup for AC specifications, local subsidy policies and after-sales process to cut decision cost']
                }
              ]
            },
            {
              type: 'notice',
              icon: '※',
              title: 'A Note on This Report',
              desc: 'This report is AI-generated — please verify before use. Insights must be cross-checked against the brand\'s actual business and product strategy.',
              tone: 'neutral'
            }
          ]
        },

        {
          type: 'section', id: 'contact',
          blocks: [
            {
              type: 'cta',
              title: 'Run an AI User Intent Insight Report for Your Category',
              desc: 'We use the same method on your target platforms — running keywords, tiering, clustering and drawing conclusions — so that every GEO optimisation action rests on real user intent.',
              buttons: [
                { label: 'Get a Similar Report', href: '#contact' },
                { label: 'See the GEO Solution', href: 'index.html', style: 'ghost' }
              ]
            }
          ]
        }
      ]
    }
  }
};
