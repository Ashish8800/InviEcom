import RestApiClient from "src/utils/RestApiClient";
import apiUrls from "src/routes/apiUrls";
import BaseController from "../BaseController";

const api = new RestApiClient();

class User extends BaseController {
  _list = apiUrls.userManagement.user.index;
  _get = apiUrls.userManagement.user.get;
  _post = apiUrls.userManagement.user.create;
  _put = apiUrls.userManagement.user.update;
  _delete = apiUrls.userManagement.user.delete;

  static async updatePassword(data) {
    return new Promise((resolve, reject) => {
      if (!data.id) reject({ message: "Update data should have id" });
      api
        .put(apiUrls.userManagement.user.updatePassword(data.id), data)
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

export default new User();
