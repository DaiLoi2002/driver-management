import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import PropTypes from "prop-types";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import StatisticsViewModel from "../../viewmodel/StatisticsViewModel";
// Đăng ký các plugin của Chart.js
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

const CompletionChart = ({ completedOrders, totalOrders, waitingOrders }) => {
  // Prevent division by zero
  const completionPercentage =
    totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  // Tính toán phần trăm của đơn hàng đang thực hiện (waitingOrders) và chưa hoàn thành
  const remainingOrders = totalOrders - completedOrders - waitingOrders;
  const remainingPercentage =
    totalOrders > 0 ? (remainingOrders / totalOrders) * 100 : 0;
  const waitingPercentage =
    totalOrders > 0 ? (waitingOrders / totalOrders) * 100 : 0;

  // Dữ liệu cho biểu đồ tròn
  const data = {
    labels: ["Hoàn thành", "Đã huỷ", "Đang xử lý"],
    datasets: [
      {
        data: [completionPercentage, remainingPercentage, waitingPercentage],
        backgroundColor: ["#4CAF50", "#3D3D3D", "#FF6347"],
        borderColor: ["#fff", "#fff", "#fff"],
        borderWidth: 1,
        rawData: [completedOrders, remainingOrders, waitingOrders], // Thêm rawData để sử dụng trong tooltip
      },
    ],
  };

  // Cấu hình biểu đồ
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      datalabels: {
        color: "#fff", // Màu sắc của chữ
        font: {
          weight: "bold", // Độ đậm của font
        },
        formatter: (value) => {
          return `${value.toFixed(2)}%`; // Hiển thị phần trăm
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const dataset = tooltipItem.dataset;
            const index = tooltipItem.dataIndex;

            // Lấy số đơn thực tế từ rawData
            const completedOrders = dataset.rawData[0];
            const remainingOrders = dataset.rawData[1];
            const waitingOrders = dataset.rawData[2];

            // Kiểm tra index để quyết định tooltip hiển thị thông tin gì
            if (index === 0) {
              return `Hoàn thành: ${completedOrders} đơn`;
            } else if (index === 1) {
              return `Đã huỷ: ${remainingOrders} đơn`;
            } else if (index === 2) {
              return `Đang thực hiện: ${waitingOrders} đơn`;
            }
          },
        },
      },
    },
  };

  return (
    <div>
      <div
        style={{
          maxWidth: "90vw",
          margin: "20px auto",
          backgroundColor: "#ffffff",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
          border: "1px solid #e0e0e0",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#1a202c",
            fontSize: "1.8rem",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Tỉ lệ hoàn thành đơn
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ffffff",
            padding: "24px",
            border: "1px solid #dcdcdc",
            borderRadius: "12px",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
            width: "40vw",
            height: "40vw",
            margin: "20px auto",
          }}
        >
          <Pie data={data} options={options} />
        </div>
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "#555555",
            fontSize: "1rem",
            lineHeight: "1.5",
          }}
        >
          <p
            style={{
              margin: "8px 0",
              fontWeight: "600",
            }}
          >
            Số đơn hoàn thành:{" "}
            <span style={{ color: "#4caf50" }}>{completedOrders}</span>
          </p>
          <p
            style={{
              margin: "8px 0",
              fontWeight: "600",
            }}
          >
            Số đơn đã hủy:{" "}
            <span style={{ color: "#f44336" }}>{remainingOrders}</span>
          </p>
          <p
            style={{
              margin: "8px 0",
              fontWeight: "600",
            }}
          >
            Số đơn đang thực hiện:{" "}
            <span style={{ color: "#f44336" }}>{waitingOrders}</span>
          </p>
          <p
            style={{
              margin: "8px 0",
              fontWeight: "600",
            }}
          >
            Tổng số đơn hàng:{" "}
            <span style={{ color: "#f44336" }}>{totalOrders}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// PropTypes để kiểm tra kiểu dữ liệu
CompletionChart.propTypes = {
  completedOrders: PropTypes.number.isRequired,
  totalOrders: PropTypes.number.isRequired,
  waitingOrders: PropTypes.number.isRequired,
};

// Component sử dụng CompletionChart với useState
const ChartPage = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [waitingOrders, setWaitingOrders] = useState(0);
  const statisticsViewModel = new StatisticsViewModel();
  const fetchCompletionPercentage = async () => {
    try {
      // Gọi API qua ViewModel để lấy chi phí cho tuần và năm đã chọn
      const Percentage = await statisticsViewModel.getCompletionPercentage();
      console.log("Percentage", Percentage);
      console.log(Percentage.completedOrders, Percentage.totalOrders);
      setCompletedOrders(Percentage.completedOrders);
      setTotalOrders(Percentage.totalOrders);
      setWaitingOrders(Percentage.waitingOrders);
    } catch (error) {
      console.error("Lỗi khi lấy chi phí:", error);
    }
  };

  useEffect(() => {
    fetchCompletionPercentage();
  }, []);
  return (
    <div>
      <CompletionChart
        completedOrders={completedOrders}
        totalOrders={totalOrders}
        waitingOrders={waitingOrders}
      />
    </div>
  );
};

export default ChartPage;
