import React, { useState, useEffect } from "react";
import { Table, Pagination, Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomerViewModel from "/Users/ttcenter/Manager_LT_Driver/driver-management/src/viewmodel/CustomerViewModel.js";
import * as XLSX from 'xlsx'; // Importing xlsx library
const CustomerScreen = () => {
  
  const usersPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [limit, setLimit] = useState(5); // Số khách mỗi trang
  const [error, setError] = useState(null); // Thông báo lỗi
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
    email: "",
    role: "customer",
    image: null,
    password: "", 
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState({
    customerId:"",
    fullName: "",
    address: "",
    phoneNumber: "",
    email: "",
    role: "customer",
    image: null,
    newimage:null,
    statusAccount: "active", // Giá trị mặc định
  });


const customerViewModel = new CustomerViewModel();



const handleLimitChange1 = (e) => {
  const value = e.target.value;
    
  // Kiểm tra xem giá trị có phải là rỗng không
  if (value === '') {
    setLimit(1); // Nếu rỗng thì đặt lại giá trị thành 1
  } else {
    // Nếu không rỗng, giới hạn giá trị từ 1 đến 99
    const numericValue = Math.max(1, Math.min(99, value));
    setLimit(numericValue);
  }
};



 
const fetchCustomers = async () => {
  try {
    setIsLoading(true);
    setError(null);

  
    const response = await customerViewModel.getCustomers(currentPage, limit);

    setCustomers(response.data); // Cập nhật danh sách khách hàng
   console.log(response.data)
   
   setTotalPages(response.pagination.totalPages); // Cập nhật số trang
   console.log(response.pagination.totalPages)
  } catch (err) {
    setError('Không thể tải danh sách khách hàng');
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};
useEffect(() => {
  fetchCustomers();
}, [currentPage, limit]); // Gọi lại khi `page` hoặc `limit` thay đổi

  const handleOpenModal = () => setShowModal(true);
  // Hàm đóng modal và reset form
  const handleCloseModal = () => {
    setShowModal(false);
    // Reset lại giá trị form
    setNewUser({
      fullName: "",
    address: "",
    phoneNumber: "",
    email: "",
    role: "customer",
  
    password: "", 
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
  
    // Helper functions for validation
    const validatePhoneNumber = (phoneNumber) => {
      // Kiểm tra số điện thoại Việt Nam: bắt đầu với +84 hoặc 0 và có 9 chữ số
      const regex = /^(?:\+84|0)\d{9}$/;
      return regex.test(phoneNumber.replace(/\s+/g, ''));
    };
  
    const validateEmail = (email) => {
      // Kiểm tra email có phải là địa chỉ Gmail hợp lệ không
      const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      return regex.test(email);
    };
  
    // Validation object to hold error messages
    const errors = {};
  
    // Kiểm tra số điện thoại
    if (name === "phoneNumber" && value && !validatePhoneNumber(value)) {
      errors.phoneNumber = "Phone number must start with +84 or 0 and be in the correct format.";
    }
  
    // Kiểm tra email
    if (name === "email" && value && !validateEmail(value)) {
      errors.email = "Email must be a valid Gmail address.";
    }
  
    // Xử lý đầu vào file
    if (type === "file") {
      const file = files[0];
      setNewUser((prevUser) => ({
        ...prevUser,
        image: file, // Lưu trực tiếp file vào state
      }));
    } else {
      setNewUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  
    // Cập nhật lỗi vào state
    setErrors(errors);
  };
  
  
const handleSaveEditUser = async () => {
  try {
    // Log thông tin khách hàng cần cập nhật
    console.log("Thông tin khách hàng cần cập nhật:", editUser);

    // Tạo đối tượng FormData để gửi dữ liệu
    const formData = new FormData();
    
    // Chỉ thêm hình ảnh nếu có hình ảnh mới
    if (editUser.image && editUser.image instanceof File) {
      formData.append('image', editUser.image);  // Đảm bảo rằng editUser.image là đối tượng File hợp lệ
    }
    
    formData.append('type', 'customer');  // Đặt type cứng là customer
    formData.append('id', editUser._id);  // Thêm id của khách hàng

    // Log formData để kiểm tra
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    // Cập nhật thông tin khách hàng (không có hình ảnh)
    await customerViewModel.updateCustomer(editUser);

    // // Cập nhật hình ảnh của khách hàng nếu có hình ảnh mới
    if (editUser.image && editUser.image instanceof File) {
      const imageResponse = await customerViewModel.updateImage(formData); 
      console.log("Cập nhật hình ảnh thành công:", imageResponse);
    }

    // Thông báo thành công
    alert("Thông tin khách hàng đã được cập nhật thành công!");

    // Đóng modal sau khi lưu thành công
    setShowEditModal(false);

    // Cập nhật lại danh sách khách hàng sau khi thay đổi
    fetchCustomers(); 

  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error updating customer:", error);
    alert("Lỗi khi cập nhật thông tin khách hàng.");
  }
};



  
  

const handleSaveUser = async () => {
  console.log(newUser); // Log đối tượng newUser

 

  try {
    const formData = new FormData();
    formData.append("fullName", newUser.fullName);
    formData.append("address", newUser.address);
    formData.append("phoneNumber", newUser.phoneNumber);
    formData.append("email", newUser.email);
    formData.append("role", newUser.role);
    formData.append("pass", newUser.password);
    
    if (newUser.image) {
      formData.append("image", newUser.image);
    }

    // Gọi hàm thêm khách hàng từ ViewModel
    const newCustomer = await customerViewModel.addCustomers(formData);  

    console.log("Customer added successfully:", newCustomer);
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
    handleCloseModal();
    alert("Đã thêm tài xế thành công!");
    fetchCustomers();
  } catch (error) {
    // Log chi tiết lỗi ra console
    console.error("Error saving customer:", error);

    // Truyền thông báo lỗi chi tiết ra ngoài
    const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi thực hiện thêm';
   
    // Kiểm tra mã lỗi và hiển thị thông báo tương ứng
    const errorStatusCode = error.response?.data?.statusCode || error.statusCode || 'Lỗi khi thực hiện thêm';
    
    // Nếu mã lỗi là 500, hiển thị thông báo Email đã có người đăng ký
    if (errorStatusCode === 500) {
      alert('Lỗi khi thực hiện thêm: Email đã có người đăng ký');
    } else {
      // Hiển thị thông báo lỗi mặc định hoặc lỗi từ API
      alert(`Lỗi khi thực hiện thêm: ${errorMessage} (Mã lỗi: ${errorStatusCode})`);
    }
  }
};

const handleEditCustomer = (customer) => {
  setEditUser(customer); // Gán thông tin khách hàng được chọn vào editUser
  setShowEditModal(true); // Mở modal chỉnh sửa
};


const handleDeleteCustomer = async (customerId) => {
  const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?");
  if (confirmDelete) {
    setIsLoading(true); // Start loading

    try {
      await customerViewModel.deleteCustomers(customerId); // Gọi API xóa khách hàng
      alert("Đã xóa khách hàng thành công!");

      // Cập nhật danh sách khách hàng sau khi xóa
      setCustomers((prevCustomers) => prevCustomers.filter((c) => c._id !== customerId));
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Lỗi khi xóa khách hàng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  }
};
const exportToExcel = () => {
  console.log(exportToExcel)
  // Create a worksheet from the customer data
  const ws = XLSX.utils.json_to_sheet(customers.map(customer => ({
    "Full Name": customer.fullName,
    "Address": customer.address || "N/A",
    "Phone Number": customer.phoneNumber || "N/A",
    "Email": customer.email || "N/A",
    "Status Account": customer.statusAccout || "N/A",
    "Role": customer.role || "N/A"
  })));

  // Create a workbook with the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Customers");

  // Export the workbook as an Excel file
  XLSX.writeFile(wb, "customers.xlsx");
};

  
  

const renderTable = (page) => {
  const start = (page - 1) * usersPerPage;
  const end = page * usersPerPage;

  // Đảm bảo customers là một mảng
  const paginatedCustomers = Array.isArray(customers) ? customers.slice(start, end) : [];

  return customers.map((customer, index) => (
    <tr key={customer._id?.$oid || index}>
      <td>{start + index + 1}</td>
      <td>
        <div className="media-container">
          {/* Hiển thị ảnh hoặc hình ảnh mặc định */}
          <img 
            src={customer.image || "/path/to/default-avatar.png"} 
            alt={customer.fullName || "Anonymous"} 
            className="avatar" 
          />
          <span>{customer.fullName || "Unknown"}</span>
        </div>
      </td>
      <td>{customer.address || "N/A"}</td>
      <td>{customer.phoneNumber || "N/A"}</td>
      <td>{customer.email || "N/A"}</td>
      <td>
        <span
          className={`status text-${
            customer.statusAccout === "active"
              ? "success"
              : customer.statusAccout === "inactive"
              ? "danger"
              : "warning"
          }`}
        >
          {customer.statusAccout || "unknown"}
        </span>
      </td>
      <td>{customer.role || "N/A"}</td>
      <td>
        <button 
          className="btn btn-secondary"
          onClick={() => customer._id && handleEditCustomer(customer)}
        >
          <i className="material-icons">&#xE8B8;</i> Settings
        </button>
        <button 
          className="btn btn-danger"
          onClick={() => customer._id && handleDeleteCustomer(customer._id)}
        >
          <i className="material-icons">&#xE5C9;</i> Delete
        </button>
      </td>
    </tr>
  ));
};

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Chỉ chấp nhận định dạng JPG và PNG!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước hình ảnh không được vượt quá 5MB!");
        return;
      }
       setEditUser({ ...editUser, image: file });



      // Cập nhật tệp ảnh và URL tạm thời
    // setEditUser({ 
    //   ...editUser, 
    //   image: URL.createObjectURL(file) // Tạo URL tạm thời cho ảnh
    // });
    }





  };
  const handleLimitChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setLimit(value); // Cập nhật số khách hàng mỗi trang
      setCurrentPage(1); // Quay lại trang đầu tiên khi thay đổi số lượng khách hàng mỗi trang
    }
  };
  
  const renderPagination = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>

          {i}
        </Pagination.Item>
      );
    }
  
    return pages;
  };
  
  

  const updateHintText = () => {
    // Kiểm tra nếu customers là mảng và không rỗng
    const totalEntries = Array.isArray(customers) ? customers.length : 0;
    
    // Nếu không có khách hàng, trả về thông báo mặc định
    if (totalEntries === 0) {
      return "No entries available.";
    }
  
    <input>
    
    </input>
  };
  

  return (
    <div className="">
      <div className="table-wrapper">
        <div className="table-title">
          <div className="row">
            <div className="col-sm-5">
              <h2>User <b>Management</b></h2>
            </div>
            <div className="col-sm-7 text-right">
              <button className="btn btn-secondary" onClick={handleOpenModal}>
                <i className="material-icons">&#xE147;</i> Add New User
              </button>
              <button className="btn btn-secondary" onClick={exportToExcel}>
                <i className="material-icons">&#xE24D;</i> Export to Excel
              </button>
            </div>
          </div>
        </div>
        <div style={{height: "700px"}}>
        <Table striped hover responsive>
  <thead>
    <tr>
      <th>#</th>
      <th>Full Name</th>
      <th>Address</th>
      <th>Phone Number</th>
      <th>Email</th>
      <th>Status Account</th>
      <th>Role</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
  {/* Hiển thị trạng thái loading nếu đang tải dữ liệu */}
  {isLoading ? (
    <tr>
      <td colSpan="8" className="text-center">
        <div className="loading-overlay">Loading...</div>
      </td>
    </tr>
  ) : (
    // Render dữ liệu khi không còn loading
    renderTable(currentPage)
  )}
</tbody>

        </Table>
        </div>
        

        <div className="clearfix">
          <div>
          <label htmlFor="limit">Hiển thị: </label>
      <input
        id="limit"
        type="number"
        min="1"
        max="99"
        value={limit}
        onChange={handleLimitChange1}
        className="form-control"
        style={{
          width: "60px",
          display: "inline-block",
          marginRight: "10px"
        }}
      />
        <label htmlFor="limit">người dùng trên 1 trang </label>
          </div>
        
            <div className="hint-text">{updateHintText()}</div> 
           <Pagination>{renderPagination()}</Pagination>
        </div>
      </div>

      {/* Modal thêm người dùng */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={newUser.fullName}
                onChange={handleInputChange}
                isInvalid={!!errors.fullName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={newUser.address}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={newUser.phoneNumber}
                onChange={handleInputChange}
                isInvalid={!!errors.phoneNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveUser}>
            Save User
          </Button>
        </Modal.Footer>
      </Modal>




      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
                
          <Form>

        <Form.Group controlId="editImage">
          <Form.Label>Avatar</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
          {editUser.image && (
            <img
              src={editUser.image} // Hiển thị URL tạm thời
              alt="Avatar"
              style={{
                maxWidth: "100px",
                marginTop: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          )}
        </Form.Group>


            <Form.Group controlId="editFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={editUser.fullName}
                onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="editAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={editUser.address}
                onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="editPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={editUser.phoneNumber}
                onChange={(e) => setEditUser({ ...editUser, phoneNumber: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="editEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="editStatusAccount">
              <Form.Label>Status Account</Form.Label>
              <Form.Control
                as="select"
                name="statusAccout"
                value={editUser.statusAccount} // Kiểm tra giá trị này là đúng
                onChange={(e) => {
                  const updatedValue = e.target.value;
                  setEditUser((prevEditUser) => ({
                    ...prevEditUser,
                    statusAccout: updatedValue,
                  }));
                }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="editRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={editUser.role}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>
            
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={() => handleSaveEditUser()}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default CustomerScreen;



