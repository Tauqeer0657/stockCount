import express from "express";
import { addWarehouse, getWarehouses } from "../controllers/warehouseControllers.js";
const router = express.Router();

// Route to add warehouse
router.route("/addWarehouse").post(addWarehouse);

// Route to get warehouse
router.route("/getWarehouses").get(getWarehouses);

export { router };