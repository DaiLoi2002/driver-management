import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import DriverMap from './view/Driver/DriverMap';
import MenuBar from './view/MenuBar';
import ManagerDriverScreen from './view/Driver/ManagerDriverScreen';
import "bootstrap/dist/css/bootstrap.min.css";
import TruckList from './view/Truck/TruckList';
import CustomerScreen from './view/Customer/CustomerScreen';
import useAuthViewModel from '/Users/ttcenter/Manager_LT_Driver/driver-management/src/viewmodel/AuthViewModel.js';
import LoginScreen from '/Users/ttcenter/Manager_LT_Driver/driver-management/src/view/Authen.js/LoginScreen.js'; // Màn hình login

function App() {
  const [selectedOption, setSelectedOption] = useState("option1");
  const [pageTitle, setPageTitle] = useState('Quản lý Tài xế');
  const { isAuthenticated } = useAuthViewModel(); // Lấy trạng thái xác thực từ ViewModel
  const navigate = useNavigate();



  useEffect(() => {
    switch (selectedOption) {
      case 'option1':
        setPageTitle('Thông tin khách hàng');
        break;
      case 'option2':
        setPageTitle('Quản lý đơn hàng');
        break;
      case 'option3':
        setPageTitle('Quản lý Tài xế');
        break;
      case 'option4':
        setPageTitle('Quản lý phương tiện');
        break;
      default:
        setPageTitle('');
        break;
    }
  }, [selectedOption]);

  const renderContent = () => {
    switch (selectedOption) {
      case "option1":
        return <CustomerScreen />;
      case "option2":
        return <div>Hiển thị nội dung cho Option 2</div>;
      case "option3":
        return <ManagerDriverScreen />;
      case "option4":
        return <TruckList />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
    <header className="App-header">
      <h1>{pageTitle}</h1>
    </header>
  
    <div className="App-body">
      <div className="MenuBar">
        <MenuBar onSelectOption={setSelectedOption} />
      </div>
      <div className="App-content">
        {renderContent()}
      </div>
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
