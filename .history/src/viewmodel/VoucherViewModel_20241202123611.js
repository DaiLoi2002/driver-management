// TruckViewModel.js
import BaseApi from "/Users/ttcenter/Manager_LT_Driver/driver-management/src/base/BaseApi.js";

class VoucherViewModel {
  constructor() {
    this.vouchers = [];
  }

  async getVoucher(userGroup, isActive) {
    try {
      // Kiểm tra xem các tham số có hợp lệ không
      if (!userGroup || isActive === undefined) {
        throw new Error("userGroup và isActive là bắt buộc");
      }

      // Gửi yêu cầu API để lấy danh sách voucher
      const response = await BaseApi.post("admin/getVoucherByUserGroups", {
        userGroup,
        isActive,
      });

      // Kiểm tra nếu yêu cầu thành công
      if (response.statusCode === 200) {
        this.vouchers = response.data; // Cập nhật danh sách voucher
        console.log(response.data);
        return this.vouchers;
      } else {
        console.error("Lỗi khi lấy danh sách voucher:", response.data.message);
        return [];
      }
    } catch (error) {
      // Xử lý lỗi API hoặc lỗi trong quá trình gọi API
      console.error("Lỗi khi lấy danh sách voucher:", error.message);
      return [];
    }
  }
  async addVoucher(newVoucher) {
    try {
      // Kiểm tra xem các tham số có hợp lệ không
      if (!newVoucher === undefined) {
        throw new Error("newVoucher  là bắt buộc");
      }

      // Gửi yêu cầu API để lấy danh sách voucher
      const response = await BaseApi.post("admin/addVoucher", {
        userGroup,
        isActive,
      });

      // Kiểm tra nếu yêu cầu thành công
      if (response.statusCode === 200) {
        this.vouchers = response.data; // Cập nhật danh sách voucher
        console.log(response.data);
        return this.vouchers;
      } else {
        console.error("Lỗi khi lấy danh sách voucher:", response.data.message);
        return [];
      }
    } catch (error) {
      // Xử lý lỗi API hoặc lỗi trong quá trình gọi API
      console.error("Lỗi khi lấy danh sách voucher:", error.message);
      return [];
    }
  }
}

export default VoucherViewModel; // Xuất mặc định
