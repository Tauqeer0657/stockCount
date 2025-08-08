import express from "express";
import { addLocation, getLocations } from "../controllers/locationControllers.js";
const router = express.Router();

// Route to add location
router.route("/addLocation").post(addLocation);

// Route to get locations
router.route("/getLocations").get(getLocations);

export { router };