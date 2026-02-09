import { TheaterModel } from "./theater.model";
import { ITheatre } from "./theater.interface";

// 1. Create Theater
export const createTheater = async (data: ITheatre): Promise<ITheatre> => {
  return await TheaterModel.create(data);
};

// 2. Get All Theaters
export const getAllTheaters = async (): Promise<ITheatre[]> => {
  return await TheaterModel.find();
};

// 3. Get Theater By ID
export const getTheaterById = async (id: string): Promise<ITheatre | null> => {
  return await TheaterModel.findById(id);
};

// 4. Get Theater By State
export const getTheaterByState = async (state: string): Promise<ITheatre[]> => {
  return await TheaterModel.find({ state: { $regex: state, $options: "i" } });
};
