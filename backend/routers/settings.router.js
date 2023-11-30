const express = require("express");
const router = express.Router();

const CurrencyController = require("../controllers/settings/Currency.controller");
const PolicyController = require("../controllers/settings/Policy.controller");
// const TermsAndConditionController = require("../controllers/settings/TermsAndCondition.Controller");
const EmailController = require("../controllers/settings/Email.controller");
const TaxController = require("../controllers/settings/Tax.controller");
const TermsAndConditionController = require("../controllers/settings/TermsAndCondition.controller");

router.get("/gst", TaxController.list);
router.put("/gst", TaxController.update);
router.post("/gst/tax", TaxController.addTax);
router.put("/gst/tax/:id", TaxController.updateTax);
router.delete("/gst/tax/:id", TaxController.delete);

router.get("/currency", CurrencyController.list);
router.get("/currency/:id", CurrencyController.get);
router.post("/currency", CurrencyController.create);
router.put("/currency/:id", CurrencyController.update);
router.delete("/currency/:id", CurrencyController.delete);

router.get("/email", EmailController.list);
router.get("/email/:id", EmailController.get);
router.post("/email", EmailController.create);
router.put("/email/:id", EmailController.update);
router.delete("/email/:id", EmailController.delete);

router.get("/policy", PolicyController.list);
router.get("/policy/:id", PolicyController.get);
router.post("/policy", PolicyController.create);
router.put("/policy/:id", PolicyController.update);
router.delete("/policy/:id", PolicyController.delete);

router.get("/terms-and-condition", TermsAndConditionController.list);
router.get("/terms-and-condition/:id", TermsAndConditionController.get);
router.post("/terms-and-condition", TermsAndConditionController.create);
router.put("/terms-and-condition/:id", TermsAndConditionController.update);
router.delete("/terms-and-condition/:id", TermsAndConditionController.delete);

module.exports = router;
