import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildMaintainerPrompt, triageIssue } from "../src/rules/issueTriage.mjs";

describe("triageIssue", () => {
  it("labels customs and outsourced transport workflow issues", () => {
    const result = triageIssue({
      title: "Carrier confirmation before customs release",
      body: "Synthetic example: outsourced transport should be confirmed before clearance release."
    });

    assert.equal(result.labels.includes("customs"), true);
    assert.equal(result.labels.includes("outsourced-transport"), true);
    assert.equal(result.labels.includes("needs-triage"), true);
    assert.equal(result.suggestedMaintainerAction, "review-workflow-rule-gap");
  });

  it("flags sensitive data before maintainer review", () => {
    const result = triageIssue({
      title: "Document upload failure",
      body: "Please contact alice@example.com about this invoice."
    });

    assert.equal(result.labels.includes("privacy-review"), true);
    assert.deepEqual(result.privacyFindings, ["possible-email"]);
    assert.equal(result.suggestedMaintainerAction, "remove-or-redact-sensitive-data-before-review");
  });

  it("asks for a synthetic example when no domain is clear", () => {
    const result = triageIssue({
      title: "Question",
      body: "How should this work?"
    });

    assert.equal(result.suggestedMaintainerAction, "ask-for-synthetic-workflow-example");
  });
});

describe("buildMaintainerPrompt", () => {
  it("builds a privacy-aware maintainer prompt", () => {
    const prompt = buildMaintainerPrompt({
      title: "Thai glossary update",
      body: "Add generic terminology for declarations."
    });

    assert.equal(prompt.includes("Suggested labels:"), true);
    assert.equal(prompt.includes("Do not include private customer data"), true);
  });
});
