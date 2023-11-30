import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";

class Currency extends BaseController {
  _list = apiUrls.settings.currency.index;
  _get = apiUrls.settings.currency.get;
  _post = apiUrls.settings.currency.create;
  _put = apiUrls.settings.currency.update;
  _delete = apiUrls.settings.currency.delete;
}

export default new Currency();
