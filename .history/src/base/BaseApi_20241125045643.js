// BaseApi.js
import axios from "axios";

class BaseApi {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL: baseURL || "http://tandat.io.vn/api/v1/", // Đổi URL thành API của bạn
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Tạo headers tự động với token nếu có
  createHeaders() {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    const headers = {
      "Content-Type": "application/json", // Content-Type mặc định
    };

    // Nếu có token, thêm Authorization vào header
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  async get(endpoint) {
    try {
      const headers = this.createHeaders(); // Tạo headers tự động với token
      const response = await this.api.get(endpoint, { headers });
      return response.data;
    } catch (error) {
      console.error("API GET error:", error);
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      const headers = this.createHeaders(); // Tạo headers tự động với token
      const response = await this.api.post(endpoint, data, { headers });
      return response.data;
    } catch (error) {
      console.error("API POST error:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        console.error("Request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      throw error;
    }
  }

  async put(endpoint, data) {
    try {
      const headers = this.createHeaders(); // Tạo headers tự động với token
      const response = await this.api.put(endpoint, data, { headers });
      return response.data;
    } catch (error) {
      console.error("API PUT error:", error);
      throw error;
    }
  }

  async delete(endpoint) {
    try {
      const headers = this.createHeaders(); // Tạo headers tự động với token
      const response = await this.api.delete(endpoint, { headers });
      return response.data;
    } catch (error) {
      console.error("API DELETE error:", error);
      throw error;
    }
  }
}

export default new BaseApi();
