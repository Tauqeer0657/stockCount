// import { Router } from 'express';
// const router = Router();

import express from "express";
import { getDrivers } from "../controllers/dashboardControllers.js";
const router = express.Router();

router.route("/getDashboard").get(getDrivers);

export { router };