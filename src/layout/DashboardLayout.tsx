import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <>
      <div>
        <Header />
        <div>
          <Sidebar />
          <main>
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DashboardLayout;
