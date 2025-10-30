import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Toolbar,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  PlaylistAdd as WatchlistIcon,
} from "@mui/icons-material";
import { useMediaData } from "../hooks/useMediaData";
import MediaTable from "../components/MediaTable";
import MediaForm from "../components/MediaForm";
import type { MediaEntry, MediaFormData } from "../types";

const Watchlist: React.FC = () => {
  const {
    loading,
    updateMediaEntry,
    deleteMediaEntry,
    toggleFavorite,
    loadMore,
    mediaList,
  } = useMediaData();

  const [editingEntry, setEditingEntry] = useState<MediaEntry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [filterType, setFilterType] = useState("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // For this demo, we'll consider "watchlist" as items that are NOT favorites
  // In a real app, you might have a separate watchlist property
  const watchlistItems = mediaList.filter((entry) => !entry.isFavorite);

  // Apply filters
  const filteredData = watchlistItems.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.type === "movie"
        ? entry.director.toLowerCase().includes(searchTerm.toLowerCase())
        : entry.creator.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGenre = !filterGenre || entry.genre.includes(filterGenre);
    const matchesType = !filterType || entry.type === filterType;
    return matchesSearch && matchesGenre && matchesType;
  });

  // Get unique genres for filter
  const allGenres = Array.from(
    new Set(watchlistItems.flatMap((entry) => entry.genre))
  ).sort();

  const handleEdit = (entry: MediaEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleFormSubmit = (data: MediaFormData) => {
    try {
      if (editingEntry) {
        updateMediaEntry(editingEntry.id, data);
        showSnackbar("Entry updated successfully!", "success");
      }
    } catch (error) {
      showSnackbar("An error occurred. Please try again.", "error");
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        deleteMediaEntry(id);
        showSnackbar("Entry deleted successfully!", "success");
      } catch (error) {
        showSnackbar("Failed to delete entry.", "error");
      }
    }
  };

  const handleToggleFavorite = (id: string) => {
    try {
      toggleFavorite(id);
      showSnackbar("Moved to favorites!", "success");
    } catch (error) {
      showSnackbar("Failed to update favorite status.", "error");
    }
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const moveAllToFavorites = () => {
    if (
      window.confirm(
        "Are you sure you want to move all watchlist items to favorites?"
      )
    ) {
      try {
        watchlistItems.forEach((item) => {
          if (!item.isFavorite) {
            toggleFavorite(item.id);
          }
        });
        showSnackbar("All items moved to favorites!", "success");
      } catch (error) {
        showSnackbar("Failed to move items to favorites.", "error");
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Watchlist
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Movies and TV shows you plan to watch
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              {watchlistItems.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Items
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              {watchlistItems.filter((item) => item.type === "movie").length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Movies
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              {watchlistItems.filter((item) => item.type === "tvshow").length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              TV Shows
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              {allGenres.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Genres
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Controls */}
      <Toolbar sx={{ px: 0, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<WatchlistIcon />}
          onClick={moveAllToFavorites}
          disabled={watchlistItems.length === 0}
          sx={{ mr: 2 }}
        >
          Move All to Favorites
        </Button>

        <TextField
          size="small"
          placeholder="Search watchlist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mr: 2, minWidth: 250 }}
        />

        <FormControl size="small" sx={{ mr: 2, minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            label="Type"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="movie">Movies</MenuItem>
            <MenuItem value="tvshow">TV Shows</MenuItem>
          </Select>
        </FormControl>

        {(searchTerm || filterGenre || filterType) && (
          <Chip
            label={`${filteredData.length} results`}
            color="primary"
            sx={{ ml: 2 }}
          />
        )}
      </Toolbar>

      {/* Empty State */}
      {watchlistItems.length === 0 ? (
        <Card sx={{ textAlign: "center", py: 6 }}>
          <CardContent>
            <WatchlistIcon
              sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your watchlist is empty
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add movies and TV shows to start building your watchlist. Items
              that are not marked as favorites will appear here.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        /* Table */
        <MediaTable
          data={filteredData}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onLoadMore={loadMore}
          hasMore={false}
        />
      )}

      {/* Form Dialog */}
      <MediaForm
        open={showForm}
        editingEntry={editingEntry}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Watchlist;
