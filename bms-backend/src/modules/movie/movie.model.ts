import mongoose from "mongoose";
import { IMovie } from "./movie.interface";

const movieSchema = new mongoose.Schema<IMovie>(
  {
    title: {
      type: String,
      default: "Untitled Movie",
    },

    description: {
      type: String,
      default: "No description available",
    },

    duration: {
      type: String,
      default: "N/A",
    },

    genre: {
      type: [String],
      default: [],
    },

    releaseDate: {
      type: Date,
      default: Date.now,
    },

    languages: {
      type: [String],
      default: [],
    },

    certification: {
      type: String,
      default: "U",
    },

    posterUrl: {
      type: String,
      default: "https://via.placeholder.com/300x450?text=No+Image",
    },

    rating: {
      type: Number,
      default: 0,
    },

    votes: {
      type: Number,
      default: 0,
    },

    format: {
      type: [String],
      default: ["2D"],
    },
  },
  { timestamps: true },
);

export const MovieModel = mongoose.model<IMovie>("Movie", movieSchema);
