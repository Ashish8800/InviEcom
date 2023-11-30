import RestApiClient from "src/utils/RestApiClient";
import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";

const api = new RestApiClient();

class Tax extends BaseController {
  _list = apiUrls.settings.tax.index;
  _get = apiUrls.settings.tax.get;
  _post = apiUrls.settings.tax.create;
  _put = apiUrls.settings.tax.update;
  _delete = apiUrls.settings.tax.delete;

  static async updateTax(data) {
    return new Promise((resolve, reject) => {
      if (!data.id) reject({ message: "Update data should have id" });
      api
        .put(apiUrls.settings.tax.updateTax(data.id), data)
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

export default new Tax();
