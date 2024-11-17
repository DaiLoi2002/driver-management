import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function useAuthViewModel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);  // Thêm biến loading để chờ kiểm tra token
  const navigate = useNavigate();

  const checkToken = () => {
    const token = localStorage.getItem('token');
    console.log(token);

    if (token) {
      setIsAuthenticated(true); // Nếu có token, thì xác thực là true
    } else {
      setIsAuthenticated(false); // Nếu không có token, thì xác thực là false
      navigate('/login'); // Chuyển hướng đến trang login nếu không có token
    }
    setLoading(false); // Đánh dấu là đã kiểm tra xong
  };

  useEffect(() => {
    checkToken();
  }, []); // Chạy một lần khi component được render lần đầu tiên

  return { isAuthenticated, loading };
}

export default useAuthViewModel;

