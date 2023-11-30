import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";

class StockController extends BaseController {
  _list = apiUrls.inventory.stock.index;
  _get = apiUrls.inventory.stock.get;
  _post = apiUrls.inventory.stock.create;
  _put = apiUrls.inventory.stock.update;
  _delete = apiUrls.inventory.stock.delete;
}

const Stock = new StockController();
export default Stock;
