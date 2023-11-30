import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";

class Project extends BaseController {
  _list = apiUrls.purchase.project.index;
  _get = apiUrls.purchase.project.get;
  _post = apiUrls.purchase.project.create;
  _put = apiUrls.purchase.project.update;
  _delete = apiUrls.purchase.project.delete;
}

export default  new Project();
