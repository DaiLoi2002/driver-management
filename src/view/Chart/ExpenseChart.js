import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
} from "chart.js";
import { Tabs, Tab, Box } from "@mui/material";

import StatisticsViewModel from "../../viewmodel/StatisticsViewModel";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend);

const BarChart = () => {
  const statisticsViewModel = new StatisticsViewModel();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [chartData, setChartData] = useState({
    labels: ["", "", "", "", "", "", ""],
    datasets: [
      {
        label: "Chi phí (VND)",
        data: [0, 0, 0, 0, 0],
        backgroundColor: "#36A2EB",
        borderColor: "#36A2EB",
        borderWidth: 1,
      },
    ],
  });
  // Hàm fetchMonthRevenue (ví dụ gọi API hoặc xử lý tính toán)
  const fetchMonthRevenue = (month, year) => {
    // Ví dụ gọi API hoặc tính toán doanh thu tháng
    console.log(`Fetching revenue for month: ${month}, year: ${year}`);
  };

  const monthOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const handleMonthChange = (month) => {
    if (month) {
      setSelectedMonth(month);
      fetchCostforMonth(month, selectedYear); // Gọi API khi thay đổi tháng
    } else {
      console.error("Month value is null or undefined");
    }
  };

  const getCurrentWeek = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const currentWeek = Math.ceil(dayOfYear / 7);
    return currentWeek;
  };

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchCostforWeeks = async (selectedWeek, selectedYear) => {
    try {
      const Cost = await statisticsViewModel.getWeekCost(
        selectedWeek,
        selectedYear
      );
      const salesPerDay = Cost.salesPerDay;
      const totalWeeklySales = Cost.totalWeeklySales;

      const salesData = salesPerDay.map((item) => item.sales);
      const labels = salesPerDay.map((item) => item.date);

      const updatedData = {
        labels: labels,
        datasets: [
          {
            label: "Chi phí (VND)",
            data: salesData,
            backgroundColor: "#FF6384",
            borderColor: "#FF6384",
            borderWidth: 1,
          },
        ],
      };

      setTotalRevenue(totalWeeklySales);
      setChartData(updatedData);
    } catch (error) {
      console.error("Lỗi khi lấy chi phí:", error);
    }
  };
  const fetchCostforMonth = async (selectedMonth, selectedYear) => {
    try {
      const Cost = await statisticsViewModel.getMonthCost(
        selectedMonth,
        selectedYear
      );
      console.log(Cost);
      const salesPerDay = Cost.salesPerDay;
      const totalWeeklySales = Cost.totalMonthlySales;

      const salesData = salesPerDay.map((item) => item.sales);
      const labels = salesPerDay.map((item) => item.date.slice(0, 2));

      const updatedData = {
        labels: labels,
        datasets: [
          {
            label: "Chi phí (VND)",
            data: salesData,
            backgroundColor: "#FF6384",
            borderColor: "#FF6384",
            borderWidth: 1,
          },
        ],
      };

      setTotalRevenue(totalWeeklySales);
      setChartData(updatedData);
    } catch (error) {
      console.error("Lỗi khi lấy chi phí:", error);
    }
  };

  const handleWeekChange = (week) => setSelectedWeek(week);
  const handleYearChange = (year) => setSelectedYear(year);
  const handleApprove = () => fetchCostforWeeks(selectedWeek, selectedYear);
  const handleApproveMonth = () =>
    fetchCostforMonth(selectedMonth, selectedYear);

  const weekOptions = Array.from({ length: 52 }, (_, i) => i + 1);
  const yearOptions = Array.from({ length: 11 }, (_, i) => 2020 + i);

  // Tabs state
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);

    const currentMonth = new Date().getMonth() + 1; // Lấy tháng hiện tại (0-based index, +1 để đúng tháng)
    setSelectedMonth(currentMonth);
    setSelectedWeek(getCurrentWeek());
    setChartData({
      labels: ["", "", "", "", "", "", ""],
      datasets: [
        {
          label: "Chi phí (VND)",
          data: [0, 0, 0, 0, 0],
          backgroundColor: "#36A2EB",
          borderColor: "#36A2EB",
          borderWidth: 1,
        },
      ],
    });
    setTotalRevenue(0);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "90vw",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "20px",
        }}
      >
        Thống kê doanh thu ứng dụng
      </h2>

      {/* Tabs */}
      <Box sx={{ width: "100%" }}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Thống kê Tuần" />
          <Tab label="Thống kê Tháng" />
        </Tabs>

        {tabIndex === 0 && (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "20px",
                gap: "150px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <label
                  htmlFor="weekSelect"
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Chọn tuần:
                </label>
                <select
                  id="weekSelect"
                  value={selectedWeek}
                  onChange={(e) => handleWeekChange(Number(e.target.value))}
                  style={{
                    padding: "8px 12px",
                    fontSize: "16px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    width: "120px",
                  }}
                >
                  {weekOptions.map((week) => (
                    <option key={week} value={week}>
                      {`Tuần ${week}`}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ textAlign: "center" }}>
                <label
                  htmlFor="yearSelect"
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Chọn năm:
                </label>
                <select
                  id="yearSelect"
                  value={selectedYear}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  style={{
                    padding: "8px 12px",
                    fontSize: "16px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    width: "120px",
                  }}
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleApprove}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Duyệt
              </button>
            </div>
            {/* Biểu đồ */}
            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Tổng doanh thu tuần:{" "}
              {new Intl.NumberFormat("vi-VN").format(totalRevenue)} VND
            </div>
            <div
              style={{
                marginTop: "30px",
                width: "100%",
                maxHeight: "30vw",
                maxWidth: "90vw",
                marginLeft: "auto",
                marginRight: "auto",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Bar data={chartData} options={{ responsive: true }} />
            </div>
          </div>
        )}

        {tabIndex === 1 && (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "20px",
                gap: "150px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <label
                  htmlFor="monthSelect"
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Chọn tháng:
                </label>
                <select
                  id="monthSelect"
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(Number(e.target.value))}
                  style={{
                    padding: "8px 12px",
                    fontSize: "16px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    width: "120px",
                  }}
                >
                  {monthOptions.map((month) => (
                    <option key={month} value={month}>
                      {`Tháng ${month}`}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ textAlign: "center" }}>
                <label
                  htmlFor="yearSelect"
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                >
                  Chọn năm:
                </label>
                <select
                  id="yearSelect"
                  value={selectedYear}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  style={{
                    padding: "8px 12px",
                    fontSize: "16px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    width: "120px",
                  }}
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleApproveMonth}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Duyệt
              </button>
            </div>
            {/* Biểu đồ */}
            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Tổng doanh thu của tháng:{" "}
              {new Intl.NumberFormat("vi-VN").format(totalRevenue)} VND
            </div>
            <div
              style={{
                marginTop: "30px",
                width: "100%",
                maxHeight: "30vw",
                maxWidth: "90vw",
                marginLeft: "auto",
                marginRight: "auto",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Bar data={chartData} options={{ responsive: true }} />
            </div>
          </div>
        )}
      </Box>
    </div>
  );
};

export default BarChart;
