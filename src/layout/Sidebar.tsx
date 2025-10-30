import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const navMenu = [
    { id: 0, label: "Home", path: "/dashboard/home" },
    { id: 1, label: "Movies", path: "/dashboard/movies" },
    { id: 2, label: "TV Shows", path: "/dashboard/tvshows" },
    { id: 3, label: "Watchlist", path: "/dashboard/watchlist" },
    { id: 4, label: "Favorites", path: "/dashboard/favorites" },
  ];
  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: 200,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 200,
            boxSizing: "border-box",
            top: 64, // Height of the AppBar
            height: "calc(100vh - 64px)",
            position: "fixed",
          },
        }}
      >
        <List>
          {navMenu.map((item) => {
            return (
              <ListItem
                component={Link}
                to={item.path}
                key={item.id}
                className={`sidebar-item ${
                  window.location.pathname === item.path ? "selected" : ""
                }`}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
