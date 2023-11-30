import apiUrls from "src/routes/apiUrls";
import { Api } from "src/utils";

class CustomerOrder {
  static async list(q = "") {
    return new Promise((resolve, reject) => {
      Api.get(apiUrls.customer.order.index + q)
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

  static async get(id, q = "") {
    return new Promise((resolve, reject) => {
      Api.get(apiUrls.customer.order.get(id) + q)
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

  static async create(data) {
    return new Promise((resolve, reject) => {
      Api.post(apiUrls.customer.order.create, data)
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

  static async update(data) {
    return new Promise((resolve, reject) => {
      if (!data.id) reject({ message: "Update data should have id" });
      Api.put(apiUrls.customer.order.update(data.id), data)
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

  static async delete(id) {
    return new Promise((resolve, reject) => {
      if (!id) reject({ message: "To delete a profile id is required" });
      Api.delete(apiUrls.customer.order.delete(id))
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

export default CustomerOrder;
