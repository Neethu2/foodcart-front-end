import { useState, useCallback } from "react";
import type { MediaEntry, MediaFormData, Movie, TVShow } from "../types";

// Mock data for demonstration
const generateMockData = (): MediaEntry[] => {
  const mockData: MediaEntry[] = [];

  // Mock Movies
  for (let i = 1; i <= 50; i++) {
    const movie: Movie = {
      id: `movie-${i}`,
      title: `Movie Title ${i}`,
      director: `Director ${i}`,
      budget: Math.floor(Math.random() * 200000000) + 1000000,
      location: ["Hollywood", "New York", "London", "Tokyo", "Mumbai"][
        Math.floor(Math.random() * 5)
      ],
      duration: Math.floor(Math.random() * 120) + 90,
      year: Math.floor(Math.random() * 30) + 1994,
      genre: ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Romance"].slice(
        0,
        Math.floor(Math.random() * 3) + 1
      ),
      rating: Math.floor(Math.random() * 10) + 1,
      description: `This is a description for Movie ${i}. It's an amazing movie with great storyline and characters.`,
      isFavorite: Math.random() > 0.7,
      type: "movie",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockData.push(movie);
  }

  // Mock TV Shows
  for (let i = 1; i <= 50; i++) {
    const tvshow: TVShow = {
      id: `tvshow-${i}`,
      title: `TV Show ${i}`,
      creator: `Creator ${i}`,
      budget: Math.floor(Math.random() * 50000000) + 500000,
      location: ["Los Angeles", "Vancouver", "Atlanta", "New York", "London"][
        Math.floor(Math.random() * 5)
      ],
      episodeDuration: Math.floor(Math.random() * 30) + 30,
      totalSeasons: Math.floor(Math.random() * 10) + 1,
      totalEpisodes: Math.floor(Math.random() * 200) + 10,
      startYear: Math.floor(Math.random() * 20) + 2004,
      endYear:
        Math.random() > 0.6 ? Math.floor(Math.random() * 5) + 2020 : undefined,
      genre: [
        "Drama",
        "Comedy",
        "Crime",
        "Fantasy",
        "Thriller",
        "Documentary",
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      rating: Math.floor(Math.random() * 10) + 1,
      description: `This is a description for TV Show ${i}. It's an engaging series with compelling characters.`,
      isFavorite: Math.random() > 0.7,
      type: "tvshow",
      status: ["ongoing", "completed", "cancelled"][
        Math.floor(Math.random() * 3)
      ] as "ongoing" | "completed" | "cancelled",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockData.push(tvshow);
  }

  return mockData;
};

export const useMediaData = () => {
  const [mediaList, setMediaList] = useState<MediaEntry[]>(generateMockData());
  const [loading, setLoading] = useState(false);

  const addMediaEntry = useCallback((data: MediaFormData): MediaEntry => {
    const id = Date.now().toString();

    let newEntry: MediaEntry;

    if (data.type === "movie") {
      newEntry = {
        id,
        title: data.title,
        director: data.director || "",
        budget: data.budget,
        location: data.location,
        duration: data.duration || 0,
        year: data.year || new Date().getFullYear(),
        genre: data.genre,
        rating: data.rating,
        description: data.description,
        poster: data.poster,
        isFavorite: data.isFavorite,
        type: "movie",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Movie;
    } else {
      newEntry = {
        id,
        title: data.title,
        creator: data.creator || "",
        budget: data.budget,
        location: data.location,
        episodeDuration: data.episodeDuration || 0,
        totalSeasons: data.totalSeasons || 1,
        totalEpisodes: data.totalEpisodes || 1,
        startYear: data.startYear || new Date().getFullYear(),
        endYear: data.endYear,
        genre: data.genre,
        rating: data.rating,
        description: data.description,
        poster: data.poster,
        isFavorite: data.isFavorite,
        type: "tvshow",
        status: data.status || "ongoing",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as TVShow;
    }

    setMediaList((prev) => [newEntry, ...prev]);
    return newEntry;
  }, []);

  const updateMediaEntry = useCallback(
    (id: string, data: Partial<MediaFormData>): MediaEntry | null => {
      let updatedEntry: MediaEntry | null = null;

      setMediaList((prev) =>
        prev.map((entry) => {
          if (entry.id === id) {
            updatedEntry = {
              ...entry,
              ...data,
              updatedAt: new Date(),
            } as MediaEntry;
            return updatedEntry;
          }
          return entry;
        })
      );

      return updatedEntry;
    },
    []
  );

  const deleteMediaEntry = useCallback((id: string): boolean => {
    setMediaList((prev) => {
      const newList = prev.filter((entry) => entry.id !== id);
      return newList;
    });
    return true;
  }, []);

  const toggleFavorite = useCallback((id: string): boolean => {
    let success = false;
    setMediaList((prev) =>
      prev.map((entry) => {
        if (entry.id === id) {
          success = true;
          return {
            ...entry,
            isFavorite: !entry.isFavorite,
            updatedAt: new Date(),
          };
        }
        return entry;
      })
    );
    return success;
  }, []);

  const getMediaById = useCallback(
    (id: string): MediaEntry | null => {
      return mediaList.find((entry) => entry.id === id) || null;
    },
    [mediaList]
  );

  const getFavorites = useCallback((): MediaEntry[] => {
    return mediaList.filter((entry) => entry.isFavorite);
  }, [mediaList]);

  const getMovies = useCallback((): Movie[] => {
    return mediaList.filter((entry) => entry.type === "movie") as Movie[];
  }, [mediaList]);

  const getTVShows = useCallback((): TVShow[] => {
    return mediaList.filter((entry) => entry.type === "tvshow") as TVShow[];
  }, [mediaList]);

  // Simulate infinite scrolling by loading more data
  const loadMore = useCallback(async (): Promise<MediaEntry[]> => {
    setLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newData = generateMockData().slice(0, 20); // Load 20 more items
    setMediaList((prev) => [...prev, ...newData]);
    setLoading(false);

    return newData;
  }, []);

  return {
    mediaList,
    loading,
    addMediaEntry,
    updateMediaEntry,
    deleteMediaEntry,
    toggleFavorite,
    getMediaById,
    getFavorites,
    getMovies,
    getTVShows,
    loadMore,
  };
};
