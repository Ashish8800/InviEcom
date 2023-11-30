import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";

class Email extends BaseController {
  _list = apiUrls.settings.email.index;
  _get = apiUrls.settings.email.get;
  _post = apiUrls.settings.email.create;
  _put = apiUrls.settings.email.update;
  _delete = apiUrls.settings.email.delete;
}

export default new Email();
