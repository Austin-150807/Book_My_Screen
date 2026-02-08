import { config } from "./config";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(config.databaseUrl as string);
    console.log("Connected to Database");
  } catch (error) {
    console.log("Failed to connect to Database", error);
    process.exit(1);
  }
};

export default connectDB;
