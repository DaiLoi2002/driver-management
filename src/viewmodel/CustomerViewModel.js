// CustomerViewModel.js

import BaseApi_form_data from "../base/BaseApi_form_data";
import baseApi from "/Users/ttcenter/Manager_LT_Driver/driver-management/src/base/BaseApi.js"; // Import baseApi

class CustomerViewModel {
  constructor() {
    this.customers = [];
  }

  // Lấy danh sách khách hàng
  async getCustomers(page, limit) {
    try {
      const type = "customer";

      // Gọi API với token trong header
      const response = await baseApi.post("admin/get-all-user", {
        page,
        limit,
        type,
      });

      // Lưu dữ liệu vào biến customers
      if (response.statusCode === 200 && response.message === "Ok") {
        this.customers = response;
        console.log("Customers:", this.customers);
        return this.customers; // Trả về danh sách khách hàng
      } else {
        console.error("Phản hồi không chứa dữ liệu:", response);
        throw new Error("Phản hồi không hợp lệ");
      }
    } catch (error) {
      console.error("Error fetching customers:", error.message);
      throw error; // Ném lỗi ra ngoài để xử lý trong component
    }
  }

  // Thêm khách hàng mới
  async addCustomers(formData) {
    try {
      const type = "customer";
      // Gọi API để thêm khách hàng mới
      const response = await baseApi.post("admin/add-user", formData);

      // Kiểm tra phản hồi từ API
      if (response.statusCode === 200 && response.data) {
        // Log dữ liệu trả về từ API
        console.log("Customer added successfully:", response.data);

        // Cập nhật danh sách khách hàng nếu cần thiết
        this.customers.push(response.data);

        return response.data; // Trả về khách hàng mới thêm vào
      } else {
        console.error("Error adding customer:", response.data);
        throw new Error("Failed to add customer");
      }
    } catch (error) {
      // Kiểm tra nếu mã lỗi là 500
      if (error.statusCode === 500) {
        // Lỗi từ backend về email đã tồn tại
        throw new Error("Email đã được đăng kí");
      }
      console.error("Error adding customer:", error);
      throw error; // Ném lỗi ra ngoài để xử lý trong component
    }
  }

  async deleteCustomers(customerId) {
    try {
      const type = "customer";
      // Gọi API để xóa khách hàng, gửi customerId trong body của yêu cầu POST
      const response = await baseApi.post("/admin/delete-user", {
        customerId,
        type,
      });

      // Kiểm tra phản hồi từ API
      if (response.statusCode === 200 && response.data) {
        console.log("Customer deleted successfully:", response.data);
        return response.data;
      } else {
        console.error("Error deleting customer:", response.data);
        throw new Error(response.data?.message || "Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi xóa khách hàng";
      throw new Error(errorMessage); // Ném lỗi ra ngoài để component có thể hiển thị thông báo
    }
  }
  async updateCustomer(editUser) {
    try {
      console.log("Thông tin khách hàng cần cập nhật:", editUser);

      // Tạo đối tượng customerData, đổi _id thành customerId
      const customerData = {
        ...editUser,
        userId: editUser._id, // Đổi _id thành customerId
        type: editUser.type || "customer", // Thêm trường type vào customerData
      };
      delete customerData._id; // Xóa trường _id khỏi đối tượng trước khi gửi đi

      console.log("customerData", customerData);

      // Gọi API để cập nhật thông tin khách hàng, gửi customerData trong body của yêu cầu PUT
      const response = await baseApi.post("/admin/update-user", customerData);

      // Kiểm tra phản hồi từ API
      if (response.status === 200) {
        console.log("Customer updated successfully:", response.data);

        return response.data; // Trả về dữ liệu từ API để dùng trong component nếu cần
      } else {
        console.error("Error updating customer:", response.data);
        throw new Error(response.data?.message || "Failed to update customer");
      }
    } catch (error) {
      console.error("Error updating customer:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật khách hàng";
      throw new Error(errorMessage); // Ném lỗi ra ngoài để component có thể hiển thị thông báo
    }
  }
  // Phương thức cập nhật thông tin khách hàng

  async updateImage(formData) {
    try {
      // Log từng phần tử trong formData
      console.log("FormData Content:");
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      const response = await BaseApi_form_data.post(
        "/customers/upload-image",
        formData
      );

      if (response.status === 200) {
        // Kiểm tra nếu phản hồi có message và status là thành công
        const { message, filename, path, customer } = response;

        if (message === "Image uploaded and link saved successfully") {
          console.log("Image updated successfully:", response);

          // Trả về các thông tin bạn cần từ phản hồi
          return {
            filename,
            path,
            customer,
          };
        } else {
          throw new Error(message || "Failed to update image");
        }
      } else {
        throw new Error("Failed to update image");
      }
    } catch (error) {
      console.error("Error updating image:", error);

      // Log thêm thông tin lỗi nếu cần
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        console.error("Request data:", error.request);
      }

      throw error;
    }
  }

  // Ví dụ trong một ViewModel hoặc Service
  async searchCustomersByPhoneString(phoneNumbers) {
    try {
      console.log("phoneNumbers", phoneNumbers);

      // Kiểm tra nếu phoneNumbers là hợp lệ
      if (
        !phoneNumbers ||
        typeof phoneNumbers !== "string" ||
        phoneNumbers.trim() === ""
      ) {
        throw new Error("Chuỗi số điện thoại là bắt buộc");
      }

      // Gọi API với baseApi (đã cấu hình sẵn)
      const response = await baseApi.post(
        "/customers/search-customers-by-phone",
        { phoneNumbers }
      );
      console.log("response:", response.data);

      // Kiểm tra kết quả trả về
      if (response.data && response.data.length > 0) {
        return response.data; // Trả về danh sách khách hàng tìm được
      } else {
        throw new Error(response.message || "Không tìm thấy khách hàng");
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Lỗi khi tìm kiếm khách hàng:", error.message);
      // Ném lại lỗi đã xử lý để có thể được bắt ở nơi gọi hàm
      throw new Error(error.message || "Đã xảy ra lỗi khi tìm kiếm khách hàng");
    }
  }

  async loginAdmin(phoneNumber, password) {
    try {
      const response = await baseApi.post("/admin/login-admin", {
        phoneNumber,
        password: password,
      }); // Gọi API login với base URL đã cấu hình

      if (response.statusCode === 200) {
        console.log("Customer updated successfully:", response);

        return response; // Trả về dữ liệu từ API để dùng trong component nếu cần
      } else {
        console.error("Error updating customer:", response);
        throw new Error(response.data?.message || "Failed to update customer");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      throw error; // Ném lỗi nếu có
    }
  }
}

export default CustomerViewModel;
