import React, { useState, useEffect } from "react";
import Driver from "/Users/ttcenter/Manager_LT_Driver/driver-management/src/model/DriverModel.js";
import DriverViewModel from "../../viewmodel/DriverViewModel";
import "/Users/ttcenter/Manager_LT_Driver/driver-management/src/view/Driver/DriverList.css"; // Đảm bảo đường dẫn đúng

const DriverList = () => {
  const [drivers, setDrivers] = useState([new Driver()]);
  const [newDriver, setNewDriver] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    email: "",
    password: "",
    statusAccout: "",
    role: "driver",
    type: "driver",
    licenseNumber: "",
    licenseExpiryDate: "",
    vehicle: {
      payloadCapacity: "",
      inspectionExpiryDate: "",
    },
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState([new Driver()]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [currentDriver, setCurrentDriver] = useState(null);
  const driverViewModel = new DriverViewModel();

  const [imageURL, setImageURL] = useState("");
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Lưu file vào trạng thái currentDriver
      setCurrentDriver({
        ...currentDriver,
        image: file, // Lưu file trực tiếp
      });

      // Tạo URL tạm thời để hiển thị ảnh
      const objectURL = URL.createObjectURL(file);
      setImageURL(objectURL); // Cập nhật URL tạm thời vào trạng thái
    }
  };
  const fetchDrivers = async () => {
    try {
      const response = await driverViewModel.getDrivers();
      console.log("API Response:", response.data);

      if (Array.isArray(response.data)) {
        // Lấy tất cả tài xế mà không phân loại
        const allDrivers = response.data.map((driver) => ({
          ...Driver.fromApiResponse(driver),
          id: driver._id,
        }));

        // Lưu tất cả tài xế vào state
        setDrivers(allDrivers);

        console.log("All Drivers:", allDrivers);
      } else {
        console.error("Unexpected API response structure:", response.data);
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleAddDriver = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    console.log("New Driver Data:", newDriver);
    try {
      const addedDriver = await driverViewModel.addDriver(newDriver);
      if (
        addedDriver &&
        addedDriver.statusCode === 200 &&
        addedDriver.message === "Driver thêm thành công"
      ) {
        setNewDriver(
          new Driver(
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            { payloadCapacity: "", inspectionExpiryDate: "" },
            "",
            ""
          )
        );
        window.alert("Thêm tài xế thành công!");
        fetchDrivers();
      } else {
        alert(
          `Có lỗi xảy ra khi thêm tài xế: ${
            addedDriver.message || "Không có thông điệp lỗi"
          }`
        );
      }
    } catch (error) {
      console.error("Error adding driver:", error);
      handleError(error);
    }
  };

  const handleDeleteDriver = async (id) => {
    // Sử dụng window.confirm để xác nhận hành động xóa
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa tài xế này?");

    if (isConfirmed) {
      console.log("Xóa tài xế với ID:", id);
      try {
        const response = await driverViewModel.removeDriver(id);
        if (response && response.statusCode === 200) {
          window.alert("Xóa tài xế thành công!");
          // Gọi fetchDrivers để làm mới danh sách tài xế
          setDrivers(drivers.filter((driver) => driver.id !== id));
          await fetchDrivers();
        } else {
          alert(
            `Có lỗi xảy ra khi xóa tài xế: ${
              response.message || "Không có thông điệp lỗi"
            }`
          );
        }
      } catch (error) {
        console.error("Error deleting driver:", error);
        alert("Có lỗi xảy ra khi xóa tài xế: " + error.message);
      }
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Log thông tin tài xế đang cập nhật
    console.log("Thông tin tài xế đang cập nhật:", currentDriver);

    // Hiển thị hộp thoại xác nhận
    const confirmation = window.confirm(
      `Bạn có chắc chắn muốn cập nhật tài xế với những thông tin sau?\n\n` +
        `Tên tài xế: ${currentDriver.fullName}\n` +
        `Số Giấy phép lái xe: ${currentDriver.licenseNumber}\n` +
        `Ngày hết hạn giấy phép: ${currentDriver.licenseExpiryDate}\n` +
        `Số điện thoại: ${currentDriver.phoneNumber}\n` +
        `Email: ${currentDriver.email}\n` +
        `Địa chỉ: ${currentDriver.address}\n` +
        `Tải trọng: ${currentDriver.vehicle?.payloadCapacity}\n` +
        `Ngày hết hạn kiểm tra: ${currentDriver.vehicle?.inspectionExpiryDate}`
    );

    // Nếu người dùng xác nhận, tiến hành cập nhật tài xế
    if (confirmation) {
      try {
        // Kiểm tra nếu có thay đổi ảnh, chỉ khi đó mới tải ảnh lên
        if (imageURL && imageURL !== currentDriver.image) {
          try {
            const formData = new FormData();
            formData.append("image", currentDriver.image); // Sử dụng imageURL thay vì currentDriver.image
            formData.append("type", "drivers"); // Đặt type cứng là customer
            formData.append("id", currentDriver.id); // Thêm id của tài xế

            // Gọi phương thức updateImage từ ViewModel để cập nhật hình ảnh
            console.log("Nội dung FormData:");
            for (let pair of formData.entries()) {
              console.log(pair[0] + ": ", pair[1]);
            }
            const updatedImageResponse = await driverViewModel.updateImage(
              formData
            );
            console.log(
              "Phản hồi từ API sau khi cập nhật hình ảnh:",
              updatedImageResponse
            );
          } catch (error) {
            console.error("Error updating driver image:", error);
            alert("Có lỗi xảy ra khi cập nhật hình ảnh: " + error.message);
            return; // Dừng lại nếu có lỗi khi cập nhật hình ảnh
          }
        }

        // Cập nhật thông tin tài xế (không cần ảnh nếu không thay đổi ảnh)
        const updatedDriver = await driverViewModel.updateDriver(currentDriver);

        // Log phản hồi từ API
        console.log("Phản hồi từ API:", updatedDriver);
        alert(
          "Cập nhật tài xế thành công: " +
            (updatedDriver.message || "Không có thông điệp lỗi")
        );

        // Reset form và tải lại danh sách tài xế
        resetForm();
        setImageURL("");
        fetchDrivers();
        setShowModal(false);
      } catch (error) {
        console.error("Error updating driver:", error);
        alert("Có lỗi xảy ra khi cập nhật tài xế: " + error.message); // Hiển thị thông báo lỗi
      }
    } else {
      // Nếu người dùng không xác nhận, không làm gì cả
      console.log("Cập nhật tài xế bị hủy.");
    }
  };

  const resetForm = () => {
    setCurrentDriver(
      new Driver(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        { payloadCapacity: "", inspectionExpiryDate: "" },
        "",
        ""
      )
    );
    // setIsUpdating(false);
    // setCurrentDriverId(null);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Chuyển đổi chuỗi ngày thành đối tượng Date
    const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày và đảm bảo có 2 chữ số
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng và đảm bảo có 2 chữ số
    const year = date.getFullYear(); // Lấy năm

    return `${day}/${month}/${year}`; // Trả về định dạng dd/mm/yyyy
  };

  const handleRowClick = (driver) => {
    console.log(driver);
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDriver(null);
  };

  const handleError = (error) => {
    if (error.response) {
      console.log("Error response:", error.response);
      const { error: errorMessage } = error.response.data;
      alert(`Có lỗi xảy ra: ${errorMessage}`);
    } else {
      alert("Có lỗi xảy ra: " + error.message);
    }
  };

  // Hàm mở form
  const openForm = () => {
    setIsFormOpen(true);
  };
  const openModal = (driver) => {
    const formattedDriver = {
      ...driver,
      licenseExpiryDate: new Date(driver.licenseExpiryDate)
        .toISOString()
        .split("T")[0],
      vehicle: {
        ...driver.vehicle,
        inspectionExpiryDate: new Date(driver.vehicle.inspectionExpiryDate)
          .toISOString()
          .split("T")[0],
      },
    };

    setCurrentDriver(formattedDriver); // Lưu thông tin tài xế

    setShowModal(true); // Mở modal
  };
  const closeModal = (driver) => {
    setImageURL("");
    setShowModal(false); // Mở modal
  };

  return (
    <div className="">
      <div className="">
        <div className="table-wrapper">
          <div style={{ padding: "20px" }}>
            <div
              className="row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="col-sm-6" style={{ flex: 1 }}>
                <h2>
                  Danh sách <b>Tài xế</b>
                </h2>
              </div>
              <div className="col-sm-6" style={{ textAlign: "right" }}>
                <button
                  className="btn btn-success"
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginLeft: "10px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                  }}
                  onClick={openForm}
                >
                  <i
                    className="material-icons"
                    style={{ verticalAlign: "middle", marginRight: "5px" }}
                  >
                    &#xE147;
                  </i>
                  <span>Thêm tài xế</span>
                </button>
                <button
                  className="btn btn-danger"
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginLeft: "10px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                  }}
                >
                  <i
                    className="material-icons"
                    style={{ verticalAlign: "middle", marginRight: "5px" }}
                  >
                    &#xE15C;
                  </i>
                  <span>Xóa tài xế</span>
                </button>
              </div>
            </div>
          </div>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Số thứ tự</th>
                <th>Tên tài xế</th>
                <th>Số điện thoại</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver, index) => (
                <tr key={driver._id} onClick={() => handleRowClick(driver)}>
                  <td>{index + 1}</td> {/* Thêm số thứ tự */}
                  <td>
                    {/* Thêm ảnh */}

                    {driver.fullName}
                  </td>
                  <td>{driver.phoneNumber}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn sự kiện click của dòng bị kích hoạt
                        openModal(driver); // Mở modal khi nhấn nút "Sửa"
                      }}
                    >
                      <i className="fas fa-pencil-alt"></i>{" "}
                      {/* Icon cây bút (pencil) */}
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn sự kiện click của dòng bị kích hoạt
                        handleDeleteDriver(driver.id); // Gọi hàm xóa tài xế
                      }}
                    >
                      <i className="fas fa-trash-alt"></i>{" "}
                      {/* Icon thùng rác (trash) */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Modal cập nhật */}

          {isModalOpen && selectedDriver && (
            <div
              className="modal"
              style={{
                display: "block",
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
                overflow: "auto",
              }}
            >
              <div
                className="modal-content"
                style={{
                  position: "relative",
                  margin: "10% auto",
                  padding: "20px",
                  backgroundColor: "white",
                  maxWidth: "500px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  overflowY: "auto",
                }}
              >
                <span
                  onClick={handleCloseModal}
                  style={{
                    fontSize: "30px",
                    fontWeight: "bold",
                    color: "#aaa",
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => (e.target.style.color = "black")} // Change color on hover
                  onMouseOut={(e) => (e.target.style.color = "#aaa")} // Reset color when not hovering
                >
                  &times;
                </span>
                <h2
                  style={{
                    textAlign: "center",
                    marginBottom: "20px",
                    fontSize: "24px",
                    color: "#333",
                  }}
                >
                  Chi tiết tài xế
                </h2>
                <img
                  src={selectedDriver.image}
                  alt="Driver"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />

                <p
                  style={{ fontSize: "16px", lineHeight: "1.6", color: "#555" }}
                >
                  <strong>Tên tài xế:</strong> {selectedDriver.fullName}
                </p>
                <p
                  style={{ fontSize: "16px", lineHeight: "1.6", color: "#555" }}
                >
                  <strong>Số điện thoại:</strong> {selectedDriver.phoneNumber}
                </p>
                <p
                  style={{ fontSize: "16px", lineHeight: "1.6", color: "#555" }}
                >
                  <strong>Số giấy phép lái xe:</strong>{" "}
                  {selectedDriver.licenseNumber}
                </p>
                <p
                  style={{ fontSize: "16px", lineHeight: "1.6", color: "#555" }}
                >
                  <strong>Ngày hết hạn lái xe:</strong>{" "}
                  {formatDate(selectedDriver.licenseExpiryDate)}
                </p>
                <p
                  style={{ fontSize: "16px", lineHeight: "1.6", color: "#555" }}
                >
                  <strong>Địa chỉ email:</strong> {selectedDriver.email}
                </p>
                <p
                  style={{ fontSize: "16px", lineHeight: "1.6", color: "#555" }}
                >
                  <strong>Địa chỉ:</strong> {selectedDriver.address}
                </p>
                <p
                  style={{ fontSize: "16px", lineHeight: "1.6", color: "#555" }}
                >
                  <strong>Trạng thái tài khoản:</strong>{" "}
                  {selectedDriver.statusAccout}
                </p>
                <p
                  style={{ fontSize: "16px", lineHeight: "1.6", color: "#555" }}
                >
                  <strong>Ngày tạo:</strong>{" "}
                  {formatDate(selectedDriver.createdAt)}
                </p>
                <p
                  style={{ fontSize: "16px", lineHeight: "1.6", color: "#555" }}
                >
                  <strong>Ngày sửa:</strong>{" "}
                  {formatDate(selectedDriver.updatedAt)}
                </p>
              </div>
            </div>
          )}
          {isFormOpen && (
            <form onSubmit={handleAddDriver}>
              <h3>{"Thêm tài xế mới"}</h3>
              <div>
                <span
                  style={{ color: "#999", display: "block", textAlign: "left" }}
                >
                  Tên tài xế
                </span>
                <input
                  type="text"
                  value={newDriver.fullName}
                  onChange={(e) =>
                    setNewDriver({ ...newDriver, fullName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <span
                  style={{ color: "#999", display: "block", textAlign: "left" }}
                >
                  Số Giấy phép lái xe
                </span>
                <input
                  type="text"
                  value={newDriver.licenseNumber}
                  onChange={(e) =>
                    setNewDriver({
                      ...newDriver,
                      licenseNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <span
                  style={{ color: "#999", display: "block", textAlign: "left" }}
                >
                  Ngày hết hạn giấy phép
                </span>
                <input
                  type="date"
                  value={newDriver.licenseExpiryDate}
                  onChange={(e) =>
                    setNewDriver({
                      ...newDriver,
                      licenseExpiryDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <span
                  style={{ color: "#999", display: "block", textAlign: "left" }}
                >
                  Số điện thoại
                </span>

                <input
                  type="text"
                  value={newDriver.phoneNumber}
                  onChange={(e) =>
                    setNewDriver({ ...newDriver, phoneNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <span
                  style={{ color: "#999", display: "block", textAlign: "left" }}
                >
                  Mật khẩu
                </span>
                <input
                  type="password"
                  value={newDriver.password}
                  onChange={
                    (e) =>
                      setNewDriver({ ...newDriver, password: e.target.value }) // Cập nhật giá trị khi người dùng nhập
                  }
                  required
                  placeholder="Nhập mật khẩu"
                />
              </div>

              <div>
                <span
                  style={{ color: "#999", display: "block", textAlign: "left" }}
                >
                  Email
                </span>

                <input
                  type="email"
                  value={newDriver.email}
                  onChange={(e) =>
                    setNewDriver({ ...newDriver, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <span
                  style={{ color: "#999", display: "block", textAlign: "left" }}
                >
                  Địa chỉ
                </span>

                <input
                  type="text"
                  value={newDriver.address}
                  onChange={(e) =>
                    setNewDriver({ ...newDriver, address: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <span
                  style={{ color: "#999", display: "block", textAlign: "left" }}
                >
                  Tải trọng
                </span>

                <input
                  type="number"
                  value={newDriver.vehicle?.payloadCapacity || ""}
                  onChange={(e) =>
                    setNewDriver({
                      ...newDriver,
                      vehicle: {
                        ...newDriver.vehicle,
                        payloadCapacity: Number(e.target.value),
                      },
                    })
                  }
                  required
                />
              </div>

              <div>
                <span
                  style={{ color: "#999", display: "block", textAlign: "left" }}
                >
                  Chọn ngày hết hạn kiểm tra
                </span>

                <input
                  type="date"
                  value={newDriver.vehicle?.inspectionExpiryDate || ""}
                  onChange={(e) =>
                    setNewDriver({
                      ...newDriver,
                      vehicle: {
                        ...newDriver.vehicle,
                        inspectionExpiryDate: e.target.value,
                      },
                    })
                  }
                  required
                />
              </div>
              <div style={{ marginTop: "20px", textAlign: "right" }}>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)} // Nút đóng form
                  style={{
                    marginRight: "10px",
                    padding: "10px 15px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Đóng
                </button>

                <button
                  type="submit"
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  {"Thêm tài xế"}
                </button>
              </div>
            </form>
          )}

          {showModal && currentDriver && (
            <div
              className="modal"
              style={{
                display: "block",
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000,
                overflow: "auto",
              }}
            >
              <div
                className="modal-content"
                style={{
                  position: "relative",
                  margin: "10% auto",
                  padding: "20px",
                  backgroundColor: "white",
                  maxWidth: "500px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  overflowY: "auto",
                }}
              >
                <span
                  onClick={closeModal}
                  style={{
                    fontSize: "30px",
                    fontWeight: "bold",
                    color: "#aaa",
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => (e.target.style.color = "black")}
                  onMouseOut={(e) => (e.target.style.color = "#aaa")}
                >
                  &times;
                </span>
                <h2
                  style={{
                    textAlign: "center",
                    marginBottom: "20px",
                    fontSize: "24px",
                    color: "#333",
                  }}
                >
                  Sửa tài xế
                </h2>
                <form
                  onSubmit={handleUpdateSubmit}
                  style={{ fontSize: "16px", color: "#555" }}
                >
                  <div
                    style={{
                      padding: "20px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                    }}
                  >
                    {/* Áp dụng style chung cho input */}
                    <style>
                      {`
                      .input-field {
                        width: 100%;
                        padding: 8px;
                        margin-top: 5px;
                        box-sizing: border-box;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                      }
                    `}
                    </style>
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                      {/* Kiểm tra nếu có ảnh đã chọn (imageURL) thì hiển thị ảnh đó, nếu không thì hiển thị ảnh tài xế */}
                      {imageURL ? (
                        <div>
                          <img
                            src={imageURL}
                            alt="Selected file"
                            style={{ maxWidth: "300px", maxHeight: "300px" }}
                          />
                        </div>
                      ) : (
                        currentDriver.image && (
                          <div>
                            <img
                              src={currentDriver.image}
                              alt="Driver"
                              style={{
                                width: "150px",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        )
                      )}
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <label>
                        <strong>Tên tài xế:</strong>
                        <input
                          type="text"
                          value={currentDriver.fullName}
                          onChange={(e) =>
                            setCurrentDriver({
                              ...currentDriver,
                              fullName: e.target.value,
                            })
                          }
                          className="input-field"
                        />
                      </label>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <label>
                        <strong>Số giấy phép lái xe:</strong>
                        <input
                          type="text"
                          value={currentDriver.licenseNumber}
                          onChange={(e) =>
                            setCurrentDriver({
                              ...currentDriver,
                              licenseNumber: e.target.value,
                            })
                          }
                          className="input-field"
                        />
                      </label>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <label>
                        <strong>Ngày hết hạn giấy phép:</strong>
                        <input
                          type="date"
                          value={currentDriver.licenseExpiryDate.split("T")[0]}
                          onChange={(e) =>
                            setCurrentDriver({
                              ...currentDriver,
                              licenseExpiryDate: e.target.value,
                            })
                          }
                          className="input-field"
                        />
                      </label>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <label>
                        <strong>Số điện thoại:</strong>
                        <input
                          type="text"
                          value={currentDriver.phoneNumber}
                          onChange={(e) =>
                            setCurrentDriver({
                              ...currentDriver,
                              phoneNumber: e.target.value,
                            })
                          }
                          className="input-field"
                        />
                      </label>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <label>
                        <strong>Email:</strong>
                        <input
                          type="email"
                          value={currentDriver.email}
                          onChange={(e) =>
                            setCurrentDriver({
                              ...currentDriver,
                              email: e.target.value,
                            })
                          }
                          className="input-field"
                        />
                      </label>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <label>
                        <strong>Địa chỉ:</strong>
                        <input
                          type="text"
                          value={currentDriver.address}
                          onChange={(e) =>
                            setCurrentDriver({
                              ...currentDriver,
                              address: e.target.value,
                            })
                          }
                          className="input-field"
                        />
                      </label>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <label>
                        <strong>Tải trọng:</strong>
                        <input
                          type="number"
                          value={currentDriver.vehicle.payloadCapacity}
                          onChange={(e) =>
                            setCurrentDriver({
                              ...currentDriver,
                              vehicle: {
                                ...currentDriver.vehicle,
                                payloadCapacity: Number(e.target.value),
                              },
                            })
                          }
                          className="input-field"
                        />
                      </label>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <label>
                        <strong>Ngày hết hạn kiểm tra:</strong>
                        <input
                          type="date"
                          value={
                            currentDriver.vehicle.inspectionExpiryDate.split(
                              "T"
                            )[0]
                          }
                          onChange={(e) =>
                            setCurrentDriver({
                              ...currentDriver,
                              vehicle: {
                                ...currentDriver.vehicle,
                                inspectionExpiryDate: e.target.value,
                              },
                            })
                          }
                          className="input-field"
                        />
                      </label>
                    </div>

                    {/* Trường tải ảnh */}
                    <div>
                      <div style={{ marginBottom: "10px" }}>
                        <label>
                          <strong>Chọn ảnh:</strong>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="input-field"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button
                      type="submit"
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#007BFF",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverList;
