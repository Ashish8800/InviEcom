import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";

class PurchaseReceive extends BaseController {
  _list = apiUrls.purchase.receive.index;
  _get = apiUrls.purchase.receive.get;
  _post = apiUrls.purchase.receive.create;
  _put = apiUrls.purchase.receive.update;
  _delete = apiUrls.purchase.receive.delete;
}

export default new PurchaseReceive();
