import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { appUrl } from "../../appurl";
import axios from "axios";
import Notification from "../../commonComponent/notification";
import image from "../../images/logo-houzez-color [Recovered]1.png";
import { api } from "../../polices/api/axiosConfig";
import { useAuth } from "../../polices/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    if (!formData.userName) newErrors.userName = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const onLoginSuccess = (response: any) => {
    setNotify({
      isOpen: true,
      type: "success",
      message: "You Signed In Successfully!",
    });
    setTimeout(() => {
      checkAuth();
      navigate("/forEvent/adminpanel");
      window.location.reload();
    }, 2000);
  };

  const onLoginError = (action: any) => {
    setNotify({
      isOpen: true,
      message: action,
      type: "error",
    });
    setTimeout(() => {}, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (isLocked) return; // Prevent further login attempts
    e.preventDefault();
    if (!validateForm()) return;
    api
      .post("admin/login/", formData)
      .then((response) => {
        onLoginSuccess(response.data);
        setAttempts(0); // Reset failed attempts
      })
      .catch((error) => {
        setAttempts((prev) => prev + 1);
        if (error.response.data.message == undefined) {
          onLoginError(error.response.data);
        } else onLoginError(error.response.data.message);

        if (attempts + 1 >= 3) {
          setIsLocked(true);
          setTimeout(() => {
            onLoginError("Too many attempts! Try again in 15 minutes.");
            setIsLocked(false);
            setAttempts(0);
          }, 15 * 60 * 1000); // Lock for 15 minutes
        }
      });
  };

  return (
    <>
      <div>
        <div className="login-container">
          <div className="login-illustration">
            <img src={image} alt="Login Image" />
          </div>

          <div className="login-form">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  className="input-field"
                  type="text"
                  name="userName"
                  placeholder="Username"
                  value={formData.userName}
                  onChange={handleChange}
                />
                {errors.userName && (
                  <span className="error">{errors.userName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  className="input-field"
                  type="text"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <span className="error">{errors.password}</span>
                )}
              </div>
              {isLocked == false ? (
                <button type="submit" className="login_unlocked">
                  Sign In
                </button>
              ) : (
                <button className="login_locked">Sign In Locked</button>
              )}

              {isLocked && (
                <p className="error">
                  Too many attempts! Try again in 15 minutes.
                </p>
              )}
            </form>
          </div>
        </div>
        <Notification notify={notify} setNotify={setNotify} />
      </div>
    </>
  );
};

export default Login;
