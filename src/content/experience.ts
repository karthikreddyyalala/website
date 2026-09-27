export type TimelineEntry = {
  id: string;
  period: string;
  title: string;
  org: string;
  location: string;
  kind: "work" | "education" | "credential";
  points: string[];
  tech?: string[];
  /** Links out to the case study section. */
  caseStudyId?: string;
};

export const timeline: TimelineEntry[] = [
  {
    id: "professordm",
    period: "Sep 2026 – Apr 2027",
    title: "AI Systems Architect & Guardrails Lead",
    org: "ProfessorDM Technologies Inc.",
    location: "ASU Capstone · Remote (New Brunswick, CA)",
    kind: "work",
    points: [
      "Leading technical architecture for a seven-person capstone team building a production AI SaaS platform that converts Instagram DM traffic into monetized, searchable expert knowledge for a creator with 165K+ followers.",
      "Owning cloud infrastructure, CI/CD pipelines, data architecture, authentication/RBAC, secrets management, observability and release gates across five integrated technical workstreams.",
      "Co-designing AI guardrails, prompt/model change controls and evaluation gates to ensure no AI-generated response reaches consumers without creator review and multi-stage safety filtering.",
      "Defining interface contracts, security standards, and architecture decision records that five workstream leads build against, coordinating cross-service integration from Instagram webhooks through AI classification, semantic retrieval, creator review and answer delivery.",
      "Accountable for security hardening, regression testing strategy, performance reviews and operational readiness ahead of controlled live trials with real users on the Sweetlife Flora Instagram account.",
    ],
    tech: ["AWS", "Supabase", "pgvector", "Vercel", "Stripe", "Meta Graph API", "CI/CD", "RBAC", "Observability"],
  },
  {
    id: "avis",
    period: "May – Aug 2026",
    title: "AI Enablement Intern",
    org: "Avis Budget Group",
    location: "Parsippany, NJ",
    kind: "work",
    points: [
      "Spearheaded four end-to-end software initiatives from system architecture and API design through front-end and back-end implementation, saving 170+ engineering and product hours.",
      "Presented designs to the Director and VP of Customer Experience; demoed the platform directly to the CEO.",
      "Delivered AI visibility research to the VP of Customer Experience.",
    ],
    tech: ["Amazon Bedrock", "AgentCore", "Guardrails", "AWS Lambda", "API Gateway", "DynamoDB", "Azure AD"],
    caseStudyId: "avis",
  },
  {
    id: "aws-cert",
    period: "2025",
    title: "AWS Certified Cloud Practitioner",
    org: "Amazon Web Services",
    location: "CLF-C02",
    kind: "credential",
    points: [],
  },
  {
    id: "food-forest",
    period: "May – Jul 2025",
    title: "Data Analyst Intern",
    org: "Food Forest AI",
    location: "Philadelphia, PA",
    kind: "work",
    points: [
      "Engineered GPT-powered extraction pipelines to scrape, parse, and validate 200+ company records against agreed schemas, improving dataset quality by 40%.",
      "Automated deduplication and anomaly flagging, removing manual cleaning from the ingestion path.",
    ],
    tech: ["Python", "OpenAI APIs", "Web scraping", "Data validation"],
  },
  {
    id: "yjr",
    period: "May – Jul 2024",
    title: "Software Engineer Intern",
    org: "YJR Realtors",
    location: "Hyderabad, India",
    kind: "work",
    points: [
      "Designed and coded a responsive customer-facing interface with AI chat agents that resolved property inquiries end to end.",
      "Developed a Python and SendGrid automation script for personalized outreach at scale, removing hours of manual work weekly.",
      "Built an internal lead management dashboard with automated follow-up logic and real-time status tracking, improving team response time by 40%.",
    ],
    tech: ["React", "Python", "SendGrid API"],
  },
  {
    id: "asu",
    period: "2023 – 2027",
    title: "B.S. Computer Science",
    org: "Arizona State University",
    location: "Tempe, AZ",
    kind: "education",
    points: [
      "4.0 GPA. Dean's List every semester: Fall 2023 through Fall 2025.",
      "Coursework: Algorithms, Data Structures, Operating Systems, Software Engineering, Artificial Intelligence, Machine Learning, Cybersecurity, Discrete Mathematics.",
    ],
  },
];
