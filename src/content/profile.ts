export const profile = {
  name: "Karthik Reddy Yalala",
  role: "AI Engineer · SDE",
  location: "Tempe, Arizona",

  // The claim. Everything above the fold hangs off this sentence.
  claim:
    "I find the business problem, locate the AI opportunity, and ship the system end to end: architecture, APIs, front end, back end. Most of what I've built lately has AI inside it. The part I care about is making it reliable enough to hand to real users.",

  proof: [
    { value: "Fortune 500", label: "production systems, shipped" },
    { value: "4", label: "initiatives at Avis Budget" },
    { value: "170+", label: "engineering hours saved" },
    { value: "4.0", label: "GPA · ASU '27" },
  ],

  /**
   * Dated on purpose. A "currently" line with no date is decoration; with a
   * date it is a signal the page is tended. Update it or delete it — a stale
   * one is worse than none.
   */
  currently: {
    updated: "August 2026",
    text:
      "Back at ASU for senior year, and rebuilding Interviewer.ai's evaluator agent after the first version graded too generously to be useful.",
  },

  availability: {
    status: "Open to New Grad Software / AI Engineering roles — May 2027",
    active: true,
  },

  contact: {
    email: "karthikreddyy386@gmail.com",
    phone: "+1 (623) 888-4033",
    linkedin: "https://linkedin.com/in/kyalala",
    resume: "/Karthik-Reddy-Yalala-Resume.pdf",
  },

  about: [
    "I'm a senior at Arizona State studying computer science. Most of what I know about building software I learned by shipping things other people then had to rely on.",
    "This summer at Avis Budget Group I took four initiatives from a blank architecture diagram to production handoff — a multilingual retrieval service, an internal assistant, a natural-language analytics engine, and a delivery automation. I owned the system design, the API surface, and both ends of the stack. I presented the designs to a Director and a VP, and demoed the platform to the CEO.",
    "The part I care about most is making sure the thing actually works before anyone else has to rely on it. End-to-end testing, finding the edge cases before users do, and making sure the code is solid enough to ship. That's usually where the difference between a demo and a product lives.",
  ],
} as const;
