import React, { useState, useEffect } from "react";
import VoucherViewModel from "../../viewmodel/VoucherViewModel";

const VoucherManagement = () => {
  const voucherViewModel = new VoucherViewModel();
  const [userGroup, setUserGroup] = useState("free");
  const [isActive, setIsActive] = useState(true);
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
    userGroups: ["free", "basic", "plus"], // Mảng hợp lệ
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở/đóng modal

  const [isModalUpdate, setIsModalUpdate] = useState(false); // Trạng thái mở/đóng modal
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  // Mở modal với voucher đã chọn
  const openModal = (voucher) => {
    setSelectedVoucher(voucher);
    setIsModalUpdate(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVoucher(null);
  };
  const fetchVouchers = async () => {
    const fetchedVouchers = await voucherViewModel.getVoucher(
      userGroup,
      isActive
    );
    setVouchers(fetchedVouchers);
  };
  useEffect(() => {
    fetchVouchers();
  }, [userGroup, isActive]);
  // Cập nhật thông tin voucher (ví dụ như tên voucher)
  const handleUpdateVoucher = async () => {
    try {
      const updatedVoucher = {
        ...selectedVoucher,
        voucherId: selectedVoucher._id, // Đổi tên
      };
      delete updatedVoucher._id; // Loại bỏ _id để không gửi tới backend

      console.log("Updating voucher", updatedVoucher);

      // Gọi hàm UpdateVoucher để gửi yêu cầu API
      const updatedVoucherResponse = await voucherViewModel.UpdateVoucher(
        updatedVoucher
      );

      // Nếu API cập nhật thành công, đóng modal
      console.log("Voucher updated successfully:", updatedVoucherResponse);
      alert("Voucher đã được sửa thành công!");
      fetchVouchers();
      closeModal(); // Đóng modal sau khi cập nhật thành công
    } catch (error) {
      console.error("Error updating voucher:", error.message);
      // Nếu có lỗi, có thể hiển thị thông báo lỗi cho người dùng
      alert("Failed to update voucher: " + error.message);
    }
  };
  const toggleVoucherStatus = async (code) => {
    try {
      // Gọi hàm UpdateVoucher để gửi yêu cầu API
      const updatedVoucherResponse =
        await voucherViewModel.ToggleVoucherActivation(code);
      console.log("ok");
    } catch (error) {
      console.error("Error updating voucher:", error.message);
    }

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
        userGroups: "",
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
                <label>Loại Khách Hàng:</label>
                <select
                  name="userGroups"
                  value={newVoucher.userGroups}
                  onChange={handleInputChange}
                  required
                >
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="plus">Plus</option>
                  {/* <option value="all">Tất cả</option> */}
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
                <label>Ngày bắt đầu:</label>
                <input
                  type="date"
                  name="startDate"
                  value={newVoucher.startDate}
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
          {vouchers.length === 0 ? (
            <tr>
              <td colSpan="12">Không có voucher phù hợp.</td>
            </tr>
          ) : (
            vouchers.map((voucher) => (
              <tr key={voucher.code} onClick={() => openModal(voucher)}>
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn chặn sự kiện từ `<tr>`
                      toggleVoucherStatus(voucher._id);
                    }}
                  >
                    {voucher.isActive ? "Hủy kích hoạt" : "Kích hoạt"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {isModalUpdate && selectedVoucher && (
        <div className="modal">
          <div className="modal-content">
            <h2>Sửa Voucher</h2>
            <form>
              <label>Mã Voucher:</label>
              <input
                type="text"
                value={selectedVoucher.code}
                onChange={(e) =>
                  setSelectedVoucher({
                    ...selectedVoucher,
                    code: e.target.value,
                  })
                }
              />
              <label>Tên Voucher:</label>
              <input
                type="text"
                value={selectedVoucher.name}
                onChange={(e) =>
                  setSelectedVoucher({
                    ...selectedVoucher,
                    name: e.target.value,
                  })
                }
              />
              <label>Mô tả:</label>
              <input
                type="text"
                value={selectedVoucher.description}
                onChange={(e) =>
                  setSelectedVoucher({
                    ...selectedVoucher,
                    description: e.target.value,
                  })
                }
              />
              <label>Giá trị(%):</label>
              <input
                type="number"
                value={selectedVoucher.value}
                onChange={(e) =>
                  setSelectedVoucher({
                    ...selectedVoucher,
                    value: e.target.value,
                  })
                }
              />
              <label>Giá trị tối thiểu của đơn hàng(VND):</label>
              <input
                type="number"
                value={selectedVoucher.minOrderValue}
                onChange={(e) =>
                  setSelectedVoucher({
                    ...selectedVoucher,
                    value: e.target.value,
                  })
                }
              />
              <label>Giảm tối đa(VND):</label>
              <input
                type="number"
                value={selectedVoucher.maxDiscount}
                onChange={(e) =>
                  setSelectedVoucher({
                    ...selectedVoucher,
                    value: e.target.value,
                  })
                }
              />
              <label>Ngày bắt đầu:</label>
              <input
                type="date"
                value={
                  new Date(selectedVoucher.startDate)
                    .toISOString()
                    .split("T")[0]
                } // Đảm bảo định dạng ngày
                onChange={(e) =>
                  setSelectedVoucher({
                    ...selectedVoucher,
                    startDate: e.target.value,
                  })
                }
              />
              <label>Ngày kết thúc voucher:</label>
              <input
                type="date"
                value={
                  new Date(selectedVoucher.endDate).toISOString().split("T")[0]
                } // Đảm bảo định dạng ngày
                onChange={(e) =>
                  setSelectedVoucher({
                    ...selectedVoucher,
                    startDate: e.target.value,
                  })
                }
              />
              {/* Thêm trường ảnh */}
              <label>Ảnh Voucher:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // Chuyển file thành URL tạm thời
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setSelectedVoucher({
                        ...selectedVoucher,
                        imageUrl: reader.result, // Lưu URL của ảnh
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {/* Hiển thị ảnh đã chọn */}
              {selectedVoucher.imageUrl && (
                <div>
                  <p>Ảnh hiện tại:</p>
                  <img
                    src={selectedVoucher.imageUrl}
                    alt="Voucher"
                    width="100"
                  />
                </div>
              )}

              {/* Thêm các trường sửa đổi khác nếu cần */}
              <button type="button" onClick={handleUpdateVoucher}>
                Cập nhật
              </button>
              <button type="button" onClick={closeModal}>
                Đóng
              </button>
            </form>
          </div>
        </div>
      )}

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
