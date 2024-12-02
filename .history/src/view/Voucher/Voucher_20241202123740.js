import React, { useState, useEffect } from "react";
import VoucherViewModel from "../../viewmodel/VoucherViewModel";

const VoucherManagement = () => {
  const voucherViewModel = new VoucherViewModel();
  const [userGroup, setUserGroup] = useState("free");
  const [isActive, setIsActive] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [newVoucher, setNewVoucher] = useState({
    code: "",
    name: "",
    description: "",
    type: "",
    value: "",
    minOrderValue: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở/đóng modal

  useEffect(() => {
    const fetchVouchers = async () => {
      const fetchedVouchers = await voucherViewModel.getVoucher(
        userGroup,
        isActive
      );
      setVouchers(fetchedVouchers);
    };

    fetchVouchers();
  }, [userGroup, isActive]);

  const toggleVoucherStatus = (code) => {
    setVouchers((prevVouchers) =>
      prevVouchers.map((voucher) =>
        voucher.code === code
          ? { ...voucher, isActive: !voucher.isActive }
          : voucher
      )
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVoucher((prevVoucher) => ({
      ...prevVoucher,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await voucherViewModel.addVoucher(newVoucher);
      setNewVoucher({
        code: "",
        name: "",
        description: "",
        type: "",
        value: "",
        minOrderValue: "",
        maxDiscount: "",
        startDate: "",
        endDate: "",
        imageUrl: "",
      });
      alert("Voucher mới đã được thêm thành công!");
      setIsModalOpen(false); // Đóng modal sau khi thêm voucher thành công
    } catch (error) {
      console.error("Error adding voucher:", error);
      alert("Đã xảy ra lỗi khi thêm voucher.");
    }
  };

  return (
    <div className="voucher-management-container">
      <h2>Quản lý Voucher</h2>

      <div className="select-container">
        <select
          value={userGroup}
          onChange={(e) => setUserGroup(e.target.value)}
        >
          <option value="free">Miễn phí</option>
          <option value="plus">Plus</option>
          <option value="basic">Cơ Bản</option>
        </select>
      </div>

      <div className="select-container">
        <select
          value={isActive ? "true" : "false"}
          onChange={(e) => setIsActive(e.target.value === "true")}
        >
          <option value="true">Kích Hoạt</option>
          <option value="false">Ẩn</option>
        </select>
      </div>

      {/* Nút thêm voucher và modal */}
      <button onClick={() => setIsModalOpen(true)}>Thêm Voucher</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Thêm Voucher Mới</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Mã Voucher:</label>
                <input
                  type="text"
                  name="code"
                  value={newVoucher.code}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tên Voucher:</label>
                <input
                  type="text"
                  name="name"
                  value={newVoucher.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mô tả:</label>
                <textarea
                  name="description"
                  value={newVoucher.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Loại Voucher:</label>
                <select
                  name="type"
                  value={newVoucher.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="PERCENTAGE">Giảm theo phần trăm</option>
                  <option value="FIXED_AMOUNT">
                    Giảm theo số tiền cố định
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Giá trị (%):</label>
                <input
                  type="number"
                  name="value"
                  value={newVoucher.value}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Giá trị tối thiểu (VND):</label>
                <input
                  type="number"
                  name="minOrderValue"
                  value={newVoucher.minOrderValue}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Giảm tối đa (VND):</label>
                <input
                  type="number"
                  name="maxDiscount"
                  value={newVoucher.maxDiscount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Ngày kết thúc:</label>
                <input
                  type="date"
                  name="endDate"
                  value={newVoucher.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hình ảnh URL:</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={newVoucher.imageUrl}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Thêm Voucher</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Đóng
              </button>
            </form>
          </div>
        </div>
      )}

      <table>
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
                  className="voucher-image"
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

      <style jsx>{`
        .voucher-management-container {
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        h2,
        h3 {
          font-size: 24px;
          margin-bottom: 20px;
        }

        .select-container {
          margin-bottom: 20px;
        }

        select,
        input,
        textarea {
          padding: 10px;
          width: 100%;
          max-width: 300px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 5px;
          margin-bottom: 10px;
        }

        button {
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          background-color: #007bff;
          color: #fff;
          cursor: pointer;
        }

        button:hover {
          background-color: #0056b3;
        }

        table {
          width: 100%;
          margin-top: 20px;
          border-collapse: collapse;
        }

        table th,
        table td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .voucher-image {
          max-width: 100px;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 10px;
          width: 50%;
        }

        .form-group {
          margin-bottom: 10px;
        }

        .form-group label {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default VoucherManagement;
