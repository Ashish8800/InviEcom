import RestApiClient from "src/utils/RestApiClient";

import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";
const api = new RestApiClient();

class SubCategory extends BaseController{
  _list = apiUrls.inventory.subcategory.index;
  _get = apiUrls.inventory.subcategory.get;
  _post = apiUrls.inventory.subcategory.create;
  _put = apiUrls.inventory.subcategory.update;
  _delete = apiUrls.inventory.subcategory.delete;
}

export default  new SubCategory();
