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
  Tabs,
  Tab,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useMediaData } from "../hooks/useMediaData";
import MediaTable from "../components/MediaTable";
import MediaForm from "../components/MediaForm";
import type { MediaEntry, MediaFormData } from "../types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`favorites-tabpanel-${index}`}
      aria-labelledby={`favorites-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Favorites: React.FC = () => {
  const {
    loading,
    updateMediaEntry,
    deleteMediaEntry,
    toggleFavorite,
    loadMore,
    getFavorites,
    getMovies,
    getTVShows,
  } = useMediaData();

  const [editingEntry, setEditingEntry] = useState<MediaEntry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Get favorites
  const allFavorites = getFavorites();
  const favoriteMovies = getMovies().filter((m) => m.isFavorite);
  const favoriteTVShows = getTVShows().filter((s) => s.isFavorite);

  // Apply filters based on current tab
  const getCurrentData = () => {
    let currentData: MediaEntry[] = [];

    switch (tabValue) {
      case 0: // All favorites
        currentData = allFavorites;
        break;
      case 1: // Movies only
        currentData = favoriteMovies;
        break;
      case 2: // TV Shows only
        currentData = favoriteTVShows;
        break;
      default:
        currentData = allFavorites;
    }

    // Apply search and genre filters
    return currentData.filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.type === "movie"
          ? entry.director.toLowerCase().includes(searchTerm.toLowerCase())
          : entry.creator.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesGenre = !filterGenre || entry.genre.includes(filterGenre);
      return matchesSearch && matchesGenre;
    });
  };

  const filteredData = getCurrentData();

  // Get unique genres for filter
  const allGenres = Array.from(
    new Set(allFavorites.flatMap((entry) => entry.genre))
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
      showSnackbar("Removed from favorites!", "info");
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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSearchTerm(""); // Clear search when switching tabs
    setFilterGenre(""); // Clear genre filter when switching tabs
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Favorites
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your favorite movies and TV shows
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              {allFavorites.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Favorites
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              {favoriteMovies.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Favorite Movies
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              {favoriteTVShows.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Favorite TV Shows
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`All (${allFavorites.length})`} />
          <Tab label={`Movies (${favoriteMovies.length})`} />
          <Tab label={`TV Shows (${favoriteTVShows.length})`} />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {/* Controls for All */}
        <Toolbar sx={{ px: 0, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search favorites..."
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
              label={`${filteredData.length} results`}
              color="primary"
              sx={{ ml: 2 }}
            />
          )}
        </Toolbar>

        <MediaTable
          data={filteredData}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onLoadMore={loadMore}
          hasMore={false}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Controls for Movies */}
        <Toolbar sx={{ px: 0, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search favorite movies..."
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
            <InputLabel>Filter by Genre</InputLabel>
            <Select
              value={filterGenre}
              label="Filter by Genre"
              onChange={(e) => setFilterGenre(e.target.value)}
            >
              <MenuItem value="">All Genres</MenuItem>
              {allGenres.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {(searchTerm || filterGenre) && (
            <Chip
              label={`${filteredData.length} results`}
              color="primary"
              sx={{ ml: 2 }}
            />
          )}
        </Toolbar>

        <MediaTable
          data={filteredData}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onLoadMore={loadMore}
          hasMore={false}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Controls for TV Shows */}
        <Toolbar sx={{ px: 0, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search favorite TV shows..."
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
              label={`${filteredData.length} results`}
              color="primary"
              sx={{ ml: 2 }}
            />
          )}
        </Toolbar>

        <MediaTable
          data={filteredData}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onLoadMore={loadMore}
          hasMore={false}
        />
      </TabPanel>

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

export default Favorites;
