import { buildMaintainerPrompt, triageIssue } from "../src/index.mjs";

const issue = {
  title: "Carrier confirmation before customs release",
  body: "Synthetic example: outsourced transport should be confirmed before clearance release."
};

console.log("triage", triageIssue(issue));
console.log("prompt");
console.log(buildMaintainerPrompt(issue));
