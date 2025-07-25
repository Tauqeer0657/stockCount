import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getSqlRequest, sql } from "../db/connection.js";

// Api to add stockCount
export const addStockCount = asyncHandler(async (req, res) => {
  const request = getSqlRequest();

  const { projectId, warehouseId } = req.params;

  // Add all required inputs
  request.input("productId", sql.NVarChar, req.body.productId);
  request.input("count", sql.Int, req.body.count);
  request.input("projectId", sql.NVarChar, projectId);
  request.input("warehouseId", sql.NVarChar, warehouseId);
  request.input("countedBy", sql.NVarChar, req.body.countedBy);
  request.input("countedAt", sql.DateTime, new Date());

  // SQL query for insertion
  const query = `
      INSERT INTO tb_stockCounts (
        productId, count, projectId, warehouseId, countedBy, countedAt
      ) VALUES (
        @productId, @count, @projectId, @warehouseId, @countedBy, @countedAt
      )
    `;

  await request.query(query);

  // Success response
  return res.status(201).json(new ApiResponse(201, {}, "Stock count added successfully"));
});

// Api to get stockCount
export const getStockCounts = asyncHandler(async (req, res) => {
  const request = getSqlRequest();

  const query = `SELECT * FROM tb_stockCounts`;

  const result = await request.query(query);

  if (result.recordset.length === 0) {
    throw new ApiError(404, "No stock count found");
  }

  return res.status(200).json(new ApiResponse(200, { StockCounts: result.recordset }, "StockCounts fetched successfully"));
});
