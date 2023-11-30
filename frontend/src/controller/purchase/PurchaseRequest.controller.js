import BaseController from "src/controller/BaseController";
import apiUrls from "src/routes/apiUrls";
import RestApiClient from "src/utils/RestApiClient";

const api = new RestApiClient();

class PurchaseRequestController extends BaseController {
  _list = apiUrls.purchase.request.index;
  _get = apiUrls.purchase.request.get;
  _post = apiUrls.purchase.request.create;
  _put = apiUrls.purchase.request.update;
  _delete = apiUrls.purchase.request.delete;

  async changeStatus(data) {
    return new Promise((resolve, reject) => {
      console.log(this._get);
      if (!data.id) reject({ message: "PR Request should have id" });
      api
        .put(apiUrls.purchase.request.changeStatus(data.id, data.status), data)
        .then((res) => {
          if (res.result) {
            resolve("ok");
          } else {
            reject(res);
          }
        })
        .catch((err) => reject(err));
    });
  }

  async withdraw(id) {
    return new Promise((resolve, reject) => {
      if (!id) reject({ message: "To withdraw a record, Id is required" });
      api
        .delete(apiUrls.purchase.request.withdraw(id))
        .then((res) => {
          if (res.result) {
            resolve("ok");
          } else {
            reject(res);
          }
        })
        .catch((err) => reject(err));
    });
  }
}
const PurchaseRequest = new PurchaseRequestController();
export default PurchaseRequest;
