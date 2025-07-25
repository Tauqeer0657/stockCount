import express from "express";
import { addStockCount, getStockCounts } from "../controllers/stockCountControllers.js";
const router = express.Router();

// Route to add stockCount
router.route("/addStockCount/:projectId/:warehouseId").post(addStockCount);

// Route to get stockCount
router.route("/getStockCounts").get(getStockCounts);

export { router };