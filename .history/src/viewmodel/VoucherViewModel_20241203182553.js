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
        this.vouchers = response.data;
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
      console.log(newVoucher);
      // Kiểm tra xem newVoucher có hợp lệ không
      if (!newVoucher) {
        throw new Error("newVoucher là bắt buộc");
      }

      // Gửi yêu cầu API để thêm voucher
      const response = await BaseApi.post("admin/addVoucher", newVoucher);

      // Kiểm tra nếu yêu cầu thành công
      if (response.statusCode === 200) {
        // Sử dụng 201 cho yêu cầu tạo mới
        this.vouchers = response.data; // Cập nhật danh sách voucher
        console.log(response.data);
        return this.vouchers;
      } else {
        console.error("Lỗi khi thêm voucher:", response.data.message);
        return [];
      }
    } catch (error) {
      // Xử lý lỗi API hoặc lỗi trong quá trình gọi API
      console.error("Lỗi khi thêm voucher:", error.message);
      return [];
    }
  }
  async UpdateVoucher(updatedVoucher) {
    try {
      // Gửi yêu cầu cập nhật voucher
      const response = await BaseApi.post(
        "admin/update-voucher",
        updatedVoucher
      );

      // Kiểm tra phản hồi từ API
      if (response && response.data) {
        console.log("Voucher updated successfully:", response.data);
        return response.data; // Trả về dữ liệu cập nhật (nếu cần)
      } else {
        throw new Error("No data returned from the server");
      }
    } catch (error) {
      // Xử lý lỗi khi gửi yêu cầu
      console.error("Error updating voucher:", error.message);
      throw new Error("Failed to update voucher"); // Ném lỗi nếu có vấn đề
    }
  }
  async ToggleVoucherActivation(voucherId) {
    try {
      // Gửi yêu cầu cập nhật voucher
      const response = await BaseApi.post("admin/update-voucher", voucherId);

      // Kiểm tra phản hồi từ API
      if (statusCode === 200 && response.data) {
        console.log("Voucher updated successfully:", response.data);
        return response.data; // Trả về dữ liệu cập nhật (nếu cần)
      } else {
        throw new Error("No data returned from the server");
      }
    } catch (error) {
      // Xử lý lỗi khi gửi yêu cầu
      console.error("Error updating voucher:", error.message);
      throw new Error("Failed to update voucher"); // Ném lỗi nếu có vấn đề
    }
  }

  async DeleteVoucher(voucherId) {
    try {
      // Gửi yêu cầu cập nhật voucher
      const response = await BaseApi.post("admin/delete-voucher", voucherId);

      // Kiểm tra phản hồi từ API
      if (response && response.data) {
        console.log("Voucher updated successfully:", response.data);
        return response.data; // Trả về dữ liệu cập nhật (nếu cần)
      } else {
        throw new Error("No data returned from the server");
      }
    } catch (error) {
      // Xử lý lỗi khi gửi yêu cầu
      console.error("Error updating voucher:", error.message);
      throw new Error("Failed to update voucher"); // Ném lỗi nếu có vấn đề
    }
  }
}

export default VoucherViewModel; // Xuất mặc định
