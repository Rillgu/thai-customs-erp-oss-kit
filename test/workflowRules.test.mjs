import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  nextMaintainerChecks,
  readinessSummary,
  validateDocumentPackage,
  validateWorkflow
} from "../src/rules/workflowRules.mjs";

describe("validateWorkflow", () => {
  it("accepts a clearance-ready outsourced transport workflow", () => {
    const result = validateWorkflow({
      jobStatus: "clearance_ready",
      declarationStatus: "accepted",
      transportMode: "outsourced",
      carrierConfirmed: true,
      invoiceStatus: "draft",
      documentsVerified: true
    });

    assert.equal(result.ok, true);
    assert.deepEqual(result.errors, []);
  });

  it("blocks release when outsourced carrier is not confirmed", () => {
    const result = validateWorkflow({
      jobStatus: "released",
      declarationStatus: "accepted",
      transportMode: "outsourced",
      carrierConfirmed: false,
      invoiceStatus: "draft",
      documentsVerified: true
    });

    assert.equal(result.ok, false);
    assert.equal(result.errors.some((error) => error.code === "carrier-not-confirmed"), true);
  });

  it("blocks closure until invoice is issued or paid", () => {
    const result = validateWorkflow({
      jobStatus: "closed",
      declarationStatus: "accepted",
      transportMode: "none",
      invoiceStatus: "draft",
      documentsVerified: true
    });

    assert.equal(result.ok, false);
    assert.equal(result.errors.some((error) => error.code === "invoice-not-issued"), true);
  });
});

describe("nextMaintainerChecks", () => {
  it("returns focused repair handles for failed workflows", () => {
    const checks = nextMaintainerChecks({
      jobStatus: "released",
      declarationStatus: "submitted",
      transportMode: "outsourced",
      carrierConfirmed: false,
      invoiceStatus: "draft",
      documentsVerified: false
    });

    assert.deepEqual(checks, [
      "fix:documents-not-verified",
      "fix:declaration-not-accepted",
      "fix:carrier-not-confirmed"
    ]);
  });
});

describe("readinessSummary", () => {
  it("summarizes blocking fields for maintainers", () => {
    const summary = readinessSummary({
      jobStatus: "closed",
      declarationStatus: "rejected",
      transportMode: "none",
      invoiceStatus: "draft",
      documentsVerified: false
    });

    assert.equal(summary.ready, false);
    assert.equal(summary.blockedBy.includes("documentsVerified"), true);
    assert.equal(summary.blockedBy.includes("declarationStatus"), true);
    assert.equal(summary.blockedBy.includes("invoiceStatus"), true);
  });
});

describe("validateDocumentPackage", () => {
  it("accepts a fully verified synthetic document package", () => {
    const result = validateDocumentPackage({
      requiredDocuments: ["commercial_invoice", "packing_list"],
      verifiedDocuments: ["commercial_invoice", "packing_list"]
    });

    assert.equal(result.ok, true);
  });

  it("reports missing verified documents", () => {
    const result = validateDocumentPackage({
      requiredDocuments: ["commercial_invoice", "packing_list", "bill_of_lading"],
      verifiedDocuments: ["commercial_invoice"]
    });

    assert.equal(result.ok, false);
    assert.equal(result.errors.length, 2);
    assert.equal(result.errors[0].code, "document-not-verified");
  });
});
