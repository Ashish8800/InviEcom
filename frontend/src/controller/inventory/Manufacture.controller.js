import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";

class Manufacture extends BaseController {
  _list = apiUrls.inventory.manufacture.index;
  _get = apiUrls.inventory.manufacture.get;
  _post = apiUrls.inventory.manufacture.create;
  _put = apiUrls.inventory.manufacture.update;
  _delete = apiUrls.inventory.manufacture.delete;
}

export default new Manufacture();
