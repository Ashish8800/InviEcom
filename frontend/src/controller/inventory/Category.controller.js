import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";


class Category extends BaseController {
  _list = apiUrls.inventory.category.index;
  _get = apiUrls.inventory.category.get;
  _post = apiUrls.inventory.category.create;
  _put = apiUrls.inventory.category.update;
  _delete = apiUrls.inventory.category.delete;
}

export default new Category();
