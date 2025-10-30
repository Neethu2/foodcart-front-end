import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import {
  Movie as MovieIcon,
  Tv as TvIcon,
  Favorite as FavoriteIcon,
  PlaylistPlay as WatchlistIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMediaData } from "../hooks/useMediaData";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { getMovies, getTVShows, getFavorites } = useMediaData();

  const movies = getMovies();
  const tvShows = getTVShows();
  const favorites = getFavorites();

  const stats = [
    {
      title: "Total Movies",
      value: movies.length,
      icon: <MovieIcon sx={{ fontSize: 40 }} />,
      color: "#1976d2",
      action: () => navigate("/dashboard/movies"),
    },
    {
      title: "Total TV Shows",
      value: tvShows.length,
      icon: <TvIcon sx={{ fontSize: 40 }} />,
      color: "#388e3c",
      action: () => navigate("/dashboard/tvshows"),
    },
    {
      title: "Favorites",
      value: favorites.length,
      icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
      color: "#d32f2f",
      action: () => navigate("/dashboard/favorites"),
    },
    {
      title: "Watchlist",
      value: movies.length + tvShows.length - favorites.length,
      icon: <WatchlistIcon sx={{ fontSize: 40 }} />,
      color: "#f57c00",
      action: () => navigate("/dashboard/watchlist"),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to MovieHub
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Your personal movie and TV show collection manager
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Organize, track, and discover your favorite entertainment content all
          in one place.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Card
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
              },
            }}
            onClick={stat.action}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ color: stat.color, mr: 2 }}>{stat.icon}</Box>
                <Box>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  stat.action();
                }}
              >
                View All
              </Button>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
