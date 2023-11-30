import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";

class Vendor extends BaseController {

  _list = apiUrls.purchase.vendor.index;
  _get = apiUrls.purchase.vendor.get;
  _post = apiUrls.purchase.vendor.create;
  _put = apiUrls.purchase.vendor.update;
  _delete = apiUrls.purchase.vendor.delete;
}


export default new Vendor();
