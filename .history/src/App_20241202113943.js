import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import DriverMap from "./view/Driver/DriverMap";
import MenuBar from "./view/MenuBar";
import ManagerDriverScreen from "./view/Driver/ManagerDriverScreen";
import "bootstrap/dist/css/bootstrap.min.css";
import TruckList from "./view/Truck/TruckList";
import CustomerScreen from "./view/Customer/CustomerScreen";
import LoginScreen from "/Users/ttcenter/Manager_LT_Driver/driver-management/src/view/Authen.js/LoginScreen.js"; // Màn hình login
import OrderManagement from "./view/Order/OrderManagement";
import VoucherManagement from "./view/Voucher/Voucher";

function App() {
  const [selectedOption, setSelectedOption] = useState("option1");
  const [pageTitle, setPageTitle] = useState("Quản lý Tài xế");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State xác thực
  const navigate = useNavigate();

  // Kiểm tra token trong localStorage khi component được render lần đầu
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); // Nếu có token, người dùng đã đăng nhập
    } else {
      setIsAuthenticated(false); // Nếu không có token, điều hướng đến trang login
      navigate("/login");
    }
  }, [navigate]); // Chạy một lần khi component được render lần đầu tiên
  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token khỏi localStorage
    setIsAuthenticated(false); // Cập nhật lại trạng thái xác thực
    navigate("/login"); // Điều hướng về trang login
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
