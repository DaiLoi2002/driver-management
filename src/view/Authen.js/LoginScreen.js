import React, { useState } from "react";
import "/Users/ttcenter/Manager_LT_Driver/driver-management/src/view/Authen.js/Login.css";
import CustomerViewModel from "/Users/ttcenter/Manager_LT_Driver/driver-management/src/viewmodel/CustomerViewModel.js";
import { useNavigate } from "react-router-dom";
function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState(""); // Thêm state để lưu thông báo lỗi khi đăng nhập
  const navigate = useNavigate();
  const customerViewModel = new CustomerViewModel();

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Kiểm tra tính hợp lệ của form
    if (!validateForm()) {
      return; // Dừng lại nếu form không hợp lệ
    }

    try {
      // Gọi phương thức loginAdmin từ customerViewModel với phoneNumber và password
      const response = await customerViewModel.loginAdmin(
        phoneNumber,
        password
      );

      // Kiểm tra phản hồi từ API
      if (response && response.statusCode === 200) {
        // Nếu đăng nhập thành công
        console.log("Đăng nhập thành công:", response.message);

        // Lưu token vào localStorage hoặc Redux (hoặc bất kỳ nơi nào bạn cần)
        localStorage.setItem("token", response.token);

        navigate("/");
      } else {
        // Nếu có lỗi khi đăng nhập (ví dụ: sai thông tin đăng nhập)
        setLoginError(response.message || "Đăng nhập thất bại");
        console.error("Lỗi đăng nhập:", response.message);
      }
    } catch (error) {
      // Xử lý lỗi nếu có (ví dụ: lỗi mạng, lỗi server)
      setLoginError("Lỗi khi gọi API: " + error.message);
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const validateForm = () => {
    let isValid = true;

    // Kiểm tra số điện thoại
    if (phoneNumber === "") {
      setPhoneError("Phone number can't be blank");
      isValid = false;
    } else {
      setPhoneError("");
    }

    // Kiểm tra mật khẩu
    if (password === "") {
      setPasswordError("Password can't be blank");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  return (
    <div className="wrapper">
      <header>Login Form</header>
      <form onSubmit={handleLogin}>
        <div className="field phoneNumber">
          <div className="input-area">
            <input
              type="text"
              id="phoneNumber"
              placeholder="ex:84123456789"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
            <i className="icon fas fa-phone"></i>
            <i className="error error-icon fas fa-exclamation-circle"></i>
          </div>
          {phoneError && <div className="error error-txt">{phoneError}</div>}
        </div>
        <div className="field password">
          <div className="input-area">
            <input
              type="password"
              id="password"
              placeholder="ex:123456"
              value={password}
              onChange={handlePasswordChange}
            />
            <i className="icon fas fa-lock"></i>
            <i className="error error-icon fas fa-exclamation-circle"></i>
          </div>
          {passwordError && (
            <div className="error error-txt">{passwordError}</div>
          )}
        </div>
        {loginError && <div className="error error-txt">{loginError}</div>}{" "}
        {/* Hiển thị lỗi đăng nhập */}
        <div className="pass-txt">
          <a href="#">Forgot password?</a>
        </div>
        <input type="submit" value="Login" />
      </form>
      <div className="sign-txt">
        Not yet a member? <a href="#">Signup now</a>
      </div>
    </div>
  );
}

export default LoginScreen;
