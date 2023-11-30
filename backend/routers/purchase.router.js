const express = require("express");
const router = express.Router();
const VendorController = require("../controllers/purchase/Vendor.controller");
const ClientController = require("../controllers/purchase/Client.controller");
const ProjectController = require("../controllers/purchase/Project.controller");
const RequestController = require("../controllers/purchase/Request.controller");
const OrderController = require("../controllers/purchase/Order.controller");
const InvoiceController = require("../controllers/purchase/Invoice.controller");
const ReceiveController = require("../controllers/purchase/Receive.controller");
const RFQController = require("../controllers/purchase/RFQ.controller");
const QuotationController = require("../controllers/purchase/Quotation.controller");

router.get("/vendor", VendorController.list);
router.get("/vendor/:id", VendorController.get);
router.post("/vendor", VendorController.create);
router.put("/vendor/:id", VendorController.update);
router.delete("/vendor/:id", VendorController.delete);

router.get("/client", ClientController.list);
router.get("/client/:id", ClientController.get);
router.post("/client", ClientController.create);
router.put("/client/:id", ClientController.update);
router.delete("/client/:id", ClientController.delete);

router.get("/project", ProjectController.list);
router.get("/project/:id", ProjectController.get);
router.post("/project", ProjectController.create);
router.put("/project/:id", ProjectController.update);
router.delete("/project/:id", ProjectController.delete);

router.get("/request", RequestController.list);
router.get("/request/:id", RequestController.get);
router.post("/request", RequestController.create);  
router.put("/request/:id", RequestController.update);
router.put("/request/:id/:status", RequestController.changeStatus);
router.delete("/request/:id/withdraw", RequestController.withdraw);
router.delete("/request/:id", RequestController.delete);

router.get("/order", OrderController.list);
router.get("/order/:id", OrderController.get);
router.post("/order", OrderController.create);
router.put("/order/:id", OrderController.update);
router.delete("/order/:id", OrderController.delete);

router.get("/invoice", InvoiceController.list);
router.get("/invoice/:id", InvoiceController.get);
router.post("/invoice", InvoiceController.create);
router.put("/invoice/:id", InvoiceController.update);
router.delete("/invoice/:id", InvoiceController.delete);

router.get("/receive", ReceiveController.list);
router.get("/receive/:id", ReceiveController.get);
router.post("/receive", ReceiveController.create);
router.put("/receive/:id", ReceiveController.update);
router.delete("/receive/:id", ReceiveController.delete);


router.get("/rfq", RFQController.list);
router.get("/rfq/:id", RFQController.get);
router.post("/rfq", RFQController.create);
router.put("/rfq/:id", RFQController.update);
router.put("/rfq/:id/status", RFQController.updateStatus);
router.post("/rfq/:id/send-mail", RFQController.sendMailToVender);


router.get("/quotation", QuotationController.list);
router.get("/quotation/:id", QuotationController.get);
router.post("/quotation", QuotationController.create);
router.put("/quotation/:id", QuotationController.update);

module.exports = router;
