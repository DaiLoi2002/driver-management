import React, { useState } from "react";
import {
  UserIcon,
  ShoppingCartIcon,
  TruckIcon,
  CarIcon,
  Ticket,
} from "lucide-react";
import "/Users/ttcenter/Manager_LT_Driver/driver-management/src/App.css"; // Đảm bảo rằng bạn đã import tệp CSS ở đây

function MenuBar({ onSelectOption }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    onSelectOption(option); // Thực hiện callback khi nút được chọn
  };

  return (
    <div className="menu-bar flex flex-col items-start">
      <button
        className={`menu-item flex items-center p-3 hover:bg-gray-200 transition-colors ${
          selectedOption === "option1" ? "bg-blue-200" : ""
        }`}
        onClick={() => handleSelectOption("option1")}
      >
        <div className="mr-4">
          <UserIcon />
        </div>
        <div className="custom-text">Thông Tin Khách Hàng</div>{" "}
        {/* Sử dụng custom-text */}
      </button>

      <button
        className={`menu-item flex items-center gap-4 p-3 hover:bg-gray-200 transition-colors ${
          selectedOption === "option2" ? "bg-blue-200" : ""
        }`}
        onClick={() => handleSelectOption("option2")}
      >
        <div className="mr-4">
          <ShoppingCartIcon />
        </div>
        <span className="custom-text">Quản Lý Đơn Hàng</span>{" "}
        {/* Sử dụng custom-text */}
      </button>

      <button
        className={`menu-item flex items-center gap-4 p-3 hover:bg-gray-200 transition-colors ${
          selectedOption === "option3" ? "bg-blue-200" : ""
        }`}
        onClick={() => handleSelectOption("option3")}
      >
        <div className="mr-4">
          <TruckIcon />
        </div>
        <span className="custom-text">Quản Lý Tài Xế</span>{" "}
        {/* Sử dụng custom-text */}
      </button>

      <button
        className={`menu-item flex items-center gap-4 p-3 hover:bg-gray-200 transition-colors ${
          selectedOption === "option4" ? "bg-blue-200" : ""
        }`}
        onClick={() => handleSelectOption("option4")}
      >
        <div className="mr-4">
          <CarIcon />
        </div>
        <span className="custom-text">Quản Lý Phương Tiện</span>{" "}
        {/* Sử dụng custom-text */}
      </button>
      <button
        className={`menu-item flex items-center gap-4 p-3 hover:bg-gray-200 transition-colors ${
          selectedOption === "option5" ? "bg-blue-200" : ""
        }`}
        onClick={() => handleSelectOption("option5")}
      >
        <div className="mr-4">
          <Ticket />
        </div>
        <span className="custom-text">Quản Lý Voucher</span>{" "}
        {/* Sử dụng custom-text */}
      </button>
      <button
        className={`menu-item flex items-center gap-4 p-3 hover:bg-gray-200 transition-colors ${
          selectedOption === "option6" ? "bg-blue-200" : ""
        }`}
        onClick={() => handleSelectOption("option6")}
      >
        <div className="mr-4">
          <Ticket />
        </div>
        <span className="custom-text">Thống kê doanh thu</span>{" "}
        {/* Sử dụng custom-text */}
      </button>
      <button
        className={`menu-item flex items-center gap-4 p-3 hover:bg-gray-200 transition-colors ${
          selectedOption === "option7" ? "bg-blue-200" : ""
        }`}
        onClick={() => handleSelectOption("option7")}
      >
        <div className="mr-4">
          <Ticket />
        </div>
        <span className="custom-text">Thống kê đơn hàng</span>{" "}
        {/* Sử dụng custom-text */}
      </button>
      <button
        className={`menu-item flex items-center gap-4 p-3 hover:bg-gray-200 transition-colors ${
          selectedOption === "option8" ? "bg-blue-200" : ""
        }`}
        onClick={() => handleSelectOption("option8")}
      >
        <div className="mr-4">
          <Ticket />
        </div>
        <span className="custom-text">Thống kê doanh thu tài xế</span>{" "}
        {/* Sử dụng custom-text */}
      </button>
    </div>
  );
}

export default MenuBar;
