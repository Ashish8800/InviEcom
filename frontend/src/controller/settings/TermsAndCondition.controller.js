import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";


class TermsAndCondition extends BaseController {
  _list = apiUrls.settings.termsAndCondition.index;
  _get = apiUrls.settings.termsAndCondition.get;
  _post = apiUrls.settings.termsAndCondition.create;
  _put = apiUrls.settings.termsAndCondition.update;
  _delete = apiUrls.settings.termsAndCondition.delete;
}

export default  new TermsAndCondition();
