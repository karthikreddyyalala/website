/**
 * Grouped by what it's for, not by proficiency.
 * Deliberately no percentage levels; a number I assign to my own skill
 * isn't evidence of anything.
 */
export type StackGroup = {
  id: string;
  label: string;
  note: string;
  items: string[];
};

export const stack: StackGroup[] = [
  {
    id: "engineering",
    label: "Software Engineering",
    note: "How the work gets done",
    items: [
      "System architecture",
      "REST API design",
      "Unit testing",
      "Feature testing",
      "Code review",
      "CI/CD",
      "Agile",
      "Git / GitHub",
    ],
  },
  {
    id: "ai",
    label: "AI / GenAI",
    note: "What I reach for first",
    items: [
      "Amazon Bedrock",
      "Bedrock AgentCore",
      "Bedrock Knowledge Bases",
      "Bedrock Guardrails",
      "Claude",
      "OpenAI APIs",
      "LangGraph",
      "LangChain",
      "CrewAI",
      "RAG",
      "RAG evaluation",
      "Agent loops / tool use",
      "Vector search",
      "Embeddings",
      "Prompt engineering",
      "PyTorch",
      "TensorFlow",
      "Hugging Face",
    ],
  },
  {
    id: "languages",
    label: "Languages",
    note: "",
    items: ["Python", "TypeScript", "JavaScript", "C/C++", "Java", "SQL", "HTML/CSS"],
  },
  {
    id: "web",
    label: "Web & APIs",
    note: "How it reaches a user",
    items: ["React", "Next.js", "Node.js", "FastAPI", "Express", "REST", "WebSocket", "SSE", "Tailwind CSS"],
  },
  {
    id: "cloud",
    label: "Cloud (AWS)",
    note: "Where it runs",
    items: ["Lambda", "API Gateway", "CloudFront", "S3", "DynamoDB", "Cognito", "CloudWatch", "CloudTrail", "WAF", "Azure AD", "Docker"],
  },
  {
    id: "data",
    label: "Databases",
    note: "",
    items: ["PostgreSQL", "MySQL", "MongoDB", "DynamoDB", "Redis", "Firebase"],
  },
];
