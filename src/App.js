import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import "./App.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import DriverMap from "./view/Driver/DriverMap";
import MenuBar from "./view/MenuBar";
import ManagerDriverScreen from "./view/Driver/ManagerDriverScreen";
import TruckList from "./view/Truck/TruckList";
import CustomerScreen from "./view/Customer/CustomerScreen";
import LoginScreen from "./view/Authen.js/LoginScreen.js"; // Màn hình login
import OrderManagement from "./view/Order/OrderManagement";
import VoucherManagement from "./view/Voucher/Voucher";
import ExpenseChart from "./view/Chart/ExpenseChart";
import CompletionChart from "./view/Chart/CompletionChart";
import DriverRevenueScreen from "./view/Chart/DriverRevenue.js";

function App() {
  const [selectedOption, setSelectedOption] = useState("option1");
  const [pageTitle, setPageTitle] = useState("Quản lý Tài xế");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State xác thực
  const [showModal, setShowModal] = useState(false); // State cho popup
  const navigate = useNavigate();

  // Hàm kiểm tra token hết hạn
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token); // Giải mã token
      const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (giây)
      return decoded.exp < currentTime; // Trả về true nếu token hết hạn
    } catch (error) {
      console.error("Invalid token:", error);
      return true; // Token không hợp lệ được xem là hết hạn
    }
  };

  // Kiểm tra token khi component được render lần đầu
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (isTokenExpired(token)) {
        // Token hết hạn
        setShowModal(true); // Hiển thị popup
      } else {
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token khỏi localStorage
    setIsAuthenticated(false); // Cập nhật lại trạng thái xác thực
    navigate("/login"); // Điều hướng về trang login
  };

  const handleModalClose = () => {
    setShowModal(false); // Đóng popup
    handleLogout(); // Xử lý đăng xuất
  };

  useEffect(() => {
    switch (selectedOption) {
      case "option1":
        setPageTitle("Thông tin khách hàng");
        break;
      case "option2":
        setPageTitle("Quản lý đơn hàng");
        break;
      case "option3":
        setPageTitle("Quản lý Tài xế");
        break;
      case "option4":
        setPageTitle("Quản lý phương tiện");
        break;
      case "option5":
        setPageTitle("Quản lý voucher");
        break;
      case "option6":
        setPageTitle("Thống kê chi tiêu");
        break;
      case "option7":
        setPageTitle("Thống kê đơn hàng");
        break;
      case "option8":
        setPageTitle("Thống kê doanh thu tài xế");
        break;
      default:
        setPageTitle("");
        break;
    }
  }, [selectedOption]);

  const renderContent = () => {
    switch (selectedOption) {
      case "option1":
        return <CustomerScreen />;
      case "option2":
        return <OrderManagement />;
      case "option3":
        return <ManagerDriverScreen />;
      case "option4":
        return <TruckList />;
      case "option5":
        return <VoucherManagement />;
      case "option6":
        return <ExpenseChart />;
      case "option7":
        return <CompletionChart />;
      case "option8":
        return <DriverRevenueScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{pageTitle}</h1>
        <button className="btn btn-danger" onClick={handleLogout}>
          Đăng xuất
        </button>
      </header>

      <div className="App-body">
        <div className="MenuBar">
          <MenuBar onSelectOption={setSelectedOption} />
        </div>
        <div className="App-content">{renderContent()}</div>
      </div>

      <footer className="App-footer">
        <p>&copy; 2024 Công ty Quản lý Tài xế. All rights reserved.</p>
      </footer>

      {/* Modal popup */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Phiên đăng nhập đã hết hạn</Modal.Title>
        </Modal.Header>
        <Modal.Body>Vui lòng đăng nhập lại.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleModalClose}>
            Đăng nhập lại
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginScreen />} />
        {/* Thêm các route khác tại đây */}
      </Routes>
    </Router>
  );
}

export default AppWrapper;
