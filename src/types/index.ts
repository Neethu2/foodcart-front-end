export interface Movie {
  id: string;
  title: string;
  director: string;
  budget: number;
  location: string;
  duration: number; // in minutes
  year: number;
  genre: string[];
  rating: number; // 1-10
  description: string;
  poster?: string;
  isFavorite: boolean;
  type: "movie";
  createdAt: Date;
  updatedAt: Date;
}

export interface TVShow {
  id: string;
  title: string;
  creator: string;
  budget: number;
  location: string;
  episodeDuration: number; // average episode duration in minutes
  totalSeasons: number;
  totalEpisodes: number;
  startYear: number;
  endYear?: number;
  genre: string[];
  rating: number; // 1-10
  description: string;
  poster?: string;
  isFavorite: boolean;
  type: "tvshow";
  status: "ongoing" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export type MediaEntry = Movie | TVShow;

export interface MediaFormData {
  title: string;
  director?: string;
  creator?: string;
  budget: number;
  location: string;
  duration?: number;
  episodeDuration?: number;
  totalSeasons?: number;
  totalEpisodes?: number;
  year?: number;
  startYear?: number;
  endYear?: number;
  genre: string[];
  rating: number;
  description: string;
  poster?: string;
  isFavorite: boolean;
  type: "movie" | "tvshow";
  status?: "ongoing" | "completed" | "cancelled";
}
