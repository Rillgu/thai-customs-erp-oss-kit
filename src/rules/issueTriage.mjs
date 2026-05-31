const DOMAIN_RULES = [
  ["documents", ["document", "invoice", "packing list", "bill of lading", "upload"]],
  ["outsourced-transport", ["carrier", "outsourced", "transport", "truck", "delivery"]],
  ["finance", ["invoice", "settlement", "payment", "vat", "wht"]],
  ["customs", ["customs", "declaration", "clearance", "hs code", "release"]],
  ["i18n", ["translation", "thai", "chinese", "english", "locale", "glossary"]],
  ["security", ["secret", "credential", "password", "token", "private data"]]
];

const SENSITIVE_PATTERNS = [
  { code: "possible-api-key", pattern: /\b(sk-[A-Za-z0-9_-]{12,}|gh[pousr]_[A-Za-z0-9_]{20,})\b/u },
  { code: "possible-email", pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/iu },
  { code: "possible-phone", pattern: /\b(?:\+?\d[\d -]{8,}\d)\b/u }
];

export function triageIssue(issue) {
  const title = normalize(issue.title);
  const body = normalize(issue.body);
  const text = `${title}\n${body}`;
  const domains = inferDomains(text);
  const privacyFindings = findSensitiveData(text);
  const labels = [
    ...domains,
    privacyFindings.length > 0 ? "privacy-review" : "needs-triage"
  ];

  return {
    labels: [...new Set(labels)],
    privacyFindings,
    suggestedMaintainerAction: suggestAction(domains, privacyFindings)
  };
}

export function buildMaintainerPrompt(issue) {
  const triage = triageIssue(issue);

  return [
    "Review this open-source ERP workflow issue.",
    "Use synthetic examples only.",
    `Suggested labels: ${triage.labels.join(", ")}`,
    `Maintainer action: ${triage.suggestedMaintainerAction}`,
    "Do not include private customer data in the response."
  ].join("\n");
}

function inferDomains(text) {
  return DOMAIN_RULES
    .filter(([, keywords]) => keywords.some((keyword) => text.includes(keyword)))
    .map(([domain]) => domain);
}

function findSensitiveData(text) {
  return SENSITIVE_PATTERNS
    .filter(({ pattern }) => pattern.test(text))
    .map(({ code }) => code);
}

function suggestAction(domains, privacyFindings) {
  if (privacyFindings.length > 0) {
    return "remove-or-redact-sensitive-data-before-review";
  }

  if (domains.includes("security")) {
    return "move-to-security-review";
  }

  if (domains.length === 0) {
    return "ask-for-synthetic-workflow-example";
  }

  return "review-workflow-rule-gap";
}

function normalize(value) {
  return typeof value === "string" ? value.toLowerCase() : "";
}
