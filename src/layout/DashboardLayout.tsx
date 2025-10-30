import { Outlet } from "react-router-dom";
import { Toolbar } from "@mui/material";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-content">
        <Header />

        <Sidebar />
        <main className="main-content">
          <Toolbar /> {/* This creates space below the fixed header */}
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
