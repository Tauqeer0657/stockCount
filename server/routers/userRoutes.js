import express from "express";
import { addUser, getUsers } from "../controllers/userControllers.js";
const router = express.Router();

// Route to add user
router.route("/addUser").post(addUser);

// Route to get user
router.route("/getUsers").get(getUsers);

export { router };