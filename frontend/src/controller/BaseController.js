import RestApiClient from "src/utils/RestApiClient";

const api = new RestApiClient();

class BaseController {
  _list = null;
  _get = null;
  _post = null;
  _put = null;
  _delete = null;

  getUrl(id) {
    return typeof this._get === "function" ? this._get(id) : this._get;
  }

  putUrl(id) {
    return typeof this._put === "function" ? this._put(id) : this._put;
  }

  deleteUrl(id) {
    return typeof this._delete === "function" ? this._delete(id) : this._delete;
  }

  async list(query = "") {
    return new Promise((resolve, reject) => {
      api
        .get(this._list + query)
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

  async get(id) {
    return new Promise((resolve, reject) => {
      api
        .get(this.getUrl(id))
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

  async create(data) {
    return new Promise((resolve, reject) => {
      api
        .post(this._post, data)
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

  async update(id, data) {
    return new Promise((resolve, reject) => {
      if (!id) reject({ message: "To update a record, Id is required" });
      api
        .put(this._put(id), data)
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

  async delete(id) {
    return new Promise((resolve, reject) => {
      if (!id) reject({ message: "To delete a record, Id is required" });
      api
        .delete(this._delete(id))
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

export default BaseController;
