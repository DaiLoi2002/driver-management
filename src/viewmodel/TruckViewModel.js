// TruckViewModel.js
import BaseApi from "/Users/ttcenter/Manager_LT_Driver/driver-management/src/base/BaseApi.js";

class TruckViewModel {
  constructor() {
    this.trucks = [];
  }

  // // Thêm xe tải
  async addTruck(truckData) {
    try {
      const newTruck = await BaseApi.post("/admin/addTruck", truckData);
      this.trucks.push(newTruck);
      return newTruck; // Trả về xe tải đã thêm
    } catch (error) {
      console.error("Error adding truck:", error);
      throw error; // Ném lỗi lên để xử lý trong component
    }
  }

  // Lấy danh sách xe tải
  async getTrucks() {
    try {
      this.trucks = await BaseApi.post("/admin/getAllTrucks");
      console.log(this.trucks);

      return this.trucks;
    } catch (error) {
      console.error("Error fetching trucks:", error);
      throw error; // Ném lỗi lên để xử lý trong component
    }
  }

  // // Xóa xe tải
  async removeTruck(id) {
    try {
      // Gọi API POST để xóa xe tải
      const response = await BaseApi.post("/admin/deleteTruck", { id });

      // Kiểm tra mã trạng thái để xác nhận xóa thành công
      if (response.statusCode === 200) {
        this.trucks = this.trucks.filter((truck) => truck.id !== id);
        return { statusCode: 200, message: "Xóa xe tải thành công." }; // Trả về thông báo thành công
      } else {
        // Xử lý trường hợp không phải là trạng thái thành công
        throw new Error(response.message || "Không có thông điệp lỗi");
      }
    } catch (error) {
      // Kiểm tra lỗi từ server hoặc kết nối mạng
      if (error.response) {
        switch (error.response.status) {
          case 404:
            throw new Error("Xe tải không tồn tại.");
          case 500:
            throw new Error("Lỗi server. Vui lòng thử lại sau.");
          default:
            throw new Error(
              error.response.message || "Đã xảy ra lỗi không xác định."
            );
        }
      } else if (error.request) {
        throw new Error(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
        );
      } else {
        // Xử lý lỗi khác nếu có
        throw new Error("Đã xảy ra lỗi: " + error.message);
      }
    }
  }

  //Cập nhật thông tin xe tải
  async updateTruck(truck) {
    console.log(truck);

    try {
      const response = await BaseApi.post("/admin/updateTruck", truck);
      return response.data; // Trả về dữ liệu từ server
    } catch (error) {
      console.error("Error updating truck:", error);
      throw error; // Ném lỗi để xử lý ở nơi khác
    }
  }
}

export default TruckViewModel; // Xuất mặc định
