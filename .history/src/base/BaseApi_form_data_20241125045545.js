import axios from "axios";

class BaseApiFormData {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL: baseURL || "http://tandat.io.vn/api/v1", // URL API của bạn
    });
  }

  async get(endpoint) {
    try {
      const response = await this.api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("API GET error:", error);
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      // Kiểm tra nếu data là FormData
      const isFormData = data instanceof FormData;

      const response = await this.api.post(endpoint, data, {
        headers: {
          "Content-Type": isFormData
            ? "multipart/form-data"
            : "application/json",
        },
      });
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
      // Kiểm tra nếu data là FormData
      const isFormData = data instanceof FormData;

      const response = await this.api.put(endpoint, data, {
        headers: {
          "Content-Type": isFormData
            ? "multipart/form-data"
            : "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API PUT error:", error.message);
      throw error;
    }
  }

  async delete(endpoint) {
    try {
      const response = await this.api.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error("API DELETE error:", error.message);
      throw error;
    }
  }
}

export default new BaseApiFormData();
