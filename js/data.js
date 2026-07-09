/* Content data — single source of truth for roles, capabilities, impact. */
const SITE_DATA = {
  roles: [
    { co: 'AMD', it: false, role: 'Consulting Architect', via: 'via Infobell IT Solutions', yr: '2025 — Now', detail: 'Lead architectural vision, governance, and engineering teams for agentic AI across business units — guiding cross-BU initiatives through the full delivery lifecycle. Drove the transformation that cut benchmark automation from a month to under 4 days (30×). Set explainable, globally scalable AI data standards, and served as technical lead for an LLM-powered product that answers performance questions in natural language. Hands-on across the data warehouse, NLP analytics, and a ReactJS front end on AWS.', tags: ['Technical Leadership', 'Governance', 'Agentic AI', 'LLM', 'NLP', 'Data Warehouse', 'ReactJS', 'Python', 'AWS'] },
    { co: 'FINEOS / Spraoi', it: true, role: 'Senior Software Developer', yr: '2018 — 2025', detail: 'Led cross-functional teams for 6.5 years, delivering an enterprise insurance portal end to end and directing an AI personalization initiative that lifted engagement and conversion. Drove organization-wide adoption of a reusable workflow pipeline builder and an AI/ML training accelerator — multiplying delivery speed across teams. Built on ReactJS, Node.js, GraphQL, and ElasticSearch over AWS.', tags: ['Team Leadership', 'AI/ML Pipelines', 'ReactJS', 'NodeJS', 'GraphQL', 'ElasticSearch', 'AWS'] },
    { co: 'Goin LLC', it: false, role: 'Consulting Mobile Developer', yr: '2017 — 2018', detail: 'Led development of an inclusive cab aggregator, coordinating design and QA and championing accessibility for riders with disabilities (WCAG). Owned requirements and delivery for an iOS Rider app and a React Native Driver app with real-time tracking.', tags: ['Project Leadership', 'React Native', 'iOS', 'Android', 'WCAG'] },
    { co: 'HPE', it: false, role: 'Consulting Mobile Developer', yr: '2016 — 2017', detail: 'Led rapid-prototyping initiatives for enterprise-partner mobile and web apps, supporting HPE’s mobility product strategy. Cross-platform delivery in ReactJS, Android, and PHP/MySQL expedited time-to-market by 20%.', tags: ['Initiative Lead', 'ReactJS', 'Android', 'PHP', 'MySQL'] },
    { co: 'iService', it: true, role: 'Mobile Application Developer', yr: '2015 — 2016', detail: 'Managed development of a CRM suite with integrated geo-fencing and mobile lab testing, ensuring scalability across fragmented Android ecosystems — the hands-on foundation the leadership is built on.', tags: ['Delivery Management', 'Android', 'CRM', 'Geo-fencing'] }
  ],
  leadership: [
    { t: 'Strategic Leadership', p: 'Set technology vision and roadmaps that tie engineering effort to measurable business value across business units.' },
    { t: 'Team Building & Mentoring', p: 'Grow and lead cross-functional teams through the full delivery lifecycle — coaching engineers and raising the bar.' },
    { t: 'Organizational Transformation', p: 'Drive change that sticks — reworking process, architecture, and ways of working to multiply delivery speed.' },
    { t: 'Stakeholder Management', p: 'Translate between executives, partners, and engineers — turning ambiguity into shared direction and commitment.' },
    { t: 'Governance & Risk', p: 'Establish standards, technical governance, and risk management that keep platforms explainable, auditable, and scalable.' },
    { t: 'Delivery & Execution', p: 'Own outcomes end to end — from strategy to ship — with agile delivery, clear ownership, and accountability.' }
  ],
  caps: [
    { t: 'Leadership', items: ['Strategic Leadership', 'Team Building', 'Mentoring & Coaching', 'Stakeholder Management', 'Risk Management', 'Vendor & Contract Mgmt'] },
    { t: 'Strategy & Delivery', items: ['Technology Strategy', 'Product Roadmapping', 'Agile Methodology', 'Project Management', 'Cross-functional Delivery'] },
    { t: 'Architecture', items: ['Enterprise Architecture', 'AI Platform Design', 'Agentic AI Systems', 'Data Architecture', 'Technical Governance'] },
    { t: 'AI & Data', items: ['Generative AI', 'LLM Products', 'NLP Analytics', 'ML Pipelines', 'Data Standards'] },
    { t: 'Engineering', items: ['ReactJS', 'Next.js', 'Node.js', 'React Native', 'iOS / Android', 'GraphQL'] },
    { t: 'Cloud — AWS', items: ['Lambda', 'CloudFormation', 'DynamoDB', 'S3 / CloudFront', 'API Gateway', 'Cognito'] },
    { t: 'DevOps & CI/CD', items: ['Terraform', 'CircleCI', 'Jenkins', 'GitHub / Bitbucket'] },
    { t: 'Design & Tools', items: ['Figma', 'Adobe Photoshop', 'Jira', 'Asana', 'Cybersecurity Awareness'] }
  ],
  impact: [
    { n: '100%', t: 'AI-coded products delivered', p: 'Recent products shipped end to end through AI-assisted development — from architecture to release.' },
    { n: '~67%', t: 'Less development time', p: 'AI woven through the delivery workflow cut development time by roughly two-thirds.' },
    { n: '~95%', t: 'Fewer critical errors', p: 'Automated end-to-end testing with Playwright and AI caught critical defects before release.' },
    { n: '~40%', t: 'Faster delivery', p: 'Sharper solutioning combined with AI accelerated delivery across the board.' }
  ]
};
