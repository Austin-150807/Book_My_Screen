import express from "express";
import movieRouter from "../modules/movie/movie.route";
import theaterRouter from "../modules/theater/theater.routes";
import showRouter from "../modules/show/show.routes";
import userRouter from "../modules/user/user.route";

const router = express.Router();

router.use("/movies", movieRouter);
router.use("/theaters", theaterRouter);
router.use("/shows", showRouter);
router.use("/users", userRouter);

export default router;
