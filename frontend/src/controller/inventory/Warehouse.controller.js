import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";

class Warehouse extends BaseController {
  _list = apiUrls.inventory.warehouse.index;
  _get = apiUrls.inventory.warehouse.get;
  _post = apiUrls.inventory.warehouse.create;
  _put = apiUrls.inventory.warehouse.update;
  _delete = apiUrls.inventory.warehouse.delete;
}

export default new Warehouse();
