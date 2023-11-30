import RestApiClient from "src/utils/RestApiClient";

import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";

const api = new RestApiClient();

class Quotation extends BaseController {
  _list = apiUrls.purchase.quotation.index;
  _get = apiUrls.purchase.quotation.get;
  _post = apiUrls.purchase.quotation.create;
  _put = apiUrls.purchase.quotation.update;
  _delete = apiUrls.purchase.quotation.delete;
}

export default new Quotation();
