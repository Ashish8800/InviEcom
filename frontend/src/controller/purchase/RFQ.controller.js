import apiUrls from "src/routes/apiUrls";
import RestApiClient from "src/utils/RestApiClient";
import BaseController from "../BaseController";

const api = new RestApiClient();

class RFQ extends BaseController {
  _list = apiUrls.purchase.rfq.index;
  _get = apiUrls.purchase.rfq.get;
  _post = apiUrls.purchase.rfq.create;
  _put = apiUrls.purchase.rfq.update;
  _delete = apiUrls.purchase.rfq.delete;

  async sendMail(data) {
    return new Promise((resolve, reject) => {
      api
        .post(apiUrls.purchase.rfq.sendMail(data.id), data)
        .then((res) => {
          if (res.result) {
            resolve(res.data);
          } else {
            reject(res);
          }
        })
        .catch((err) => reject(err));
    });
  }
}

export default new RFQ();
