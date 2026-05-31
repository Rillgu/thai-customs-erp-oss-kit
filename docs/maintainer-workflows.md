# Maintainer Workflows

This document describes the open-source maintenance workflows that this project is designed to support.

## Issue Triage

- Label workflow bugs by domain: customs, transport, finance, documents, compliance, or i18n.
- Ask reporters for a minimal synthetic example instead of real customer data.
- Confirm whether the problem is a rule gap, an implementation bug, or a documentation gap.

## Pull Request Review

- Require tests for every workflow behavior change.
- Reject changes that add secrets, database dumps, uploaded files, or private business records.
- Prefer explicit rule names over implicit status transitions.
- Keep validation messages suitable for multilingual ERP systems.

## Release Readiness

- Run `npm test`.
- Review changes to workflow state names.
- Verify README examples still work.
- Confirm security hygiene before tagging.

## Codex And API Credit Use Cases

API credits would be used for maintainer automation that helps:

- Review pull requests for workflow-contract regressions.
- Generate synthetic test cases from issue reports.
- Summarize issue triage without exposing private business data.
- Check documentation consistency across customs, transport, finance, and compliance sections.
- Assist release-note drafting from merged changes.
