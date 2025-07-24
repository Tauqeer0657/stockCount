import express from "express";
import { addStockCount, getStockCounts } from "../controllers/projectControllers.js";
const router = express.Router();

// Route to add stockCount
router.route("/addStockCount").post(addStockCount);

// Route to get stockCount
router.route("/getStockCounts").get(getStockCounts);

export { router };