// TruckViewModel.js
import BaseApi from "/Users/ttcenter/Manager_LT_Driver/driver-management/src/base/BaseApi.js";

class OrderViewModel {
  constructor() {
    this.orders = [];
  }

  async getOrder(statusOrder) {
    try {
      if (!statusOrder) {
        throw new Error("Status is required");
      }
      // Gửi yêu cầu API để lấy danh sách đơn hàng theo trạng thái
      const response = await BaseApi.post(`admin/getOrderByStatus`, {
        statusOrder,
      });

      // Kiểm tra nếu yêu cầu thành công
      if (response.statusCode === 200) {
        this.orders = response.data; // Cập nhật danh sách đơn hàng
        console.log(response.data);
        return this.orders;
      } else {
        console.error("Failed to fetch orders:", response.data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }
}

export default OrderViewModel; // Xuất mặc định
