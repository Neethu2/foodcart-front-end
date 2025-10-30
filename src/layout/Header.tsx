import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  const handleLogout = () => {
    // Clear authentication token and redirect to login page
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MovieHub Dashboard
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
