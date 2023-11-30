import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";

class Role extends BaseController {
  
  _list = apiUrls.userManagement.role.index;
  _get = apiUrls.userManagement.role.get;
  _post = apiUrls.userManagement.role.create;
  _put = apiUrls.userManagement.role.update;
  _delete = apiUrls.userManagement.role.delete;
}

export default new Role();
