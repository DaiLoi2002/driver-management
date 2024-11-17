import React, { useState } from 'react';
import'/Users/ttcenter/Manager_LT_Driver/driver-management/src/view/Authen.js/Login.css'

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const validateForm = (e) => {
    e.preventDefault();
    let isValid = true;

    // Kiểm tra email
    if (email === '') {
      setEmailError('Email can\'t be blank');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Kiểm tra mật khẩu
    if (password === '') {
      setPasswordError('Password can\'t be blank');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  return (
    <div className="wrapper">
      <header>Login Form</header>
      <form onSubmit={validateForm}>
        <div className="field email">
          <div className="input-area">
            <input
              type="text"
              id="email"
              placeholder="Email Address"
              value={email}
              onChange={handleEmailChange}
            />
            <i className="icon fas fa-envelope"></i>
            <i className="error error-icon fas fa-exclamation-circle"></i>
          </div>
          {emailError && <div className="error error-txt">{emailError}</div>}
        </div>
        <div className="field password">
          <div className="input-area">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <i className="icon fas fa-lock"></i>
            <i className="error error-icon fas fa-exclamation-circle"></i>
          </div>
          {passwordError && <div className="error error-txt">{passwordError}</div>}
        </div>
        <div className="pass-txt"><a href="#">Forgot password?</a></div>
        <input type="submit" value="Login" />
      </form>
      <div className="sign-txt">Not yet a member? <a href="#">Signup now</a></div>
    </div>
  );
  
}

export default LoginScreen;
