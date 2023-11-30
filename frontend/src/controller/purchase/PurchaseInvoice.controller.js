import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";

class PurchaseInvoice extends BaseController {
  _list = apiUrls.purchase.invoice.index;
  _get = apiUrls.purchase.invoice.get;
  _post = apiUrls.purchase.invoice.create;
  _put = apiUrls.purchase.invoice.update;
  _delete = apiUrls.purchase.invoice.delete;
}

export default new PurchaseInvoice();
