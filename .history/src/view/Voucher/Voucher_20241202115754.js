import React, { useState } from "react";
import VoucherViewModel from "../../viewmodel/VoucherViewModel";
const VoucherManagement = () => {
  // Dữ liệu voucher mẫu


  const voucherViewModel=VoucherViewModel(),
  const [vouchers, setVouchers] = useState([
    {
      code: "SUMMER",
      name: "Khuyến mãi mùa hè",
      description: "Giảm giá 20% cho tất cả đơn hàng",
      type: "PERCENTAGE",
      value: 20,
      minOrderValue: 500000,
      maxDiscount: 10000,
      startDate: "2024-06-01T00:00:00.000Z",
      endDate: "2024-12-30T00:00:00.000Z",
      maxUsage: 1000,
      currentUsage: 0,
      maxUsagePerUser: 5,
      isActive: true,
      userGroups: ["free", "plus"],
      createdBy: "Nguyễn Văn A",
      imageUrl: "http://tandat.io.vn/img/icon_app/ic_voucher_defaul.png",
      createdAt: "2024-11-27T09:10:02.521Z",
      updatedAt: "2024-11-27T09:10:02.521Z",
    },
    // Thêm nhiều voucher khác nếu cần
  ]);

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
      {/* Chọn trạng thái đơn hàng */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            maxWidth: "200px",
            fontSize: "16px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          <option value="pending">Đang chờ</option>
          <option value="is_proess">Đang thực hiện</option>
          <option value="cancelled">Đã huỷ</option>
          <option value="completed">Hoàn thành</option>
        </select>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            maxWidth: "200px",
            fontSize: "16px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          <option value="pending">Đang chờ</option>
          <option value="is_proess">Đang thực hiện</option>
          <option value="cancelled">Đã huỷ</option>
          <option value="completed">Hoàn thành</option>
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
