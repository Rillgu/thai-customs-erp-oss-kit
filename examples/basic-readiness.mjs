import { readinessSummary, validateDocumentPackage, validateWorkflow } from "../src/index.mjs";

const workflow = {
  jobStatus: "released",
  declarationStatus: "accepted",
  transportMode: "outsourced",
  carrierConfirmed: true,
  invoiceStatus: "draft",
  documentsVerified: true
};

const documents = {
  requiredDocuments: ["commercial_invoice", "packing_list", "bill_of_lading"],
  verifiedDocuments: ["commercial_invoice", "packing_list", "bill_of_lading"]
};

console.log("workflow", validateWorkflow(workflow));
console.log("readiness", readinessSummary(workflow));
console.log("documents", validateDocumentPackage(documents));
