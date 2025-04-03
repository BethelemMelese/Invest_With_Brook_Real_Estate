import { useState } from "react";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import image from "../images/Events-amico-purpule.png";
import { api } from "../polices/api/axiosConfig";

const TopBar = ({ ...props }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  const onLogout = () => {
    api.post("admin/logout").then((response) => {
      // window.location.href = "/login";
    });
  };

  return (
    <div>
      <section className="header-section">
        <div className="header-content">
          <div className="header-title">
            <h2>Grand Habesha Business Event</h2>
            <p>
              Expand your network and grow your business with industry leaders.
            </p>
          </div>
          <div className="header-image">
            <img src={image} alt="Business Event" />
          </div>
        </div>
        <div className="navbar-content">
          <div className="nav-bar">
            <nav className="main-nav-menu">
              <ul className={`nav-item-menu ${isOpen ? "open" : ""}`}>
                <li>
                  <NavLink
                    to="/forEvent/adminPanel"
                    className="nav-item"
                    onClick={toggleMenu}
                  >
                    Participant
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/forEvent/speakers"
                    className="nav-item"
                    onClick={toggleMenu}
                  >
                    Manager Speakers
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/forEvent/managerMainSection"
                    className="nav-item"
                    onClick={toggleMenu}
                  >
                    Manage Hero Section
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/forEvent/changePassword"
                    className="nav-item"
                    onClick={toggleMenu}
                  >
                    Change Password
                  </NavLink>
                </li>
                {localStorage.getItem("role") !== "Customer" && (
                  <li className="account">
                    <NavLink
                      to="/login"
                      className="nav-item account"
                      onClick={onLogout}
                      style={{ color: "#ff7f16" }}
                    >
                      LogOut
                    </NavLink>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </section>
      <section className="main-section">
        <div>
          <main className="container">
            <Outlet />
            {props.children}
          </main>
        </div>
      </section>
    </div>
  );
};

export default TopBar;
