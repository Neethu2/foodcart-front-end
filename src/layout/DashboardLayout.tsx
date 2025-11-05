import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

const HEADER_HEIGHT = 64;

const DashboardLayout = () => {
  return (
    <div>
      {/* Header - Full width at top */}
      <Header />

      {/* Main layout container */}
      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Sidebar - Fixed position on left */}
        <Sidebar />

        {/* Main content area - Starts after sidebar */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 3,
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Footer - Full width at bottom */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
