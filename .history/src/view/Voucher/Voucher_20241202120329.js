import React, { useState, useEffect } from "react";
import VoucherViewModel from "../../viewmodel/VoucherViewModel";

const VoucherManagement = () => {
  // Sử dụng ViewModel để lấy dữ liệu voucher
  const voucherViewModel = new VoucherViewModel();
  const [userGroup, setUserGroup] = useState("free"); // Giá trị mặc định
  const [isActive, setIsActive] = useState(true); // Giá trị mặc định

  // Cập nhật vouchers từ ViewModel
  const [vouchers, setVouchers] = useState([]);

  // Lấy dữ liệu từ ViewModel khi status, userGroup hoặc isActive thay đổi
  useEffect(() => {
    voucherViewModel.getVoucher(userGroup, isActive); // Gọi hàm lấy voucher từ ViewModel
    setVouchers(voucherViewModel.vouchers); // Cập nhật dữ liệu vouchers
  }, [userGroup, isActive]);

  // Hàm kích hoạt hoặc hủy kích hoạt voucher
  const toggleVoucherStatus = (code) => {
    setVouchers((prevVouchers) =>
      prevVouchers.map((voucher) =>
        voucher.code === code
          ? { ...voucher, isActive: !voucher.isActive }
          : voucher
      )
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Quản lý Voucher</h2>

      {/* Chọn nhóm người dùng */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={userGroup}
          onChange={(e) => setUserGroup(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            maxWidth: "200px",
            fontSize: "16px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          <option value="free">Miễn phí</option>
          <option value="plus">Plus</option>
          <option value="basic">Cơ Bản</option>
        </select>
      </div>
      {/* Chọn nhóm người dùng */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={userGroup}
          onChange={(e) => setIsActive(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            maxWidth: "200px",
            fontSize: "16px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          <option value="true">Kích Hoạt</option>
          <option value="false">Ẩn</option>
        </select>
      </div>

      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Mã</th>
            <th>Tên</th>
            <th>Mô tả</th>
            <th>Loại</th>
            <th>Giá trị (%)</th>
            <th>Giá trị tối thiểu (VND)</th>
            <th>Giảm tối đa (VND)</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher) => (
            <tr key={voucher.code}>
              <td>
                <img
                  src={voucher.imageUrl}
                  alt={voucher.name}
                  style={{ width: "50px", height: "50px", borderRadius: "4px" }}
                />
              </td>
              <td>{voucher.code}</td>
              <td>{voucher.name}</td>
              <td>{voucher.description}</td>
              <td>{voucher.type}</td>
              <td>{voucher.value}</td>
              <td>{voucher.minOrderValue.toLocaleString()}</td>
              <td>{voucher.maxDiscount.toLocaleString()}</td>
              <td>{new Date(voucher.startDate).toLocaleDateString()}</td>
              <td>{new Date(voucher.endDate).toLocaleDateString()}</td>
              <td>{voucher.isActive ? "Kích hoạt" : "Không kích hoạt"}</td>
              <td>
                <button onClick={() => toggleVoucherStatus(voucher.code)}>
                  {voucher.isActive ? "Hủy kích hoạt" : "Kích hoạt"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherManagement;
