// BaseApi.js
import axios from 'axios';

class BaseApi {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL: baseURL || 'http://localhost:5001/api', // Thay đổi URL này thành API của bạn
            headers: {
                 'Content-Type': 'application/json',
            },
        });
    }

    async get(endpoint) {
        try {
            const response = await this.api.get(endpoint);
            return response.data;
        } catch (error) {
            console.error('API GET error:', error);
            throw error;
        }
    }

    async post(endpoint, data) {
      try {
          const response = await this.api.post(endpoint, data);
          return response.data;
      } catch (error) {
          console.error('API POST error:', error.message);
          if (error.response) {
              console.error('Response data:', error.response.data);
              console.error('Response status:', error.response.status);
          } else if (error.request) {
              console.error('Request data:', error.request);
          } else {
              console.error('Error message:', error.message);
          }
          throw error;
      }
  }
  

    async put(endpoint, data) {
        try {
            const response = await this.api.put(endpoint, data);
            return response.data;
        } catch (error) {
            console.error('API PUT error:', error);
            throw error;
        }
    }

    async delete(endpoint) {
        try {
            const response = await this.api.delete(endpoint);
            return response.data;
        } catch (error) {
            console.error('API DELETE error:', error);
            throw error;
        }
    }
}

export default new BaseApi();

