import { isAdminLoggedIn, isCustomerLoggedIn } from "src/auth/utils";

class RestApiClient {
  constructor(authToken = null) {
    if (!authToken) {
      if (
        isAdminLoggedIn() &&
        window.location.href.indexOf("/dashboard") !== -1
      ) {
        authToken = localStorage.getItem("adminAccessToken") ?? "";
      }

      if (
        isCustomerLoggedIn() &&
        window.location.href.indexOf("/dashboard") === -1
      ) {
        authToken = localStorage.getItem("cusAccessToken") ?? "";
      }
    }
    this.authToken = authToken;
  }

  async get(url) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });
    const data = await response.json();
    return data;
  }

  async post(url, data) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.authToken}`,
      },
      body: JSON.stringify(data ?? {}),
    });
    const responseData = await response.json();
    return responseData;
  }

  async put(url, data) {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.authToken}`,
      },
      body: JSON.stringify(data ?? {}),
    });
    const responseData = await response.json();
    return responseData;
  }

  async delete(url) {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });
    const data = await response.json();
    return data;
  }

  postSync(url, data) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${this.authToken}`);

    xhr.send(JSON.stringify(data || {}));

    if (xhr.status === 200) {
      return JSON.parse(xhr.responseText);
    } else {
      console.log(`HTTP ${xhr.status} ${xhr.statusText}`);
      return false;
    }
  }

  getSync(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();

    if (xhr.status === 200) {
      return JSON.parse(xhr.responseText);
    } else {
      console.log(`HTTP ${xhr.status} ${xhr.statusText}`);
      return false;
    }
  }
}

export default RestApiClient;
