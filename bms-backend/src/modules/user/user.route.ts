import express from "express";
import * as UserController from "./user.controller";

const router = express.Router();

router.post("/", UserController.createUser);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.put("/activate/:id", UserController.activateUser);

export default router;
 