/**
 * Avis Budget Group case study.
 *
 * CONFIDENTIALITY: architecture here is deliberately generalized. No table or
 * bucket names, endpoint formats, TTLs, model routing config, guardrail
 * threshold values, or live operational figures. Outcome metrics are limited to
 * those already present in the handout resume.
 * See docs/PRE-DEPLOY-CHECKLIST.md.
 */

export type DiagramStage = {
  label: string;
  detail: string;
  /** Rendered as a failure branch beneath the stage. */
  branch?: string;
};

export type Initiative = {
  id: string;
  index: string;
  title: string;
  summary: string;
  tech: string[];
  pipeline?: DiagramStage[];
  /** The engineering judgment. This is the differentiating content. */
  decisions: { title: string; body: string }[];
  /**
   * A margin note in Karthik's own voice.
   * DRAFT — written from what he described, and the one place on the site where
   * the copy is opinion rather than record. Needs his sign-off or rewrite
   * before this goes public.
   */
  aside?: string;
  outcomes?: string[];
};

export const caseStudy = {
  company: "Avis Budget Group",
  qualifier: "Fortune 500",
  role: "AI Enablement Intern",
  location: "Parsippany, NJ",
  period: "May – Aug 2026",

  intro:
    "Embedded with the Customer Experience team on a CEO-sponsored AI initiative. Four end-to-end initiatives, from system architecture and API design through front-end and back-end implementation to production handoff. Designs presented to the Director and VP of Customer Experience; the platform demoed to the CEO.",

  headline: [
    { value: "170+", label: "engineering & product hours saved" },
    { value: "$1M+", label: "projected annual cost savings" },
    { value: "4", label: "initiatives shipped" },
  ],

  initiatives: [
    {
      id: "rag-search",
      index: "01",
      title: "Multilingual knowledge search service",
      summary:
        "A production RAG service over brand documentation, built end to end — retrieval and generation through guardrails, caching, and the analytics to prove it earns its place. Ask a question in English, French, or Spanish and it returns a grounded answer with source citations. A two-layer cache — exact-match and semantic — sits in front of retrieval on DynamoDB: an identical or reworded question comes back in a fraction of the time and skips the model call entirely, cutting cost and latency. Rate limiting and request guardrails protect the entry point, CloudWatch instruments the whole path, and a feedback-analytics dashboard gives the team a live read on whether answers are actually helping people — not just that the service is up. I owned the architecture, the API, and both ends of the stack.",
      tech: [
        "AWS Lambda",
        "API Gateway",
        "Amazon Bedrock",
        "Bedrock Knowledge Bases",
        "Bedrock Guardrails",
        "DynamoDB",
        "CloudWatch",
        "CloudFront",
      ],
      pipeline: [
        { label: "Request", detail: "rate-limited, language + brand", branch: "" },
        { label: "Input guard", detail: "prompt-attack, PII, topics", branch: "blocked → rephrase" },
        { label: "Cache", detail: "hashed lookup", branch: "hit → skip retrieval" },
        { label: "Retrieval", detail: "multilingual embeddings", branch: "no match → escalate" },
        { label: "Generate", detail: "grounded in context only", branch: "" },
        { label: "Output guard", detail: "grounding + content check", branch: "ungrounded → fallback" },
        { label: "Response", detail: "answer + source citations", branch: "" },
      ],
      decisions: [
        {
          title: "How one index serves three languages",
          body: "The embedding model is multilingual, so a question asked in French and a passage written in English land close together in the same vector space. That means no translation step, no separate index per language, and one retrieval call regardless of what was asked. The model answers in whatever language the question arrived in. Expanding coverage to any new language is a content question, not a systems one.",
        },
        {
          title: "How answers stay scoped to the right brand",
          body: "Brand is derived from the request origin, not accepted from the client. A caller cannot reach another brand's content by changing a parameter. Every document carries its brand as metadata set at ingestion time, and retrieval filters on that tag. One index serves all brands, and onboarding a new one is a data change rather than a new deployment.",
        },
        {
          title: "Why the response is checked twice",
          body: "Filtering the request is not the same as trusting the response. The input pass rejects prompt attacks and sensitive data before anything reaches the model. The output pass verifies the answer is actually supported by the retrieved passages. Anything ungrounded becomes a handoff, not a response.",
        },
        {
          title: "Why it shipped with adversarial tests, not just unit tests",
          body: "Unit tests prove the happy path returns the right shape. They say nothing about what happens when someone tries to talk the system into ignoring its instructions. I validated end to end with both: unit suites for the request pipeline, and an adversarial suite for injection, PII leakage, and off-domain questions.",
        },
        {
          title: "Why building the pipeline was only half the job",
          body: "A RAG system that runs is not the same as one that helps. Retrieval and grounding are scored against a fixed evaluation set, so a regression shows up as a failing number rather than a user complaint. And a feedback-analytics dashboard is part of the design, not an afterthought — what people ask, where answers fall short, whether the thing is actually saving anyone time. The point was never just to ship it; it was to be able to prove it was worth keeping.",
        },
      ],
      aside:
        "One embedding space instead of one index per language. That single choice is why adding a language here is a content problem, not a project.",
      outcomes: [
        "Cut repeat-query cost and latency with a two-layer cache that skips the model call",
        "Scored retrieval and grounding on a fixed evaluation set to catch regressions early",
        "Hardened end to end with unit and adversarial suites — injection, PII, off-domain",
        "Built a feedback-analytics dashboard to measure real impact, not just uptime",
        "Projected 100 engineering hours saved once live",
        "Projected $1M+ annual savings; architected to serve millions of customers",
      ],
    },

    {
      id: "internal-assistant",
      index: "02",
      title: "Internal AI assistant",
      summary:
        "An employee-facing assistant for company policy and compliance questions, built on AWS with AWS AgentCore at the core. Rather than giving AgentCore full control, the architecture keeps it constrained: retrieval pulls the top-ranked chunks from the Knowledge Base based on the live config, then passes them to AgentCore — which wraps the Claude call, enforces guardrails, handles multi-turn session memory, and formats the response. Admins manage everything through a web console. Uploads go straight to S3, a Lambda triggers KB resync, and new content is live without a deploy. Employees log in with SSO and chat. Admins get the pipeline. Users get the interface.",
      tech: [
        "Bedrock AgentCore",
        "Azure AD SSO/MFA",
        "SSE streaming",
        "DynamoDB",
      ],
      pipeline: [
        { label: "Draft", detail: "admin edits prompt", branch: "safety scan → reject" },
        { label: "Test", detail: "against the draft, live", branch: "" },
        { label: "Approve", detail: "cannot skip testing", branch: "" },
        { label: "Publish", detail: "re-verified, versioned", branch: "zero downtime" },
      ],
      decisions: [
        {
          title: "Why a system prompt is treated as executable code",
          body: "It is attack surface. Anything an admin writes passes two independent scans before it is stored — a pattern denylist for known jailbreak shapes, and a model-based review for what the patterns miss. If either objects, nothing is written at all.",
        },
        {
          title: "Why you cannot approve what you have not tested",
          body: "The console gates each step on the previous one: save, then test against the draft, then approve, then publish. Approval is re-verified at publish time rather than trusted from earlier, and editing after approval resets the gate. Config changes go live without a restart, and if the config store is unreachable the service falls back to a known-good default with a visible warning instead of failing.",
        },
        {
          title: "Why follow-up questions get rewritten before search",
          body: "\"How do those two relate?\" is meaningless to a search index. Before retrieval, a small fast model resolves pronouns and references against the recent conversation into a standalone question. It is skipped entirely on the first turn, so the common case costs nothing.",
        },
      ],
      aside:
        "Gating publish behind a test felt like friction until you imagine the alternative: an untested prompt going live to the whole company.",
      outcomes: [
        "Passed a 6-phase test suite: 100% faithfulness, 0 hallucinations, 5/5 injection attempts blocked",
        "Constrained the model with AgentCore — guardrails, memory, and formatting on every call",
        "Shipped a zero-downtime config pipeline: draft → test → approve → publish, versioned",
        "Delivered real-time streaming answers with multi-turn session memory",
        "Replaced a third-party LLM SaaS dependency with an in-house AWS stack — keeping employee and compliance data in the company's own environment",
      ],
    },

    {
      id: "nl-analytics",
      index: "03",
      title: "Natural-language-to-SQL analytics engine",
      summary:
        "A self-correcting agent loop that turns a plain-English question into a table, a summary, and a chart — no SQL, no data-team ticket, no waiting a day for someone to pull it. It runs as a tool-use loop on the Vercel AI SDK over Bedrock Claude: the agent plans its approach, pulls only the schema it needs, writes the SQL, guards and executes it, then presents the result — and if a query fails, it reads the error and corrects itself instead of giving up. I analyzed the full database and deliberately scoped the agent to the business-relevant tables rather than the entire operational schema, which cut token cost and latency sharply with nothing lost in coverage. Verified against a gold question set before anyone relied on it. Customer PII is structurally incapable of reaching the output.",
      tech: ["Amazon Bedrock", "Claude Sonnet", "Vercel AI SDK", "Tool-use agent", "Next.js", "PGlite", "SQL"],
      pipeline: [
        { label: "Question", detail: "plain English", branch: "" },
        { label: "Plan", detail: "agent picks the approach", branch: "" },
        { label: "Schema", detail: "only the tables needed", branch: "PII columns excluded" },
        { label: "SQL", detail: "written, self-corrects on error", branch: "" },
        { label: "Execute", detail: "SELECT-only, PII-blocked", branch: "blocked → rewrite" },
        { label: "Result", detail: "table + summary + chart", branch: "" },
      ],
      decisions: [
        {
          title: "Why it's an agent loop and not a single prompt",
          body: "One prompt writing SQL in a single shot fails silently the moment a column name is off or a join doesn't hold. Instead the model works as an agent with a small set of tools — plan, read schema, execute, present — and a hard stop once an answer is produced. Every query passes a guard before it touches the database: SELECT-only, no restricted columns, no PII. If execution fails, the error goes back to the agent and it tries again rather than returning nothing. That loop is what makes it reliable enough to hand to a non-technical team.",
        },
        {
          title: "Why the agent sees a scoped schema, not the whole database",
          body: "I analyzed the entire database and found most of it was operational tables the questions never needed. Handing all of that to the model would have meant more tokens, slower plans, and more ways to write a wrong join. So I scoped the agent to the business-relevant tables only — smaller prompts, lower cost, faster answers, and no loss of coverage on the questions people actually ask.",
        },
        {
          title: "Why PII is removed from the schema, not filtered from the output",
          body: "A filter is something you can forget to apply. Sensitive customer fields were excluded from the schema the model can see at all, and the remaining sensitive fields were restricted to aggregate use only. The model cannot select a column it was never shown.",
        },
        {
          title: "Why I verified against production instead of mocks",
          body: "I checked the schema column by column against real production data and found seven column-name mismatches that mock-based testing had never surfaced. Every one would have been a runtime failure in front of a user. I also proved the composite join across the two source tables end to end on real matched cases rather than assuming the key held.",
        },
        {
          title: "Why I built a scored question set before trusting it",
          body: "A text-to-SQL system that is right most of the time is not usable, because you cannot tell which time you are in. I built a gold set of business questions covering every major table category and scored the engine against it — 44 of 44 correct. That number is the reason anyone was willing to rely on the tool.",
        },
      ],
      aside:
        "Seven column-name mismatches. Mock data would have let every one of them ship, and each would have failed in front of a user.",
      outcomes: [
        "Reduced data turnaround from days to seconds",
        "Scored 100% (44/44) on a gold-question evaluation set",
        "Scoped the schema to business tables only — lower token cost, faster plans, no coverage lost",
        "Shipped a KPI dashboard so the team reads regular metrics without a query",
        "Saved 50 engineering and 20 product hours",
        "Handed off production-ready with docs, schema, and runbook",
      ],
    },

    {
      id: "jira-assistant",
      index: "04",
      title: "AI delivery assistant",
      summary:
        "Delivery tracking that reports itself. Engineers get a personalized morning digest of what is overdue, due today, and coming up; managers get a weekly board-health snapshot. Deployed organization-wide.",
      tech: ["Rovo AI workflows", "Jira automation", "Scheduled triggers"],
      pipeline: [
        { label: "Scheduled scan", detail: "daily + weekly", branch: "" },
        { label: "Group by owner", detail: "per-assignee lookup", branch: "" },
        { label: "Categorize", detail: "overdue / today / upcoming", branch: "" },
        { label: "Deliver", detail: "personalized digest", branch: "live dashboard" },
      ],
      decisions: [
        {
          title: "Why the report is pushed, not published",
          body: "A dashboard only helps the people who remember to open it. Routing each engineer only their own items, in their inbox, before the day starts, is what actually changed behaviour — the live dashboard exists for drill-down, not as the primary surface.",
        },
      ],
      aside:
        "The least sophisticated thing I built and one of the most used. A schedule, a query, an email.",
      outcomes: [
        "Deployed org-wide, automating the daily overdue-ticket triage a delivery lead did by hand",
        "Bypassed Jira's 100-issue automation lookup cap with REST web requests for full board coverage",
      ],
    },
  ] satisfies Initiative[],

  research: {
    title: "AI visibility research",
    forWhom: "Delivered to the VP of Customer Experience",
    body: "Alongside the engineering work, I joined the weekly Customer Experience meetings. I took the initiative to investigate how AI is reshaping the way customers choose a car rental provider — ran a competitive analysis across the company and its competitors using public customer data, and delivered a written report with findings and recommendations. I also thought a real-time view of public customer sentiment would be useful for the team, so I built a prototype social listening dashboard that aggregates reviews across Google, Trustpilot, the App Store, Google Play, and Reddit — surfacing sentiment trends and billing dispute patterns in one place.",
    note: "",
    liveLink: "https://cx-dashboard-backend-production.up.railway.app/",
    liveLinkLabel: "View the prototype dashboard",
  },
} as const;
