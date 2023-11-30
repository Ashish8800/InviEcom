import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";

class PurchaseOrder extends BaseController {
  _list = apiUrls.purchase.order.index;
  _get = apiUrls.purchase.order.get;
  _post = apiUrls.purchase.order.create;
  _put = apiUrls.purchase.order.update;
  _delete = apiUrls.purchase.order.delete;
}

export default new PurchaseOrder();
