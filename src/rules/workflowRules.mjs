const VALID_JOB_STATUSES = new Set([
  "draft",
  "documents_pending",
  "clearance_ready",
  "released",
  "closed"
]);

const VALID_DECLARATION_STATUSES = new Set([
  "not_required",
  "draft",
  "submitted",
  "accepted",
  "rejected"
]);

const VALID_TRANSPORT_MODES = new Set([
  "none",
  "outsourced"
]);

const VALID_INVOICE_STATUSES = new Set([
  "not_required",
  "draft",
  "issued",
  "paid"
]);

export function validateWorkflow(workflow) {
  const errors = [];

  requireEnum(errors, workflow, "jobStatus", VALID_JOB_STATUSES);
  requireEnum(errors, workflow, "declarationStatus", VALID_DECLARATION_STATUSES);
  requireEnum(errors, workflow, "transportMode", VALID_TRANSPORT_MODES);
  requireEnum(errors, workflow, "invoiceStatus", VALID_INVOICE_STATUSES);
  requireBoolean(errors, workflow, "documentsVerified");

  if (workflow.transportMode === "outsourced") {
    requireBoolean(errors, workflow, "carrierConfirmed");
  }

  if (workflow.jobStatus === "clearance_ready") {
    requireDocumentsVerified(errors, workflow);
    requireDeclarationAccepted(errors, workflow);
  }

  if (workflow.jobStatus === "released") {
    requireDocumentsVerified(errors, workflow);
    requireDeclarationAccepted(errors, workflow);
    requireOutsourcedCarrierReady(errors, workflow);
  }

  if (workflow.jobStatus === "closed") {
    requireDocumentsVerified(errors, workflow);
    requireDeclarationAccepted(errors, workflow);
    requireOutsourcedCarrierReady(errors, workflow);
    requireInvoiceIssuedOrPaid(errors, workflow);
  }

  return {
    ok: errors.length === 0,
    errors
  };
}

export function nextMaintainerChecks(workflow) {
  const result = validateWorkflow(workflow);
  if (result.ok) {
    return ["ready-for-review"];
  }

  return result.errors.map((error) => `fix:${error.code}`);
}

function requireEnum(errors, workflow, field, allowedValues) {
  if (!allowedValues.has(workflow[field])) {
    errors.push({
      code: `invalid-${field}`,
      field,
      message: `${field} must be one of: ${Array.from(allowedValues).join(", ")}`
    });
  }
}

function requireBoolean(errors, workflow, field) {
  if (typeof workflow[field] !== "boolean") {
    errors.push({
      code: `invalid-${field}`,
      field,
      message: `${field} must be true or false`
    });
  }
}

function requireDocumentsVerified(errors, workflow) {
  if (workflow.documentsVerified !== true) {
    errors.push({
      code: "documents-not-verified",
      field: "documentsVerified",
      message: "documents must be verified before clearance, release, or close"
    });
  }
}

function requireDeclarationAccepted(errors, workflow) {
  if (workflow.declarationStatus !== "accepted" && workflow.declarationStatus !== "not_required") {
    errors.push({
      code: "declaration-not-accepted",
      field: "declarationStatus",
      message: "declaration must be accepted or not required"
    });
  }
}

function requireOutsourcedCarrierReady(errors, workflow) {
  if (workflow.transportMode === "outsourced" && workflow.carrierConfirmed !== true) {
    errors.push({
      code: "carrier-not-confirmed",
      field: "carrierConfirmed",
      message: "outsourced transport requires carrier confirmation"
    });
  }
}

function requireInvoiceIssuedOrPaid(errors, workflow) {
  if (workflow.invoiceStatus !== "issued" && workflow.invoiceStatus !== "paid") {
    errors.push({
      code: "invoice-not-issued",
      field: "invoiceStatus",
      message: "job closure requires an issued or paid invoice"
    });
  }
}
