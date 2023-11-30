import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";


class Policy extends BaseController {
  _list = apiUrls.settings.policy.index;
  _get = apiUrls.settings.policy.get;
  _post = apiUrls.settings.policy.create;
  _put = apiUrls.settings.policy.update;
  _delete = apiUrls.settings.policy.delete;
}

export default  new Policy();
