import express from "express";
import { addUser, getUsers, loginUser } from "../controllers/userControllers.js";
const router = express.Router();

// Route to add user
router.route("/addUser").post(addUser);

// Route to get user
router.route("/getUsers").get(getUsers);

// Route to login user
router.route("/login").post(loginUser);

export { router };