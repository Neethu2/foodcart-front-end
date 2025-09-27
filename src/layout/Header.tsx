import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Header = () => {
  return (
    <>
      <AppBar position="static">
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
          <Typography variant="h1" component="div">
            Dashboard
          </Typography>
          <Button color="primary">Logout</Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
