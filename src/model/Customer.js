class Customer {
    constructor(
      _id, 
      fullName, 
      address, 
      phoneNumber, 
      email, 
      image, 
      statusAccount, 
      role
    ) {
      this._id = _id;  // ID của khách hàng
      this.fullName = fullName;  // Tên đầy đủ
      this.address = address;  // Địa chỉ
      this.phoneNumber = phoneNumber;  // Số điện thoại
      this.email = email;  // Địa chỉ email
      this.image = image;  // Đường dẫn hình ảnh
      this.statusAccount = statusAccount;  // Trạng thái tài khoản (active, inactive, v.v.)
      this.role = role;  // Vai trò (customer, admin, v.v.)
    }
  
    // Phương thức để kiểm tra trạng thái tài khoản
    isActive() {
      return this.statusAccount === 'active';
    }
  
    // Phương thức để kiểm tra nếu email đã được cung cấp hay chưa
    isEmailProvided() {
      return this.email && this.email !== '';
    }
  
    // Phương thức để lấy thông tin khách hàng dưới dạng một đối tượng
    toObject() {
      return {
        _id: this._id,
        fullName: this.fullName,
        address: this.address,
        phoneNumber: this.phoneNumber,
        email: this.email,
        image: this.image,
        statusAccount: this.statusAccount,
        role: this.role
      };
    }
  }
  
 
  export default Customer;

  