import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import NoPermission from "./components/noPermission";
import Layout from "./menu/layout";
import Home from "./main/index";
import AdminPanel from "./components/admin";
import ChangePassword from "./components/changePassword";
import Agents from "./components/agents";
import HeroSection from "./components/heroSection";
import "./css/style.css";
import "./css/media.query.css";
import "./App.css";
import { ProtectedRoute } from "./polices/ProtectedRoute";

function AppRoute() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="noPermission" element={<NoPermission />} />
        <Route path="forEvent" element={<ProtectedRoute component={Layout} />}>
          <Route path="adminPanel" element={<AdminPanel />} />
          <Route path="changePassword" element={<ChangePassword />} />
          <Route path="agents" element={<Agents />} />
          <Route path="managerMainSection" element={<HeroSection />} />
        </Route>
      </Routes>
    </div>
  );
}

export default AppRoute;
