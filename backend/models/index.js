const WarehouseModel = require("./inventory/Warehouse.model");
const StockModel = require("./inventory/Stock.model");
const CategoryModel = require("./inventory/Category.model");
const SubCategoryModel = require("./inventory/SubCategory.model");
const ManufeatureModel = require("./inventory/Manufacture.model");
const ItemModel = require("./inventory/Item.model");

// settings

const CurrencyModel = require("./settings/Currency.model");
const PolicyModel = require("./settings/Policy.model");
const TermsAndConditionModel = require("./settings/Terms&Condition.model");
const EmailModel = require("./settings/Email.model");
const TaxModel = require("./settings/Tax.model");
const GstModel = require("./settings/Tax.model");

// purchase models
const VendorModel = require("./purchase/Vendor.model");
const ClientModel = require("./purchase/Client.model");
const ProjectModel = require("./purchase/Project.model");
const RequestModel = require("./purchase/Request.model");
const PurchaseOrderModel = require("./purchase/Order.model");
const InvoiceModel = require("./purchase/Invoice.model");
const ReceiveModel = require("./purchase/Receive.model");
const RFQModel = require("./purchase/RFQ.model");
const PurchaseQuotation = require("./purchase/Quotation.model");

// User Management
const RoleModel = require("./userManagement/Role.model");
const UserModel = require("./userManagement/User.model");

// website contact
const ContactModel = require("./website/Contact.model");
const CustomerModel = require("./website/Customer/Customer.model");
const OrderModel = require("./website/Customer/Order.model");
const CartModel = require("./website/Customer/Cart.model");

module.exports = {
  WarehouseModel,
  StockModel,
  CategoryModel,
  SubCategoryModel,
  ManufeatureModel,
  ItemModel,
  TaxModel,
  RoleModel,
  UserModel,
  GstModel,
  VendorModel,
  ClientModel,
  ProjectModel,
  RequestModel,
  PurchaseOrderModel,

  PolicyModel,
  CustomerModel,
  InvoiceModel,
  CartModel,
  OrderModel,

  CurrencyModel,
  EmailModel,
  TermsAndConditionModel,
  ContactModel,
  ReceiveModel,
  RFQModel,
  PurchaseQuotation,
};
