// TruckViewModel.js
import BaseApi from "/Users/ttcenter/Manager_LT_Driver/driver-management/src/base/BaseApi.js";

class VoucherViewModel {
  constructor() {
    this.vouchers = [];
  }

  async getVoucher(userGroup, isActive) {
    try {
      if (!statusOrder) {
        throw new Error("Status is required");
      }
      // Gửi yêu cầu API để lấy danh sách đơn hàng theo trạng thái
      const response = await BaseApi.post(`admin/getVoucherByUserGroups`, {
        userGroup,
        isActive,
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

export default VoucherViewModel; // Xuất mặc định
