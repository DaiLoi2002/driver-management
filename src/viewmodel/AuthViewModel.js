import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useAuthViewModel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkToken = () => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (token) {
      setIsAuthenticated(true);
      navigate("/");
    } else {
      setIsAuthenticated(false);
      navigate("/login");
    }
    setLoading(false);
  };

  useEffect(() => {
    checkToken();
    const handleStorageChange = () => {
      checkToken();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return { isAuthenticated, loading };
}

export default useAuthViewModel;
