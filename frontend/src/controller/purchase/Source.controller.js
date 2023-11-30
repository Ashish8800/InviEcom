import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";

class Source extends BaseController {
  _list = apiUrls.purchase.source.index;
  _get = apiUrls.purchase.source.get;
  _post = apiUrls.purchase.source.create;
  _put = apiUrls.purchase.source.update;
  _delete = apiUrls.purchase.source.delete;
}

export default new Source();
