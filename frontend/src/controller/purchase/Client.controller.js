import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";

class Client extends BaseController {
  _list = apiUrls.purchase.client.index;
  _get = apiUrls.purchase.client.get;
  _post = apiUrls.purchase.client.create;
  _put = apiUrls.purchase.client.update;
  _delete = apiUrls.purchase.client.delete;
}

export default new Client();
