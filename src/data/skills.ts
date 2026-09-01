import type { Skill } from "@/types";

// Shared skill catalog. Referenced by id across careers, pathways, resources.
export const skills: Skill[] = [
  // Design
  { id: "design-principles", name: "Design Principles", category: "core", description: "Foundational visual and layout principles that guide clear, usable design." },
  { id: "visual-hierarchy", name: "Visual Hierarchy", category: "core", description: "Organising elements so users scan and understand content in the right order." },
  { id: "typography", name: "Typography", category: "core", description: "Choosing and pairing type to support readability and brand tone." },
  { id: "color-theory", name: "Colour Theory", category: "core", description: "Using colour systematically for contrast, meaning and accessibility." },
  { id: "ux-fundamentals", name: "UX Fundamentals", category: "core", description: "Core principles of usability, accessibility and user-centred design." },
  { id: "user-research", name: "User Research", category: "technical", description: "Planning and running interviews, surveys and usability tests." },
  { id: "wireframing", name: "Wireframing", category: "technical", description: "Sketching low-fidelity structure for screens and flows." },
  { id: "prototyping", name: "Prototyping", category: "technical", description: "Building interactive mockups to validate ideas before build." },
  { id: "interaction-design", name: "Interaction Design", category: "technical", description: "Designing how users engage with interface elements and transitions." },
  { id: "design-systems", name: "Design Systems", category: "technical", description: "Building reusable component libraries and style guidelines." },
  { id: "figma", name: "Figma", category: "tools", description: "Industry-standard collaborative interface design tool." },
  { id: "adobe-cc", name: "Adobe Creative Suite", category: "tools", description: "Photoshop, Illustrator and related tools for visual production." },
  { id: "branding", name: "Branding", category: "advanced", description: "Developing visual identity systems that express a brand's voice." },
  { id: "motion-design", name: "Motion Design", category: "advanced", description: "Using animation to communicate state changes and delight." },
  { id: "design-critique", name: "Design Critique", category: "soft", description: "Giving and receiving structured feedback on design work." },

  // Engineering
  { id: "html-css", name: "HTML & CSS", category: "core", description: "Structuring and styling content for the web." },
  { id: "javascript", name: "JavaScript", category: "core", description: "The core scripting language of the web." },
  { id: "typescript", name: "TypeScript", category: "technical", description: "Typed superset of JavaScript used in production codebases." },
  { id: "react", name: "React", category: "technical", description: "Component-based library for building user interfaces." },
  { id: "apis", name: "APIs & Networking", category: "technical", description: "Designing and consuming REST/GraphQL APIs." },
  { id: "databases", name: "Databases", category: "technical", description: "Modelling and querying relational and NoSQL data stores." },
  { id: "git", name: "Git & Version Control", category: "tools", description: "Tracking and collaborating on code changes." },
  { id: "testing", name: "Testing & QA", category: "technical", description: "Writing automated tests to catch regressions." },
  { id: "system-design", name: "System Design", category: "advanced", description: "Architecting scalable, reliable software systems." },
  { id: "algorithms", name: "Data Structures & Algorithms", category: "core", description: "Foundational problem-solving techniques used in technical interviews and engineering." },
  { id: "cloud-fundamentals", name: "Cloud Fundamentals", category: "technical", description: "Core concepts of cloud compute, storage and networking." },
  { id: "ci-cd", name: "CI/CD", category: "tools", description: "Automating build, test and deployment pipelines." },
  { id: "containers", name: "Containers & Orchestration", category: "technical", description: "Packaging and running applications with Docker/Kubernetes." },
  { id: "infra-as-code", name: "Infrastructure as Code", category: "advanced", description: "Managing infrastructure through versioned configuration." },
  { id: "security-fundamentals", name: "Security Fundamentals", category: "core", description: "Core principles of confidentiality, integrity and availability." },
  { id: "network-security", name: "Network Security", category: "technical", description: "Protecting networks against unauthorised access and threats." },
  { id: "threat-analysis", name: "Threat Analysis", category: "technical", description: "Identifying and assessing security risks and vulnerabilities." },
  { id: "incident-response", name: "Incident Response", category: "advanced", description: "Detecting, containing and recovering from security incidents." },
  { id: "penetration-testing", name: "Penetration Testing", category: "advanced", description: "Simulating attacks to find exploitable weaknesses." },

  // Data / AI
  { id: "statistics", name: "Statistics", category: "core", description: "Quantitative methods for analysing and interpreting data." },
  { id: "sql", name: "SQL", category: "technical", description: "Querying and manipulating structured data." },
  { id: "python", name: "Python", category: "technical", description: "General-purpose language widely used for data and automation." },
  { id: "data-visualization", name: "Data Visualisation", category: "technical", description: "Communicating insights clearly through charts and dashboards." },
  { id: "data-cleaning", name: "Data Cleaning & Wrangling", category: "technical", description: "Preparing messy real-world data for analysis." },
  { id: "excel-bi", name: "Excel / BI Tools", category: "tools", description: "Spreadsheet and business intelligence tooling (Excel, Power BI, Tableau)." },
  { id: "machine-learning", name: "Machine Learning", category: "technical", description: "Training models that learn patterns from data." },
  { id: "deep-learning", name: "Deep Learning", category: "advanced", description: "Neural network architectures for complex pattern recognition." },
  { id: "ml-ops", name: "MLOps", category: "advanced", description: "Deploying, monitoring and maintaining ML models in production." },
  { id: "prompt-engineering", name: "Prompt Engineering", category: "technical", description: "Designing effective inputs for large language models." },
  { id: "automation-tools", name: "Automation Tooling", category: "tools", description: "No-code/low-code tools for automating workflows (Zapier, Make)." },
  { id: "data-storytelling", name: "Data Storytelling", category: "soft", description: "Framing data insights into a compelling narrative for stakeholders." },

  // Business / PM
  { id: "market-research", name: "Market Research", category: "core", description: "Gathering and interpreting information about markets and customers." },
  { id: "business-analysis", name: "Business Analysis", category: "core", description: "Translating business needs into clear requirements." },
  { id: "product-thinking", name: "Product Thinking", category: "core", description: "Prioritising outcomes and trade-offs from a user and business lens." },
  { id: "roadmapping", name: "Roadmapping", category: "technical", description: "Sequencing initiatives against strategy and constraints." },
  { id: "stakeholder-management", name: "Stakeholder Management", category: "soft", description: "Aligning diverse stakeholders around shared goals." },
  { id: "agile-scrum", name: "Agile & Scrum", category: "tools", description: "Iterative delivery frameworks for cross-functional teams." },
  { id: "project-planning", name: "Project Planning", category: "technical", description: "Scoping, scheduling and tracking delivery work." },
  { id: "risk-management", name: "Risk Management", category: "technical", description: "Identifying and mitigating project and delivery risks." },
  { id: "financial-literacy", name: "Financial Literacy", category: "core", description: "Understanding budgets, forecasts and business metrics." },
  { id: "negotiation", name: "Negotiation", category: "soft", description: "Reaching agreements that balance competing interests." },
  { id: "presentation-skills", name: "Presentation Skills", category: "soft", description: "Communicating ideas clearly and persuasively." },

  // Marketing / Content
  { id: "content-strategy", name: "Content Strategy", category: "core", description: "Planning content that serves audience and business goals." },
  { id: "copywriting", name: "Copywriting", category: "technical", description: "Writing persuasive, on-brand marketing copy." },
  { id: "seo", name: "SEO", category: "technical", description: "Optimising content for search visibility." },
  { id: "social-media", name: "Social Media Marketing", category: "technical", description: "Planning and running campaigns across social platforms." },
  { id: "analytics-tools", name: "Marketing Analytics", category: "tools", description: "Measuring campaign performance (GA4, Meta Ads Manager)." },
  { id: "email-marketing", name: "Email Marketing", category: "technical", description: "Building lifecycle and nurture campaigns via email." },
  { id: "brand-voice", name: "Brand Voice", category: "advanced", description: "Defining a consistent tone across all content." },
  { id: "video-editing", name: "Video/Motion Editing", category: "tools", description: "Editing short-form and long-form video content." },

  // Sustainability
  { id: "sustainability-frameworks", name: "Sustainability Frameworks", category: "core", description: "ESG, carbon accounting and reporting standards." },
  { id: "lifecycle-assessment", name: "Lifecycle Assessment", category: "technical", description: "Measuring environmental impact across a product's lifecycle." },
  { id: "policy-analysis", name: "Policy & Regulation Analysis", category: "technical", description: "Interpreting environmental policy and compliance requirements." },
  { id: "stakeholder-engagement", name: "Stakeholder Engagement", category: "soft", description: "Building buy-in across communities, regulators and business units." },

  // Cross-cutting soft skills
  { id: "communication", name: "Communication", category: "soft", description: "Explaining ideas clearly to varied audiences." },
  { id: "collaboration", name: "Collaboration", category: "soft", description: "Working effectively with cross-functional teams." },
  { id: "problem-solving", name: "Problem Solving", category: "soft", description: "Breaking down ambiguous problems into solvable parts." },
  { id: "critical-thinking", name: "Critical Thinking", category: "soft", description: "Evaluating information and arguments objectively." },
  { id: "time-management", name: "Time Management", category: "soft", description: "Prioritising and structuring work to meet deadlines." },
  { id: "portfolio-building", name: "Portfolio Building", category: "soft", description: "Curating and presenting work to demonstrate capability." },
  { id: "interview-prep", name: "Interview Preparation", category: "soft", description: "Practicing for technical and behavioural interviews." },
];

export const skillById = (id: string): Skill | undefined => skills.find((s) => s.id === id);

export const skillsByIds = (ids: string[]): Skill[] =>
  ids.map(skillById).filter((s): s is Skill => Boolean(s));
