# Release Process

This project uses small, reviewable releases.

## Before Release

1. Run `npm test`.
2. Check that examples are synthetic.
3. Review changed workflow state names.
4. Confirm no private data, credentials, database files, uploaded documents, or screenshots were added.
5. Update `CHANGELOG.md`.

## Release Tag

Use semantic version tags:

```bash
git tag v0.1.0
git push origin v0.1.0
```

## Release Notes

Release notes should explain:

- New workflow rules
- New maintainer docs
- Any privacy or security review changes
- Breaking changes to rule names or validation outputs
