import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Chip,
  OutlinedInput,
  Typography,
  InputAdornment,
  Stack,
  FormHelperText,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { MediaEntry, MediaFormData } from "../types";

interface MediaFormProps {
  open: boolean;
  editingEntry?: MediaEntry | null;
  onClose: () => void;
  onSubmit: (data: MediaFormData) => void;
}

const GENRE_OPTIONS = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Western",
];

const MediaForm: React.FC<MediaFormProps> = ({
  open,
  editingEntry,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<MediaFormData>({
    title: "",
    director: "",
    creator: "",
    budget: 0,
    location: "",
    duration: 0,
    episodeDuration: 30,
    totalSeasons: 1,
    totalEpisodes: 1,
    year: new Date().getFullYear(),
    startYear: new Date().getFullYear(),
    endYear: undefined,
    genre: [],
    rating: 5,
    description: "",
    poster: "",
    isFavorite: false,
    type: "movie",
    status: "ongoing",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingEntry) {
      if (editingEntry.type === "movie") {
        setFormData({
          title: editingEntry.title,
          director: editingEntry.director,
          creator: "",
          budget: editingEntry.budget,
          location: editingEntry.location,
          duration: editingEntry.duration,
          episodeDuration: 30,
          totalSeasons: 1,
          totalEpisodes: 1,
          year: editingEntry.year,
          startYear: new Date().getFullYear(),
          endYear: undefined,
          genre: editingEntry.genre,
          rating: editingEntry.rating,
          description: editingEntry.description,
          poster: editingEntry.poster || "",
          isFavorite: editingEntry.isFavorite,
          type: "movie",
          status: "ongoing",
        });
      } else {
        setFormData({
          title: editingEntry.title,
          director: "",
          creator: editingEntry.creator,
          budget: editingEntry.budget,
          location: editingEntry.location,
          duration: 0,
          episodeDuration: editingEntry.episodeDuration,
          totalSeasons: editingEntry.totalSeasons,
          totalEpisodes: editingEntry.totalEpisodes,
          year: new Date().getFullYear(),
          startYear: editingEntry.startYear,
          endYear: editingEntry.endYear,
          genre: editingEntry.genre,
          rating: editingEntry.rating,
          description: editingEntry.description,
          poster: editingEntry.poster || "",
          isFavorite: editingEntry.isFavorite,
          type: "tvshow",
          status: editingEntry.status,
        });
      }
    } else {
      // Reset form for new entry
      setFormData({
        title: "",
        director: "",
        creator: "",
        budget: 0,
        location: "",
        duration: 0,
        episodeDuration: 30,
        totalSeasons: 1,
        totalEpisodes: 1,
        year: new Date().getFullYear(),
        startYear: new Date().getFullYear(),
        endYear: undefined,
        genre: [],
        rating: 5,
        description: "",
        poster: "",
        isFavorite: false,
        type: "movie",
        status: "ongoing",
      });
    }
    setErrors({});
  }, [editingEntry, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (formData.type === "movie") {
      if (!formData.director?.trim()) {
        newErrors.director = "Director is required for movies";
      }
      if (!formData.duration || formData.duration <= 0) {
        newErrors.duration = "Duration must be greater than 0";
      }
      if (!formData.year || formData.year < 1900) {
        newErrors.year = "Please enter a valid year";
      }
    } else {
      if (!formData.creator?.trim()) {
        newErrors.creator = "Creator is required for TV shows";
      }
      if (!formData.episodeDuration || formData.episodeDuration <= 0) {
        newErrors.episodeDuration = "Episode duration must be greater than 0";
      }
      if (!formData.startYear || formData.startYear < 1900) {
        newErrors.startYear = "Please enter a valid start year";
      }
      if (formData.endYear && formData.endYear < formData.startYear!) {
        newErrors.endYear = "End year must be after start year";
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.budget < 0) {
      newErrors.budget = "Budget cannot be negative";
    }

    if (formData.rating < 1 || formData.rating > 10) {
      newErrors.rating = "Rating must be between 1 and 10";
    }

    if (formData.genre.length === 0) {
      newErrors.genre = "At least one genre is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleInputChange = (field: keyof MediaFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{editingEntry ? "Edit Form" : "Add Form"}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <div className="d-flex">
              <FormControl fullWidth className="me-2">
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  label="Type"
                  onChange={(e) => handleInputChange("type", e.target.value)}
                >
                  <MenuItem value="movie">Movie</MenuItem>
                  <MenuItem value="tvshow">TV Show</MenuItem>
                </Select>
              </FormControl>

              {/* Title */}
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
              />
            </div>

            <div className="d-flex">
              {formData.type === "movie" ? (
                <TextField
                  fullWidth
                  label="Director"
                  value={formData.director}
                  onChange={(e) =>
                    handleInputChange("director", e.target.value)
                  }
                  error={!!errors.director}
                  helperText={errors.director}
                  className="me-2"
                />
              ) : (
                <TextField
                  fullWidth
                  label="Creator"
                  value={formData.creator}
                  onChange={(e) => handleInputChange("creator", e.target.value)}
                  error={!!errors.creator}
                  helperText={errors.creator}
                  className="me-2"
                />
              )}

              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                error={!!errors.location}
                helperText={errors.location}
              />
            </div>

            <div className="d-flex gap-2">
              {formData.type === "movie" ? (
                <TextField
                  fullWidth
                  label="Year"
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    handleInputChange("year", parseInt(e.target.value))
                  }
                  error={!!errors.year}
                  helperText={errors.year}
                  className="me-2 w-50"
                />
              ) : (
                <>
                  <TextField
                    fullWidth
                    label="Start Year"
                    type="number"
                    value={formData.startYear}
                    onChange={(e) =>
                      handleInputChange("startYear", parseInt(e.target.value))
                    }
                    error={!!errors.startYear}
                    helperText={errors.startYear}
                  />
                  <TextField
                    fullWidth
                    label="End Year (Optional)"
                    type="number"
                    value={formData.endYear || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "endYear",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    error={!!errors.endYear}
                    helperText={errors.endYear}
                  />
                </>
              )}
            </div>
            <div className="d-flex flex-wrap gap-2 w-100">
              {formData.type === "movie" ? (
                <TextField
                  fullWidth
                  label="Duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", parseInt(e.target.value))
                  }
                  className="w-50"
                  error={!!errors.duration}
                  helperText={errors.duration}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">minutes</InputAdornment>
                    ),
                  }}
                />
              ) : (
                <>
                  <TextField
                    label="Episode Duration"
                    type="number"
                    value={formData.episodeDuration}
                    onChange={(e) =>
                      handleInputChange(
                        "episodeDuration",
                        parseInt(e.target.value)
                      )
                    }
                    error={!!errors.episodeDuration}
                    helperText={errors.episodeDuration}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">min</InputAdornment>
                      ),
                    }}
                    className=""
                  />
                  <TextField
                    label="Seasons"
                    type="number"
                    value={formData.totalSeasons}
                    onChange={(e) =>
                      handleInputChange(
                        "totalSeasons",
                        parseInt(e.target.value)
                      )
                    }
                    className=""
                  />
                  <TextField
                    label="Episodes"
                    type="number"
                    value={formData.totalEpisodes}
                    onChange={(e) =>
                      handleInputChange(
                        "totalEpisodes",
                        parseInt(e.target.value)
                      )
                    }
                    className="me-2"
                  />
                </>
              )}

              {/* Budget and Rating */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  label="Rating"
                  type="number"
                  value={formData.rating}
                  onChange={(e) =>
                    handleInputChange("rating", parseInt(e.target.value))
                  }
                  error={!!errors.rating}
                  helperText={errors.rating}
                  inputProps={{ min: 1, max: 10 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">/10</InputAdornment>
                    ),
                  }}
                  className="w-75"
                />
              </Box>

              {/* TV Show Status */}
              {formData.type === "tvshow" && (
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                  >
                    <MenuItem value="ongoing">Ongoing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              )}
            </div>

            {/* Genres */}
            <FormControl fullWidth error={!!errors.genre}>
              <InputLabel>Genres</InputLabel>
              <Select
                multiple
                value={formData.genre}
                onChange={(e) => handleInputChange("genre", e.target.value)}
                input={<OutlinedInput label="Genres" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {GENRE_OPTIONS.map((genre) => (
                  <MenuItem key={genre} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </Select>
              {errors.genre && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, ml: 1.5 }}
                >
                  {errors.genre}
                </Typography>
              )}
            </FormControl>

            {/* Description */}
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isFavorite}
                  onChange={(e) =>
                    handleInputChange("isFavorite", e.target.checked)
                  }
                />
              }
              label="Add to favorites"
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {editingEntry ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MediaForm;
