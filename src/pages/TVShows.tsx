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

const TVShows: React.FC = () => {
  const {
    loading,
    addMediaEntry,
    updateMediaEntry,
    deleteMediaEntry,
    toggleFavorite,
    loadMore,
    getTVShows,
  } = useMediaData();

  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MediaEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Get TV shows and apply filters
  const tvShows = getTVShows();
  const filteredShows = tvShows.filter((show) => {
    const matchesSearch =
      show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      show.creator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !filterGenre || show.genre.includes(filterGenre);
    const matchesStatus = !filterStatus || show.status === filterStatus;
    return matchesSearch && matchesGenre && matchesStatus;
  });

  // Get unique genres and statuses for filters
  const allGenres = Array.from(
    new Set(tvShows.flatMap((show) => show.genre))
  ).sort();
  const allStatuses = Array.from(
    new Set(tvShows.map((show) => show.status))
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
        showSnackbar("TV Show updated successfully!", "success");
      } else {
        addMediaEntry(data);
        showSnackbar("TV Show added successfully!", "success");
      }
    } catch (error) {
      showSnackbar("An error occurred. Please try again.", "error");
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this TV show?")) {
      try {
        deleteMediaEntry(id);
        showSnackbar("TV Show deleted successfully!", "success");
      } catch (error) {
        showSnackbar("Failed to delete TV show.", "error");
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
          TV Shows
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your TV show collection
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              {tvShows.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Shows
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              {tvShows.filter((show) => show.isFavorite).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Favorites
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              {tvShows.filter((show) => show.status === "ongoing").length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ongoing
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              {tvShows.filter((show) => show.status === "completed").length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
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
          Add TV Show
        </Button>

        <TextField
          size="small"
          placeholder="Search TV shows..."
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

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={filterStatus}
            label="Filter by Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {allStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {(searchTerm || filterGenre || filterStatus) && (
          <Chip
            label={`${filteredShows.length} results`}
            color="primary"
            sx={{ ml: 2 }}
          />
        )}
      </Toolbar>

      {/* Table */}
      <MediaTable
        data={filteredShows}
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

export default TVShows;
