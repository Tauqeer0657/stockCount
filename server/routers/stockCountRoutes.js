import express from "express";
import { addStockCount, getStockCounts, getLatestStockCountByItem } from "../controllers/stockCountControllers.js";
const router = express.Router();

// Route to add stockCount
router.route("/addStockCount/:warehouseId").post(addStockCount);

// Route to get stockCount
router.route("/getStockCounts").get(getStockCounts);

// Route to get latest stockCount by item code
router.get('/item/:itemCode', getLatestStockCountByItem);

export { router };