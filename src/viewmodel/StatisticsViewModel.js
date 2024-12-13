import BaseApi from "/Users/ttcenter/Manager_LT_Driver/driver-management/src/base/BaseApi.js";

class StatisticsViewModel {
  constructor() {
    this.statistics = [];
  }

  async getWeekCost(week, year) {
    try {
      // Gửi yêu cầu tới API để lấy doanh thu của tuần, chuyển tuần và năm vào body thay vì param
      const response = await BaseApi.post("/admin/getWeekCost", {
        week,
        year,
      });
      console.log(response);

      // Kiểm tra nếu có dữ liệu phản hồi
      if (response.statusCode === 200 && response.data) {
        // Cập nhật statistics với dữ liệu mới
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching weekly cost:", error);
      // Xử lý lỗi nếu cần
    }
  }
  async getMonthCost(month, year) {
    try {
      // Gửi yêu cầu tới API để lấy doanh thu của tuần, chuyển tuần và năm vào body thay vì param
      const response = await BaseApi.post("/admin/getMonthCost", {
        month,
        year,
      });
      console.log(response);

      // Kiểm tra nếu có dữ liệu phản hồi
      if (response.statusCode === 200 && response.data) {
        // Cập nhật statistics với dữ liệu mới
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching weekly cost:", error);
      // Xử lý lỗi nếu cần
    }
  }
  async getAllDriverRevenue() {
    try {
      // Gửi yêu cầu tới API để lấy doanh thu của tuần
      const response = await BaseApi.post("/admin/getAllDriverRevenue");

      // Kiểm tra phản hồi từ API
      console.log("API Response Data:", response.data);

      // Kiểm tra mã trạng thái là 200 và dữ liệu có tồn tại
      if (response.statusCode === 200 && response.data) {
        // Trả về dữ liệu nếu hợp lệ
        return response.data;
      } else {
        console.error(
          "Không có dữ liệu trả về hoặc mã trạng thái không phải 200:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching driver revenue:", error); // Xử lý lỗi
      // Nếu cần, có thể ném lại lỗi để xử lý ở nơi gọi
      throw error;
    }
  }
  async getAllDriverRevenueWeek(week, year) {
    try {
      // Gửi yêu cầu tới API để lấy doanh thu của tuần
      const response = await BaseApi.post("admin/getAllDriverRevenueWeek", {
        week,
        year,
      });

      // Kiểm tra phản hồi từ API
      console.log("API Response Data:", response.data);

      // Kiểm tra mã trạng thái là 200 và dữ liệu có tồn tại
      if (response.statusCode === 200 && response.data) {
        // Trả về dữ liệu nếu hợp lệ
        return response.data;
      } else {
        console.error(
          "Không có dữ liệu trả về hoặc mã trạng thái không phải 200:",
          response.status
        );
      }
      if (response.statusCode === 404) {
        return response.data;
      } else {
        console.error(
          "Không có dữ liệu trả về hoặc mã trạng thái không phải 200:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching driver revenue:", error); // Xử lý lỗi
      // Nếu cần, có thể ném lại lỗi để xử lý ở nơi gọi
      throw error;
    }
  }

  async getCompletionPercentage() {
    try {
      // Gửi yêu cầu tới API để lấy doanh thu của tuần, chuyển tuần và năm vào body thay vì param
      const response = await BaseApi.post(
        "/admin/calculateCompletionPercentage"
      );
      console.log(response);

      // Kiểm tra nếu có dữ liệu phản hồi
      if (response.statusCode === 200 && response.data) {
        // Cập nhật statistics với dữ liệu mới
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching weekly cost:", error);
      // Xử lý lỗi nếu cần
    }
  }
}
export default StatisticsViewModel; // Xuất mặc định
