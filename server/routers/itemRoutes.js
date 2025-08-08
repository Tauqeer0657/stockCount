import express from "express";
import { addItem, getItems } from "../controllers/itemControllers.js";
const router = express.Router();

// Route to add item
router.route("/addItem").post(addItem);

// Route to get items
router.route("/getItems").get(getItems);

export { router };