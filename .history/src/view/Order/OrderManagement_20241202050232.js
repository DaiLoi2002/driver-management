import React, { useState, useEffect } from "react";
import "/Users/ttcenter/Manager_LT_Driver/driver-management/src/view/Order/ManagerOrderScreen.css";
// Dữ liệu giả lập cho đơn hàng
import OrderViewModel from "../../viewmodel/OrderViewModel";
const OrderManagement = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái tìm kiếm
  const [formData, setFormData] = useState({
    customerName: "",
    product: "",
    quantity: "",
    price: "",
    status: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);
  const [orders, setOrders] = useState([]); // Trạng thái lưu danh sách đơn hàng
  const [status, setStatus] = useState("pending"); // Trạng thái động
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const orderViewModel = new OrderViewModel();

  const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng được chọn
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở modal

  const openModal = (order) => {
    setSelectedOrder(order); // Lưu đơn hàng được chọn
    setIsModalOpen(true); // Hiển thị modal
  };

  const closeModal = () => {
    setSelectedOrder(null); // Xóa thông tin đơn hàng
    setIsModalOpen(false); // Ẩn modal
  };
  const fetchOrders = async (status) => {
    try {
      setLoading(true); // Hiển thị loading khi đang gọi API
      const fetchedOrders = await orderViewModel.getOrder(status); // Gọi API qua ViewModel
      setOrders(fetchedOrders); // Cập nhật danh sách đơn hàng

      console.log(fetchedOrders);
    } catch (error) {
      setError(error.message); // Lưu lỗi nếu xảy ra
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
    fetchOrders(status);
  }, [status]);
  const handleAddOrder = () => {
    if (
      !formData.customerName ||
      !formData.product ||
      !formData.quantity ||
      !formData.price ||
      !formData.status
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const newOrder = {
      id: Date.now(),
      ...formData,
    };
    setOrders([...orders, newOrder]);
    setFormData({
      customerName: "",
      product: "",
      quantity: "",
      price: "",
      status: "",
    });
  };

  // Xử lý xóa đơn hàng
  const handleDeleteOrder = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  // Chỉnh sửa thông tin đơn hàng
  const handleEditOrder = (order) => {
    setFormData(order);
    setEditMode(true);
    setEditOrderId(order.id);
  };

  // Cập nhật đơn hàng
  const handleUpdateOrder = () => {
    if (
      !formData.customerName ||
      !formData.product ||
      !formData.quantity ||
      !formData.price ||
      !formData.status
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const updatedOrders = orders.map((order) =>
      order.id === editOrderId ? { ...order, ...formData } : order
    );
    setOrders(updatedOrders);
    setFormData({
      customerName: "",
      product: "",
      quantity: "",
      price: "",
      status: "",
    });
    setEditMode(false);
    setEditOrderId(null);
  };

  // Hàm lọc đơn hàng theo từ khóa tìm kiếm
  // const filteredOrders = orders.filter((order) => {
  //   return (
  //     order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     order.product.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // });

  return (
    <div style={{ margin: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Quản lý Đơn Hàng</h1>

      {/* Tìm kiếm đơn hàng */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm đơn hàng (Tên khách hàng, sản phẩm)"
          style={{
            padding: "10px",
            width: "100%",
            maxWidth: "400px",
            marginBottom: "20px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        />
      </div>

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

      {/* Form thêm/sửa đơn hàng */}

      {/* Danh sách đơn hàng */}
      <h3>Danh sách đơn hàng</h3>
      <table
        border="1"
        style={{
          width: "100%",
          marginTop: "20px",
          textAlign: "center",
          borderCollapse: "collapse",
          borderColor: "#ddd",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>ID</th>
            <th>Tên khách hàng</th>
            <th>Số KM</th>
            <th>Giá</th>
            <th>Số điểm dừng</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr
                key={order._id}
                onClick={() => openModal(order)}
                style={{ cursor: "pointer" }}
              >
                <td>{order._id}</td>
                <td>{order.customerName}</td>
                <td>{order.distance}</td>
                <td>{order.totalAmount}</td>
                <td>{order.deliveryInfo.length}</td>
                <td>{order.statusOrder}</td>
                <td>
                  <button
                    onClick={() => handleEditOrder(order)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#f0ad4e",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "14px",
                      marginRight: "5px",
                    }}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#d9534f",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Không tìm thấy đơn hàng phù hợp.</td>
            </tr>
          )}
        </tbody>
      </table>
      {isModalOpen && selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            <h3>Chi tiết Đơn Hàng (Sửa)</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Ngăn nạp lại trang
                //handleSaveChanges(); // Lưu thay đổi
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <label>
                  <strong>ID:</strong>
                </label>
                <div
                  style={{
                    width: "100%",
                    padding: "5px",
                    marginTop: "5px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                  }}
                >
                  {selectedOrder._id}
                </div>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>
                  <strong>Tên khách hàng:</strong>
                </label>
                <div
                  style={{
                    width: "100%",
                    padding: "5px",
                    marginTop: "5px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                  }}
                >
                  {selectedOrder.customerName}
                </div>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>
                  <strong>Số KM:</strong>
                </label>
                <input
                  type="number"
                  value={selectedOrder.distance}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      distance: e.target.value,
                    })
                  }
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>
                  <strong>Giá:</strong>
                </label>
                <input
                  type="number"
                  value={selectedOrder.totalAmount}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      totalAmount: e.target.value,
                    })
                  }
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>
                  <strong>Trạng thái:</strong>
                </label>
                <select
                  value={selectedOrder.statusOrder}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      statusOrder: e.target.value,
                    })
                  }
                  style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#d9534f",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#5cb85c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
