import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  CircularProgress,
  Box,
  Rating,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import type { MediaEntry } from "../types";

interface MediaTableProps {
  data: MediaEntry[];
  loading: boolean;
  onEdit: (entry: MediaEntry) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onLoadMore: () => void;
  hasMore?: boolean;
}

const MediaTable: React.FC<MediaTableProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onToggleFavorite,
  onLoadMore,
  hasMore = true,
}) => {
  const [visibleData, setVisibleData] = useState<MediaEntry[]>([]);
  const [displayCount, setDisplayCount] = useState(20);
  const tableRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Update visible data when data changes
  useEffect(() => {
    setVisibleData(data.slice(0, displayCount));
  }, [data, displayCount]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          if (displayCount < data.length) {
            // Load more from existing data
            setDisplayCount((prev) => Math.min(prev + 20, data.length));
          } else {
            // Load more data from source
            onLoadMore();
          }
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [displayCount, data.length, hasMore, loading, onLoadMore]);

  const formatBudget = (budget: number): string => {
    if (budget >= 1000000) {
      return `$${(budget / 1000000).toFixed(1)}M`;
    }
    return `$${(budget / 1000).toFixed(0)}K`;
  };

  const formatDuration = (entry: MediaEntry): string => {
    if (entry.type === "movie") {
      return `${entry.duration} min`;
    } else {
      return `${entry.episodeDuration} min/ep`;
    }
  };

  const formatYear = (entry: MediaEntry): string => {
    if (entry.type === "movie") {
      return entry.year.toString();
    } else {
      return entry.endYear
        ? `${entry.startYear}-${entry.endYear}`
        : `${entry.startYear}-`;
    }
  };

  const tableHeading = [
    {
      id: 1,
      label: "Title",
    },
    {
      id: 2,
      label: "Type",
    },
    {
      id: 3,
      label: "Director/Creator",
    },
    {
      id: 4,
      label: "Year",
    },
    {
      id: 5,
      label: "Duration",
    },
    {
      id: 6,
      label: "Budget",
    },
    {
      id: 7,
      label: "Location",
    },
    {
      id: 8,
      label: "Rating",
    },
    {
      id: 9,
      label: "Genres",
    },
    {
      id: 10,
      label: "Favorite",
    },
    {
      id: 11,
      label: "Actions",
    },
  ];

  return (
    <TableContainer
      component={Paper}
      ref={tableRef}
      sx={{ maxHeight: "70vh", overflow: "auto" }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {tableHeading.map((heading) => (
              <TableCell key={heading.id}>{heading.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleData.map((entry) => (
            <TableRow key={entry.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {entry.title}
                </Typography>
                {entry.type === "tvshow" && (
                  <Typography variant="caption" color="text.secondary">
                    S{entry.totalSeasons} • E{entry.totalEpisodes}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Chip
                  label={entry.type === "movie" ? "Movie" : "TV Show"}
                  color={entry.type === "movie" ? "primary" : "secondary"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {entry.type === "movie" ? entry.director : entry.creator}
              </TableCell>
              <TableCell>{formatYear(entry)}</TableCell>
              <TableCell>{formatDuration(entry)}</TableCell>
              <TableCell>{formatBudget(entry.budget)}</TableCell>
              <TableCell>{entry.location}</TableCell>
              <TableCell>
                <Rating value={entry.rating / 2} readOnly size="small" />
                <Typography variant="caption" display="block">
                  {entry.rating}/10
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {entry.genre.slice(0, 2).map((genre) => (
                    <Chip
                      key={genre}
                      label={genre}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                  {entry.genre.length > 2 && (
                    <Tooltip title={entry.genre.slice(2).join(", ")}>
                      <Chip
                        label={`+${entry.genre.length - 2}`}
                        size="small"
                        variant="outlined"
                      />
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => onToggleFavorite(entry.id)}
                  color={entry.isFavorite ? "error" : "default"}
                >
                  {entry.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(entry)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(entry.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Loading indicator for infinite scroll */}
      <Box
        ref={loadingRef}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 60,
        }}
      >
        {loading && <CircularProgress size={24} />}
        {!hasMore && !loading && (
          <Typography variant="body2" color="text.secondary">
            No more entries to load
          </Typography>
        )}
      </Box>
    </TableContainer>
  );
};

export default MediaTable;
