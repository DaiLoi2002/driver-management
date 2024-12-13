import React, { useState, useEffect } from "react";
import { Tab, Form, Button, Tabs, Table } from "react-bootstrap";
import StatisticsViewModel from "../../viewmodel/StatisticsViewModel";
const DriverRevenueScreen = () => {
  const [activeTab, setActiveTab] = useState("revenue"); // Quản lý tab hiện tại
  const statisticsViewModel = new StatisticsViewModel();
  const [drivers, setDrivers] = useState([]);
  const [drivers1, setDrivers1] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2024"); // Lưu năm được chọn
  const [selectedWeek, setSelectedWeek] = useState(""); // Lưu tuần được chọn
  const [searchTerm, setSearchTerm] = useState("");
  const [revenueData, setRevenueData] = useState([]); // Lưu doanh thu tài xế theo tuần
  const [loading, setLoading] = useState(false); // Biến trạng thái tải dữ liệu
  const filteredDrivers = drivers.filter((driver) =>
    driver.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [weekRanges, setWeekRanges] = useState([]);
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };
  const renderRevenueTable = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="5">Đang tải dữ liệu...</td>
        </tr>
      );
    }

    if (revenueData.length === 0) {
      return (
        <tr>
          <td colSpan="5">Không có dữ liệu doanh thu.</td>
        </tr>
      );
    }

    return revenueData.map((driver, index) => (
      <tr key={index}>
        <td>{driver.driverName}</td>
        <td>{driver.totalRevenue.toLocaleString()}</td>
        <td>{driver.realRevenue.toLocaleString()}</td>
        <td>{driver.rank}</td>
        <td>{driver.percentage}%</td>
      </tr>
    ));
  };
  // Hàm xử lý thay đổi tuần
  const handleWeekChange = (e) => {
    setSelectedWeek(e.target.value);
  };
  const sortByRevenue = () => {
    const sortedDrivers = [...filteredDrivers].sort(
      (a, b) => b.revenue - a.revenue
    );
    setDrivers(sortedDrivers);
  };

  const totalRevenue = drivers.reduce(
    (acc, driver) => acc + driver.totalRevenue,
    0
  );
  const totalNetIncome = drivers.reduce(
    (acc, driver) => acc + driver.realRevenue,
    0
  );
  const fetchDriverRevenue = async () => {
    try {
      // Gọi API và lấy phản hồi
      const response = await statisticsViewModel.getAllDriverRevenue();
      console.log("Màn hình", response);

      setDrivers(response);
    } catch (error) {
      console.error("Error fetching driver revenue:", error); // Xử lý lỗi
    }
  };
  const fetchDriverRevenueWeek = async () => {
    try {
      console.log(selectedWeek, selectedYear);
      // Gọi API và lấy phản hồi
      const response = await statisticsViewModel.getAllDriverRevenueWeek(
        selectedWeek,
        selectedYear
      );
      console.log("Màn hình", response);

      setRevenueData(response);
    } catch (error) {
      console.error("Error fetching driver revenue:", error); // Xử lý lỗi
    }
  };
  // Hàm tính toán phạm vi ngày cho các tuần
  const calculateWeekRanges = () => {
    const startDate = new Date(new Date().getFullYear(), 0, 1); // Ngày đầu năm
    const ranges = Array.from({ length: 52 }, (_, weekIndex) => {
      const startOfWeek = new Date(startDate);
      startOfWeek.setDate(startDate.getDate() + weekIndex * 7); // Tính ngày bắt đầu tuần
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Tính ngày kết thúc tuần

      return {
        week: weekIndex + 1,
        start: startOfWeek.toLocaleDateString("vi-VN"),
        end: endOfWeek.toLocaleDateString("vi-VN"),
      };
    });

    setWeekRanges(ranges);
  };
  // Gọi fetchDriverRevenue khi component mount
  useEffect(() => {
    calculateWeekRanges();
    fetchDriverRevenue(); // Gọi hàm để lấy dữ liệu tài xế
  }, []); // Chạy 1 lần khi component được render
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Danh Sách Doanh Thu Tài Xế
      </h1>

      {/* Tab control */}
      <Tabs
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
        id="driver-tabs"
        className="mb-3"
      >
        <Tab eventKey="revenue" title="Tổng">
          {/* Tab 1 - Doanh Thu */}
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Tìm kiếm tài xế..."
              style={{
                padding: "10px",
                marginBottom: "20px",
                width: "100%",
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={sortByRevenue}
              style={{
                padding: "10px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "20px",
              }}
            >
              Sắp xếp theo Doanh Thu
            </button>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      fontWeight: "bold",
                      backgroundColor: "#f4f4f4",
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      fontWeight: "bold",
                      backgroundColor: "#f4f4f4",
                    }}
                  >
                    Hình Ảnh
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      fontWeight: "bold",
                      backgroundColor: "#f4f4f4",
                    }}
                  >
                    Tên
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      fontWeight: "bold",
                      backgroundColor: "#f4f4f4",
                    }}
                  >
                    Doanh Thu
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      fontWeight: "bold",
                      backgroundColor: "#f4f4f4",
                    }}
                  >
                    Thực Nhận
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      fontWeight: "bold",
                      backgroundColor: "#f4f4f4",
                    }}
                  >
                    Rank
                  </th>
                  <th
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      fontWeight: "bold",
                      backgroundColor: "#f4f4f4",
                    }}
                  >
                    Phần Trăm (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => (
                  <tr key={driver.driverID}>
                    <td
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "10px",
                        textAlign: "left",
                      }}
                    >
                      {driver.driverID}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "10px",
                        textAlign: "left",
                      }}
                    >
                      <img
                        src={driver.image}
                        alt={driver.driverName}
                        style={{ width: "50px", height: "50px" }}
                      />
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "10px",
                        textAlign: "left",
                      }}
                    >
                      {driver.driverName}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "10px",
                        textAlign: "left",
                      }}
                    >
                      {driver.totalRevenue.toLocaleString()} VND
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "10px",
                        textAlign: "left",
                      }}
                    >
                      {driver.realRevenue.toLocaleString()} VND
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "10px",
                        textAlign: "left",
                      }}
                    >
                      {driver.rank}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "10px",
                        textAlign: "left",
                        color: driver.percentage >= 85 ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {driver.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Tổng cộng */}
          <div style={{ marginTop: "20px", fontWeight: "bold" }}>
            Tổng Doanh Thu: {totalRevenue.toLocaleString()} VND <br />
            Tổng Thực Nhận: {totalNetIncome.toLocaleString()} VND
          </div>
        </Tab>

        <Tab eventKey="edit" title="Theo Tuần">
          <div>
            <h2>Hiển thị doanh thu tài xế theo tuần</h2>

            {/* Form chọn năm và tuần */}
            <Form>
              <Form.Group controlId="yearSelect">
                <Form.Label>Chọn năm</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  {/* Thêm các năm khác ở đây */}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="weekSelect">
                <Form.Label>Chọn tuần</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedWeek}
                  onChange={handleWeekChange}
                >
                  <option value="">Chọn tuần</option>
                  {weekRanges.map(({ week, start, end }) => (
                    <option key={week} value={week}>
                      Tuần {week} ({start} - {end})
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Button variant="primary" onClick={fetchDriverRevenueWeek}>
                Xem doanh thu
              </Button>
            </Form>

            {/* Hiển thị bảng doanh thu */}
            <Table striped bordered hover className="mt-4">
              <thead>
                <tr>
                  <th>Tên tài xế</th>
                  <th>Doanh thu tổng</th>
                  <th>Doanh thu thực nhận</th>
                  <th>Hạng</th>
                  <th>Tỷ lệ (%)</th>
                </tr>
              </thead>
              <tbody>{renderRevenueTable()}</tbody>
            </Table>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default DriverRevenueScreen;
