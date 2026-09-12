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
};

export const projects: Project[] = [
  {
    id: "mcp-knowledge-base",
    title: "MCP Knowledge Base",
    year: "2026",
    tagline: "Private docs, inside Claude — no uploads, no cloud, exact citations.",
    body: "An MCP server that indexes a company's internal markdown files locally and gives Claude Desktop semantic search over them via two registered tools: search_docs and list_docs. Every answer includes a line-range citation so engineers can verify the source. The entire knowledge base stays on disk — only the retrieved chunk (typically 400 tokens) enters the conversation, never the full corpus. Benchmarked on MS MARCO: MRR@10 = 0.585 on 1.1M passages against 6,980 official dev queries, 3.5× above the BM25 keyword-search baseline. Built because the only alternative — uploading docs to Claude — sends your entire filing cabinet to a third-party server upfront. This sends one page at a time, only when Claude asks for it.",
    tech: ["MCP", "Python", "ChromaDB", "FAISS", "all-MiniLM-L6-v2", "SentenceTransformers", "Arize Phoenix"],
    github: "https://github.com/karthikreddyyalala/MCP_Base",
    live: "https://mcp-kb-site.vercel.app",
    featured: true,
  },
  {
    id: "crucible",
    title: "Crucible",
    year: "2026",
    tagline: "A multi-stage interview agent that rewrites the next session around where you struggled last time.",
    body: "A LangGraph pipeline across six stages (intake, planning, live interview, evaluation, cross-session memory, coaching) where each session's question plan is rewritten around the candidate's persisted weak spots. Verified by end-to-end tests that assert on actual generated prompt text, proving real adaptation rather than schema conformance. Golden-dataset eval harness covers adversarial cases: buzzword-padded answers, length-bias traps, subtly wrong Big-O buried in fluent prose. Claude Haiku handles structured extraction; Sonnet handles reasoning. A concurrent-write data-loss bug in cross-session memory was caught and fixed via optimistic locking with conditional writes. Full serverless stack with 100+ backend tests and CI.",
    tech: ["LangGraph", "Amazon Bedrock", "FastAPI", "React", "DynamoDB", "AWS Lambda", "Cognito"],
    featured: true,
  },
  {
    id: "deep-research",
    title: "Deep Research Agent Team",
    year: "2025",
    tagline: "A planner, executor, and validator loop that does the reading for you.",
    body: "A modular multi-agent research system where a planner decomposes a topic, executors gather sources, and a validator checks the synthesis before it is returned. Built with retry logic, exponential backoff, and output caching so a single failed tool call does not sink an entire run. Cut manual research effort by 70%.",
    tech: ["CrewAI", "LangGraph", "OpenAI APIs", "Pinecone", "Python"],
    github: "https://github.com/karthikreddyyalala/Deep-Research-Agent-Team-",
    featured: true,
  },
  {
    id: "trading-floor",
    title: "Autonomous Trading Floor",
    year: "2025",
    tagline: "Four agents that argue about a trade before making it.",
    body: "A simulated trading desk where an analyst, a trader, a risk manager, and a critic evaluate the same position and have to reach a decision. Wired across six MCP servers exposing 44 tools, which made the interesting problem tool routing rather than prompting.",
    tech: ["MCP", "CrewAI", "Docker", "OpenAI APIs", "Python"],
    github: "https://github.com/karthikreddyyalala/Autonomous-Trading-Floor",
    featured: true,
  },
  {
    id: "chatify",
    title: "Chatify",
    year: "2024",
    tagline: "Real-time messaging, built from the socket up.",
    body: "A full-stack messaging application with bi-directional event-based communication over Socket.io, on a Node and Express backend. Built to understand connection lifecycle, room state, and reconnection handling rather than to reinvent a chat app.",
    tech: ["Node.js", "Express", "Socket.io", "MongoDB"],
    image: "/images/projects/chatify.webp",
    github: "https://github.com/karthikreddyyalala",
    featured: false,
  },
  {
    id: "stock-predictor",
    title: "Stock Price Predictor",
    year: "2024",
    tagline: "An LSTM that beat the linear baseline by 12%.",
    body: "A sequence model for price forecasting over 50k+ data points, with normalization, windowing, and hyperparameter tuning. The useful lesson was in the evaluation: a model that looks good on a chart can still be worse than the baseline you didn't bother to run.",
    tech: ["Python", "TensorFlow", "Pandas", "Matplotlib"],
    github: "https://github.com/karthikreddyyalala/Stock-Price-Predictor",
    featured: false,
  },
];
