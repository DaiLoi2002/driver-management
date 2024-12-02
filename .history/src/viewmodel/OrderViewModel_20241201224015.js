// TruckViewModel.js
import BaseApi from "/Users/ttcenter/Manager_LT_Driver/driver-management/src/base/BaseApi.js";

class OrderViewModel {
  constructor() {
    this.orders = [];
  }

  async getOrder(status) {
    try {
      // Gửi yêu cầu API để lấy danh sách đơn hàng theo trạng thái
      const response = await BaseApi.post(`/orders`, { status });

      // Kiểm tra nếu yêu cầu thành công
      if (response.status === 200 && response.data.success) {
        this.orders = response.data.data; // Cập nhật danh sách đơn hàng
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
