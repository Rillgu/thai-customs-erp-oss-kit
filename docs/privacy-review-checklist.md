# Privacy Review Checklist

Use this checklist before accepting issues, pull requests, examples, or release artifacts.

## Reject Or Redact

- Customer names
- Shipment numbers from production systems
- Tax IDs
- Phone numbers
- Email addresses
- API keys or tokens
- Database files
- Uploaded trade documents
- Private screenshots
- Internal-only workflow names

## Acceptable Examples

- Synthetic workflow objects
- Generic document names such as `commercial_invoice`
- Generic statuses such as `accepted`, `released`, or `closed`
- Public documentation links
- Reproducible test cases without private data

## Maintainer Actions

- Ask contributors to replace private examples with synthetic ones.
- Move security concerns to private reporting when needed.
- Keep public issue history free of secrets and customer records.
- Review release packages with `npm pack --dry-run` before publishing.
