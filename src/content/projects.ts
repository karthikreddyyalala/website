export type Project = {
  id: string;
  title: string;
  year: string;
  tagline: string;
  body: string;
  tech: string[];
  image?: string;
  github?: string;
  live?: string;
  featured: boolean;
  badge?: string;
  /** Self-hosted demo. Plays in an on-page dialog. */
  video?: { src: string; poster: string };
};

export const projects: Project[] = [
  {
    id: "crucible",
    title: "Crucible",
    year: "2026",
    tagline: "A multi-stage interview agent that rewrites the next session around where you struggled last time.",
    body: "A six-stage LangGraph pipeline (intake, planning, live interview, evaluation, cross-session memory, coaching) that rewrites each session's question plan around the candidate's saved weak spots. End-to-end tests assert on the generated prompt text itself, and a golden-dataset eval harness covers adversarial answers like buzzword padding and subtly wrong Big-O. Serverless on AWS with 100+ backend tests, CI, and optimistic locking that fixed a concurrent-write data-loss bug in session memory.",
    tech: ["LangGraph", "Amazon Bedrock", "FastAPI", "React", "DynamoDB", "AWS Lambda", "Cognito"],
    github: "https://github.com/karthikreddyyalala/Crucible",
    live: "https://dvbk879zy1q2l.cloudfront.net",
    video: { src: "/videos/crucible-demo.mp4", poster: "/images/projects/crucible-poster.webp" },
    featured: true,
  },
  {
    id: "open-autodata",
    title: "Open AutoData",
    year: "2026",
    tagline: "Five local-model agents that write, filter, and grade fine-tuning datasets.",
    body: "Built at Hack Day 2026 on Meta FAIR's Agentic Self-Instruct method: agents write questions from documents, check for leakage, and grade answers from a weak (Llama 3.2 3B) and a strong (DeepSeek V4.1 Flash) model. A question is kept only when the weak model scores 65% or below, the strong model scores 60-95%, and the gap exceeds 20 points. Against Meta's paper: a 56.5-point weak/strong gap vs. 31.4, and an 84.2% vs. 77.2% strong-solver average.",
    tech: ["LangGraph", "OpenRouter", "Llama 3.2", "DeepSeek", "Nemotron", "Snowflake", "Next.js", "Tailwind", "pytest"],
    github: "https://github.com/ritvikreddygangula/Open-AutoData",
    live: "https://open-auto-data.vercel.app",
    image: "/images/projects/open-autodata.webp",
    featured: true,
    badge: "Hack Day 2026",
  },
  {
    id: "mcp-knowledge-base",
    title: "MCP Knowledge Base",
    year: "2026",
    tagline: "Private docs inside Claude, with no uploads, no cloud, and exact citations.",
    body: "An MCP server that indexes internal markdown files locally and gives Claude Desktop semantic search through two tools, search_docs and list_docs, with a line-range citation on every answer. The docs stay on disk; only the retrieved chunk (typically 400 tokens) enters the conversation. On MS MARCO it scores MRR@10 = 0.585 across 1.1M passages and 6,980 official dev queries, 3.5× above the BM25 keyword-search baseline.",
    tech: ["MCP", "Python", "ChromaDB", "FAISS", "all-MiniLM-L6-v2", "SentenceTransformers", "Arize Phoenix"],
    github: "https://github.com/karthikreddyyalala/MCP_Base",
    live: "https://mcp-kb-site.vercel.app",
    image: "/images/projects/mcp-knowledge-base.webp",
    featured: true,
  },
  {
    id: "deep-research",
    title: "Deep Research Agent Team",
    year: "2025",
    tagline: "A planner, executor, and validator loop that does the reading for you.",
    body: "A modular multi-agent research system where a planner decomposes a topic, executors gather sources, and a validator checks the synthesis before it is returned. Built with retry logic, exponential backoff, and output caching so a single failed tool call does not sink an entire run. Cut manual research effort by 70%.",
    tech: ["CrewAI", "LangGraph", "OpenAI APIs", "Pinecone", "Python"],
    featured: true,
  },
  {
    id: "finrag-mcp",
    title: "FinRAG MCP",
    year: "2026",
    tagline: "Cited financial intelligence over 500+ SEC filings, served through an MCP server.",
    body: "An MCP server that answers financial questions with source citations across 500+ SEC filings from 50 companies, refreshed weekly from EDGAR with table-aware extraction. Retrieval runs four stages: Claude Haiku query rewriting, hybrid BM25 and dense search on Bedrock Knowledge Bases, neural reranking, and a numerical grounding verifier that catches hallucinated figures. A 300-question FinanceBench set with ragas metrics runs as a regression gate in GitHub Actions.",
    tech: ["Amazon Bedrock", "MCP SDK", "Python", "FastAPI", "ragas", "AWS Lambda", "DynamoDB", "CloudWatch"],
    github: "https://github.com/karthikreddyyalala/FinRAG",
    live: "https://dashboard-weld-nine-28.vercel.app",
    image: "/images/projects/finrag-mcp.webp",
    featured: true,
  },
  {
    id: "trading-floor",
    title: "Autonomous Trading Floor",
    year: "2025",
    tagline: "Four agents that argue about a trade before making it.",
    body: "A simulated trading desk where an analyst, a trader, a risk manager, and a critic evaluate the same position and have to reach a decision. It's wired across six MCP servers exposing 44 tools, so the hard part turned out to be tool routing.",
    tech: ["MCP", "CrewAI", "Docker", "OpenAI APIs", "Python"],
    featured: true,
  },
  {
    id: "chatify",
    title: "Chatify",
    year: "2024",
    tagline: "Real-time messaging, built from the socket up.",
    body: "A full-stack messaging application with bi-directional event-based communication over Socket.io, on a Node and Express backend. I built it to learn connection lifecycle, room state, and reconnection handling.",
    tech: ["Node.js", "Express", "Socket.io", "MongoDB"],
    image: "/images/projects/chatify.webp",
    featured: false,
  },
  {
    id: "stock-predictor",
    title: "Stock Price Predictor",
    year: "2024",
    tagline: "An LSTM that beat the linear baseline by 12%.",
    body: "A sequence model for price forecasting over 50k+ data points, with normalization, windowing, and hyperparameter tuning. The useful lesson was in the evaluation: a model that looks good on a chart can still be worse than the baseline you didn't bother to run.",
    tech: ["Python", "TensorFlow", "Pandas", "Matplotlib"],
    featured: false,
  },
];
