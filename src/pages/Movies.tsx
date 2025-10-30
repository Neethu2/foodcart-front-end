import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
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
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { useMediaData } from "../hooks/useMediaData";
import MediaTable from "../components/MediaTable";
import MediaForm from "../components/MediaForm";
import type { MediaEntry, MediaFormData } from "../types";

const Movies: React.FC = () => {
  const {
    loading,
    addMediaEntry,
    updateMediaEntry,
    deleteMediaEntry,
    toggleFavorite,
    loadMore,
    getMovies,
  } = useMediaData();

  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MediaEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Get movies and apply filters
  const movies = getMovies();
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !filterGenre || movie.genre.includes(filterGenre);
    return matchesSearch && matchesGenre;
  });

  // Get unique genres for filter
  const allGenres = Array.from(
    new Set(movies.flatMap((movie) => movie.genre))
  ).sort();

  const handleAddNew = () => {
    setEditingEntry(null);
    setShowForm(true);
  };

  const handleEdit = (entry: MediaEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleFormSubmit = (data: MediaFormData) => {
    try {
      if (editingEntry) {
        updateMediaEntry(editingEntry.id, data);
        showSnackbar("Entry updated successfully!", "success");
      } else {
        addMediaEntry(data);
        showSnackbar("Entry added successfully!", "success");
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
      showSnackbar("Favorite status updated!", "info");
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

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Movies
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your movie collection
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              {movies.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Movies
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              {movies.filter((m) => m.isFavorite).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Favorites
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
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{ mr: 2 }}
        >
          Add Movie
        </Button>

        <TextField
          size="small"
          placeholder="Search movies..."
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

        {(searchTerm || filterGenre) && (
          <Chip
            label={`${filteredMovies.length} results`}
            color="primary"
            sx={{ ml: 2 }}
          />
        )}
      </Toolbar>

      {/* Table */}
      <MediaTable
        data={filteredMovies}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
        onLoadMore={loadMore}
        hasMore={true}
      />

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

export default Movies;
