import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getSqlRequest, sql } from "../db/connection.js";

// Api to add warehouse
export const addWarehouse = asyncHandler(async (req, res) => {
  const request = getSqlRequest();

  // Add all required inputs
  request.input("warehouseId", sql.NVarChar, req.body.warehouseId);
  request.input("warehouseName", sql.NVarChar, req.body.warehouseName);
  request.input("createdAt", sql.DateTime, new Date());

  // SQL query for insertion
  const query = `
      INSERT INTO tb_warehouse (
        warehouseId, warehouseName, createdAt
      ) VALUES (
        @warehouseId, @warehouseName, @createdAt
      )
    `;

  await request.query(query);

  // Success response
  return res.status(201).json(new ApiResponse(201, { warehouseId: req.body.warehouseId }, "warehouse created successfully"));
});

// Api to get warehouses
export const getWarehouses = asyncHandler(async (req, res) => {
  const request = getSqlRequest();

  const query = `SELECT * FROM tb_warehouse`;

  const result = await request.query(query);

  if (result.recordset.length === 0) {
    throw new ApiError(404, "No Warehouses found");
  }

  return res.status(200).json(new ApiResponse(200, { Warehouses: result.recordset }, "Warehouses fetched successfully"));
});
