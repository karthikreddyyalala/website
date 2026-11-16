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
    tagline: "An AI mock interviewer that pushes back on vague answers and remembers where you struggled.",
    body: "Five LangGraph agents run each interview: intake reads your resume and the job description, the planner builds the question plan, Marcus the interviewer asks one follow-up at a time, the evaluator decides whether each answer would survive a real interviewer, and memory carries your weak spots into the next session. I measured it on 76 hand-labeled interview situations, each run three times: 76/76 correct decisions, 34/34 correct verdicts, and prompt injection never changed a decision. That eval caught an SDK bug that would have broken every live model call while 1,500+ unit tests passed. It also has a live coding round with Python running in your browser across all 75 Blind 75 problems, streaming voice, and an optional real video avatar.",
    tech: ["LangGraph", "Amazon Bedrock", "FastAPI", "React", "DynamoDB", "AWS Lambda", "Cognito", "Pyodide", "Deepgram", "ElevenLabs", "Tavus"],
    github: "https://github.com/karthikreddyyalala/Crucible",
    live: "https://dvbk879zy1q2l.cloudfront.net",
    video: { src: "/videos/crucible-launch.mp4", poster: "/images/projects/crucible-poster.webp" },
    featured: true,
  },
  {
    id: "tagalong",
    title: "TagAlong",
    year: "2026",
    tagline: "A professor points at the board and says \"this cancels with that.\" A visually impaired student hears the exact term in their earbud.",
    body: "Built in 36 hours at HackPrinceton by a team of three. One camera watches the board and the professor's hand, and when they point and say \"this\", every student's phone whispers the exact term, like \"2x, top of the fraction\". The key design call: no AI runs at the moment of pointing. Claude reads the board ahead of time, only when the ink changes, so matching a fingertip, pointer stick, or laser dot to a term is plain geometry in the browser and the whisper is instant. We cut Claude's time to first term from 5.5 s to about 1 s, and when the aim is ambiguous it stays silent instead of guessing. One camera serves up to 50 phones, backed by 1,230 automated tests.",
    tech: ["Claude", "Amazon Bedrock", "Amazon Transcribe", "MediaPipe", "ElevenLabs", "Amazon Polly", "WebSockets", "React", "TypeScript", "Node.js", "Vitest"],
    github: "https://github.com/Chinmay1545/TagAlong",
    live: "https://tagalong-production-da8caab3.up.railway.app",
    video: { src: "/videos/tagalong-demo.mp4", poster: "/images/projects/tagalong-poster.jpg" },
    featured: true,
    badge: "HackPrinceton Fall '26",
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
    body: "An MCP server that indexes your markdown files locally and gives Claude search through two tools, search_docs and list_docs, with a line-range citation on every answer. It combines embeddings with BM25 keyword search, then a cross-encoder reranks the top 20; only the best 5 chunks enter the conversation. Benchmarked on BEIR with significance tests: nDCG@10 of 0.720 on SciFact (+10% over v1) and 0.364 on NFCorpus (+18%), matching qmd on SciFact at 67 ms per search versus 7 s.",
    tech: ["MCP", "Python", "ChromaDB", "BM25 (SQLite FTS5)", "all-MiniLM-L6-v2", "Cross-encoder reranking", "Ollama"],
    github: "https://github.com/karthikreddyyalala/MCP_Knowledge_Base",
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
    video: { src: "/videos/finrag-demo.mp4", poster: "/images/projects/finrag-poster.webp" },
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
