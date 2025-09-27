import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const navMenu = [
    { id: 0, label: "Home", path: "/dashboard/home" },
    { id: 1, label: "Menu", path: "/dashboard/menu" },
    { id: 2, label: "Cart", path: "/dashboard/cart" },
    { id: 3, label: "Checkout", path: "/dashboard/checkout" },
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
          },
        }}
      >
        <List>
          {navMenu.map((item) => {
            return (
              <ListItem component={Link} to={item.path} key={item.id}>
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
