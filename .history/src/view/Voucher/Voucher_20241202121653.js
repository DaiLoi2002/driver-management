import React, { useState, useEffect } from "react";
import VoucherViewModel from "../../viewmodel/VoucherViewModel";

const VoucherManagement = () => {
  // Sử dụng ViewModel để lấy dữ liệu voucher
  const voucherViewModel = new VoucherViewModel();
  const [userGroup, setUserGroup] = useState("free"); // Giá trị mặc định
  const [isActive, setIsActive] = useState(true);

  // Cập nhật vouchers từ ViewModel
  const [vouchers, setVouchers] = useState([]);

  // Lấy dữ liệu từ ViewModel khi status, userGroup hoặc isActive thay đổi
  useEffect(() => {
    const fetchVouchers = async () => {
      // Gọi hàm getVoucher bất đồng bộ và đợi kết quả trả về
      const fetchedVouchers = await voucherViewModel.getVoucher(
        userGroup,
        isActive
      );
      console.log("fetchedVouchers", fetchedVouchers); // Kiểm tra dữ liệu đã lấy được hay chưa

      // Cập nhật state vouchers sau khi có dữ liệu
      setVouchers(fetchedVouchers);
    };

    fetchVouchers(); // Gọi hàm fetchVouchers để lấy dữ liệu
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
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f7fb",
        borderRadius: "8px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#333",
          fontSize: "24px",
          marginBottom: "20px",
        }}
      >
        Quản lý Voucher
      </h2>

      {/* Chọn nhóm người dùng */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={userGroup}
          onChange={(e) => setUserGroup(e.target.value)}
          style={{
            padding: "12px",
            width: "100%",
            maxWidth: "220px",
            fontSize: "16px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#fafafa",
            color: "#333",
            transition: "border-color 0.3s ease",
          }}
        >
          <option value="free">Miễn phí</option>
          <option value="plus">Plus</option>
          <option value="basic">Cơ Bản</option>
        </select>
      </div>

      {/* Chọn trạng thái */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={isActive ? "true" : "false"}
          onChange={(e) => setIsActive(e.target.value === "true")}
          style={{
            padding: "12px",
            width: "100%",
            maxWidth: "220px",
            fontSize: "16px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#fafafa",
            color: "#333",
            transition: "border-color 0.3s ease",
          }}
        >
          <option value="true">Kích Hoạt</option>
          <option value="false">Ẩn</option>
        </select>
      </div>

      {/* Bảng voucher */}
      <table
        border="1"
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead style={{ backgroundColor: "#f1f1f1" }}>
          <tr>
            <th style={{ padding: "10px", textAlign: "left" }}>Hình ảnh</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Mã</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Tên</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Mô tả</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Loại</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Giá trị (%)</th>
            <th style={{ padding: "10px", textAlign: "left" }}>
              Giá trị tối thiểu (VND)
            </th>
            <th style={{ padding: "10px", textAlign: "left" }}>
              Giảm tối đa (VND)
            </th>
            <th style={{ padding: "10px", textAlign: "left" }}>Ngày bắt đầu</th>
            <th style={{ padding: "10px", textAlign: "left" }}>
              Ngày kết thúc
            </th>
            <th style={{ padding: "10px", textAlign: "left" }}>Trạng thái</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher) => (
            <tr key={voucher.code} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>
                <img
                  src={voucher.imageUrl}
                  alt={voucher.name}
                  style={{ width: "50px", height: "50px", borderRadius: "4px" }}
                />
              </td>
              <td style={{ padding: "10px" }}>{voucher.code}</td>
              <td style={{ padding: "10px" }}>{voucher.name}</td>
              <td style={{ padding: "10px" }}>{voucher.description}</td>
              <td style={{ padding: "10px" }}>{voucher.type}</td>
              <td style={{ padding: "10px" }}>{voucher.value}</td>
              <td style={{ padding: "10px" }}>
                {voucher.minOrderValue.toLocaleString()}
              </td>
              <td style={{ padding: "10px" }}>
                {voucher.maxDiscount.toLocaleString()}
              </td>
              <td style={{ padding: "10px" }}>
                {new Date(voucher.startDate).toLocaleDateString()}
              </td>
              <td style={{ padding: "10px" }}>
                {new Date(voucher.endDate).toLocaleDateString()}
              </td>
              <td style={{ padding: "10px" }}>
                {voucher.isActive ? "Kích hoạt" : "Không kích hoạt"}
              </td>
              <td style={{ padding: "10px" }}>
                <button
                  onClick={() => toggleVoucherStatus(voucher.code)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: voucher.isActive ? "#ff7043" : "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                >
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
