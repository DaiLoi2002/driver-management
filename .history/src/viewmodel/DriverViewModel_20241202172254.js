// DriverViewModel.js

import BaseApi from "../base/BaseApi";
import BaseApi_form_data from "../base/BaseApi_form_data";
// DriverViewModel.js
class DriverViewModel {
  constructor() {
    this.drivers = [];
  }

  async addDriver(driverData) {
    try {
      console.log("driverData", driverData);

      if (!driverData.password) {
        console.error("Password is missing");
      } else {
        console.log("Password is:", driverData.password);
      }

      // Đảm bảo driverData có trường type
      const newDriver = await BaseApi.post("admin/add-user", {
        ...driverData,
        type: driverData.type || "driver", // Gán giá trị mặc định nếu type không được truyền
      });
      this.drivers.push(newDriver);
      return newDriver; // Trả về dữ liệu tài xế đã thêm
    } catch (error) {
      console.error("Error adding driver:", error);
      throw error; // Ném lỗi lên để xử lý trong component
    }
  }
  async getAllTruck() {
    try {
      if (!driverData.password) {
        console.error("Password is missing");
      } else {
        console.log("Password is:", driverData.password);
      }

      // Đảm bảo driverData có trường type
      const newDriver = await BaseApi.post("admin/getAllTrucks");

      return newDriver; // Trả về dữ liệu tài xế đã thêm
    } catch (error) {
      console.error("Error adding driver:", error);
      throw error; // Ném lỗi lên để xử lý trong component
    }
  }

  async getDrivers() {
    try {
      const page = 1;
      const limit = 10;
      const type = "driver";
      this.drivers = await BaseApi.post("/admin/get-all-user", {
        page,
        limit,
        type,
      });
      return this.drivers;
    } catch (error) {
      console.error("Error fetching drivers:", error);
      throw error; // Ném lỗi lên để xử lý trong component
    }
  }

  async removeDriver(id) {
    console.log(id);
    // Thông tin cần thiết để xóa tài xế
    const payload = {
      type: "driver",
      customerId: id, // ID của tài xế cần xóa
    };
    try {
      // Gọi API để xóa tài xế
      const response = await BaseApi.post(`/admin/delete-user`, payload);

      // Kiểm tra mã trạng thái để xác nhận xóa thành công
      if (response.statusCode === 200) {
        // Cập nhật danh sách tài xế trong trạng thái
        this.drivers = this.drivers.filter((driver) => driver.id !== id);
        return { statusCode: 200, message: "Xóa tài xế thành công." }; // Trả về thông báo thành công
      } else {
        // Ném lỗi nếu mã trạng thái không phải 200
        throw new Error(response.message || "Không có thông điệp lỗi");
      }
    } catch (error) {
      // Kiểm tra loại lỗi và ném ra thông điệp cụ thể
      if (error.response) {
        // Nếu có phản hồi từ server
        if (error.response.status === 404) {
          throw new Error("Tài xế không tồn tại."); // Lỗi không tìm thấy
        } else if (error.response.status === 500) {
          throw new Error("Lỗi server. Vui lòng thử lại sau."); // Lỗi server
        } else {
          throw new Error("Đã xảy ra lỗi không xác định."); // Lỗi không xác định
        }
      } else if (error.request) {
        // Nếu không có phản hồi từ server
        throw new Error(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
        ); // Lỗi kết nối
      } else {
        // Nếu có lỗi khác
        throw new Error("Đã xảy ra lỗi: " + error.message); // Lỗi khác
      }
    }
  }
  // Hàm sửa tài xế
  async updateDriver(driver) {
    try {
      console.log(driver);
      // Kiểm tra xem driver có tất cả các thông tin cần thiết không
      if (
        !driver.id ||
        !driver.fullName ||
        !driver.licenseNumber ||
        !driver.phoneNumber
      ) {
        throw new Error("Thiếu thông tin cần thiết để cập nhật tài xế.");
      }

      const type = "driver";

      // Gửi dữ liệu tài xế dưới dạng body của yêu cầu POST
      const response = await BaseApi.post("admin/update-user", {
        userId: driver.id,
        fullName: driver.fullName,
        licenseNumber: driver.licenseNumber,
        type,
        licenseExpiryDate: driver.licenseExpiryDate,
        phoneNumber: driver.phoneNumber,
        email: driver.email,
        address: driver.address,
        vehicle: {
          payloadCapacity: driver.vehicle.payloadCapacity,
          inspectionExpiryDate: driver.vehicle.inspectionExpiryDate,
        },
        image: driver.image,
        location: {
          type: driver.location.type,
          coordinates: driver.location.coordinates,
        },
        token: driver.token,
      });

      return response;
    } catch (error) {
      console.error("Error updating driver:", error);
      throw error; // Lỗi sẽ được ném lại cho nơi gọi hàm xử lý
    }
  }
  async updateImage(formData) {
    try {
      // Log từng phần tử trong formData
      console.log("FormData Content:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

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

  async getAllOnlineDriversLocation() {
    try {
      const response = await BaseApi.post("admin/getAllOnlineDriversLocation"); // Đảm bảo endpoint đúng
      // Kiểm tra mã trạng thái và trả về dữ liệu
      if (response.statusCode === 200) {
        console.log("Driver locations data:", response.data); // Log dữ liệu trước khi trả về
        return response.data; // Trả về danh sách vị trí tài xế
      } else {
        throw new Error("Không thể lấy dữ liệu tài xế.");
      }
    } catch (error) {
      console.error("Error fetching online drivers locations:", error);
      throw error; // Ném lỗi để xử lý ở nơi khác
    }
  }
}

export default DriverViewModel; // Xuất mặc định
