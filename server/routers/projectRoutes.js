import express from "express";
import { addProject, getProjects } from "../controllers/projectControllers.js";
const router = express.Router();

// Route to add project
router.route("/addProject").post(addProject);

// Route to get project
router.route("/getProjects").get(getProjects);

export { router };