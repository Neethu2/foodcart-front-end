import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DashboardIcon from "@mui/icons-material/Dashboard";

const SIDEBAR_WIDTH = 280;

const Sidebar = () => {
  const location = useLocation();

  const navMenu = [
    { id: 0, label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { id: 1, label: "Home", path: "/dashboard/home", icon: <HomeIcon /> },
    { id: 2, label: "Movies", path: "/dashboard/movies", icon: <MovieIcon /> },
    { id: 3, label: "TV Shows", path: "/dashboard/tvshows", icon: <TvIcon /> },
    {
      id: 4,
      label: "Favorites",
      path: "/dashboard/favorites",
      icon: <FavoriteIcon />,
    },
    {
      id: 5,
      label: "Watchlist",
      path: "/dashboard/watchlist",
      icon: <BookmarkIcon />,
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {/* Toolbar spacing to account for fixed header */}
      <Toolbar />

      {/* Sidebar Header */}
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Navigation
        </Typography>
      </Box>

      <Divider />

      {/* Navigation List */}
      <List sx={{ pt: 1 }}>
        {navMenu.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.id} disablePadding sx={{ px: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  bgcolor: isActive ? "primary.main" : "transparent",
                  color: isActive ? "primary.contrastText" : "text.primary",
                  "&:hover": {
                    bgcolor: isActive ? "primary.dark" : "action.hover",
                  },
                  "& .MuiListItemIcon-root": {
                    color: isActive ? "primary.contrastText" : "text.secondary",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mt: 2 }} />

      {/* Footer section of sidebar */}
      <Box sx={{ mt: "auto", p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Movie & TV Manager v1.0
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
