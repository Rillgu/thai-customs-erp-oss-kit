# Thai Customs ERP OSS Kit

[![CI](https://github.com/Rillgu/thai-customs-erp-oss-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/Rillgu/thai-customs-erp-oss-kit/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/Rillgu/thai-customs-erp-oss-kit?include_prereleases)](https://github.com/Rillgu/thai-customs-erp-oss-kit/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Open workflow rules, validation checks, and maintainer runbooks for teams building customs brokerage and outsourced transport ERP systems in Thailand.

This repository is intentionally data-free. It contains reusable patterns, tests, and documentation only. It does not include customer records, production databases, credentials, private documents, or proprietary deployment files.

## What Is Included

- Executable workflow validation rules for customs jobs, declarations, outsourced transport, finance, and compliance handoffs.
- Maintainer checklists for issue triage, pull request review, release readiness, and security review.
- Privacy-aware issue triage helpers for maintainer automation.
- Example tests that show how ERP teams can keep operational workflow rules stable across refactors.
- Notes for multilingual systems that need Chinese, English, and Thai user-facing terminology.

## Why This Exists

Customs brokerage software often mixes legal compliance, operational deadlines, finance settlement, document handling, and transport coordination. Small teams need practical open references for safe ERP workflows without exposing private commercial data.

This project focuses on reusable workflow contracts rather than a full application. The goal is to help maintainers encode business-critical behavior in tests before shipping changes.

## Quick Start

```bash
npm test
```

## Example

```js
import { readinessSummary, validateWorkflow } from "thai-customs-erp-oss-kit";

const workflow = {
  jobStatus: "clearance_ready",
  declarationStatus: "accepted",
  transportMode: "outsourced",
  carrierConfirmed: true,
  invoiceStatus: "draft",
  documentsVerified: true
};

const result = validateWorkflow(workflow);
console.log(result.ok);
console.log(readinessSummary(workflow));
```

Run the executable example:

```bash
node examples/basic-readiness.mjs
node examples/issue-triage.mjs
```

## Scope

In scope:

- Customs job workflow validation
- Outsourced transport coordination
- Finance readiness checks
- Document and compliance handoff rules
- Maintainer automation examples
- Multilingual workflow terminology

Out of scope:

- Customer data
- Production database schemas
- Private company workflows
- Fleet dispatch for owned vehicles
- Portal-specific customer workflows

## Responsible Use

This repository is not legal advice. Customs, VAT, WHT, BOI, and transport rules change over time. Treat these rules as software patterns and verify production behavior with qualified local experts.

## Maintainer Automation

See [docs/codex-maintainer-automation.md](docs/codex-maintainer-automation.md) for the privacy-aware issue triage and PR review use cases this project is designed to support.

## Maintainer

Primary maintainer: [@rillgu](https://github.com/rillgu)

## Public Maintenance Evidence

See [docs/public-maintenance-evidence.md](docs/public-maintenance-evidence.md). This project is new and does not claim broad adoption yet.

For maintainer-support applications, see [docs/openai-codex-for-oss-application.md](docs/openai-codex-for-oss-application.md).
