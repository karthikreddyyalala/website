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
      "Built and deployed a React/Node.js platform with a conversational AI agent using LangChain, OpenAI API, and Pinecone vector search for natural-language listing queries and 24/7 tour scheduling.",
      "Engineered an AWS Textract document processing pipeline to parse deeds, leases, and contracts, extract metadata, and flag compliance risks and financial exposures before closing.",
      "Automated backend workflows using S3 and SendGrid to streamline contract ingestion, secure document storage, and customer communications, improving team response time by 40%.",
    ],
    tech: ["React", "Node.js", "LangChain", "OpenAI API", "Pinecone", "AWS Textract", "S3", "SendGrid"],
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
