const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/inventory/Category.controller");
const SubCategoryController = require("../controllers/inventory/SubCategory.controller");
const ManufeatureController = require("../controllers/inventory/Manufacture.controller");
const ItemController = require("../controllers/inventory/Item.controller");
const WarehouseController = require("../controllers/inventory/Warehouse.controller");
const StockController = require("../controllers/inventory/Stock.controller");

// Items Route
router.get("/item", ItemController.list);
router.get("/item/:id", ItemController.get);
router.post("/item", ItemController.create);
router.put("/item/:id", ItemController.update);
router.delete("/item/:id", ItemController.delete);

// Category
router.get("/category", CategoryController.list);
router.get("/category/:id", CategoryController.get);
router.post("/category", CategoryController.create);
router.put("/category/:id", CategoryController.update);
router.delete("/category/:id", CategoryController.delete);

// Subcategory
router.get("/subcategory", SubCategoryController.list);
router.get("/subcategory/:id", SubCategoryController.get);
router.post("/subcategory", SubCategoryController.create);
router.put("/subcategory/:id", SubCategoryController.update);
router.delete("/subcategory/:id", SubCategoryController.delete);

// Manufacture
router
  .route("/manufacture")
  .get(ManufeatureController.list)
  .post(ManufeatureController.create);

router
  .route("/manufacture/:id")
  .get(ManufeatureController.get)
  .put(ManufeatureController.update)
  .delete(ManufeatureController.delete);


  
// warehouse routes
router.get("/warehouse", WarehouseController.index);
router.get("/warehouse/:id", WarehouseController.get);
router.post("/warehouse", WarehouseController.create);
router.put("/warehouse/:id", WarehouseController.update);
router.delete("/warehouse/:id", WarehouseController.delete);

//  stock routes
router.route("/stock").get(StockController.list).post(StockController.create);
router
  .route("/stock/:id")
  .get(StockController.get)
  .put(StockController.update)
  .delete(StockController.delete);

module.exports = router;
