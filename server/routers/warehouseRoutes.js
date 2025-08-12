import express from "express";
import { addWarehouse, getWarehouses, getWarehousesByProjectId } from "../controllers/warehouseControllers.js";
const router = express.Router();

// Route to add warehouse
router.route("/addWarehouse").post(addWarehouse);

// Route to get warehouse
router.route("/getWarehouses").get(getWarehouses);

// Route to get warehouse by projectId
router.route("/getWarehouses/:projectId").get(getWarehousesByProjectId);

export { router };