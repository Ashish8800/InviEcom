import RestApiClient from "src/utils/RestApiClient";

import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";
const api = new RestApiClient();

class Item extends BaseController {
  _list = apiUrls.inventory.item.index;
  _get = apiUrls.inventory.item.get;
  _post = apiUrls.inventory.item.create;
  _put = apiUrls.inventory.item.update;
  _delete = apiUrls.inventory.item.delete;
}

export default new Item();
