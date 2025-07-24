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
  request.input("projectId", sql.NVarChar, projectId);
  request.input("warehouseId", sql.NVarChar, warehouseId);
  request.input("createdAt", sql.DateTime, new Date());

  // SQL query for insertion
  const query = `
      INSERT INTO tb_project (
        productId, count, projectId, warehouseId,createdAt
      ) VALUES (
        @productId, @count, @projectId, @warehouseId, @createdAt
      )
    `;

  await request.query(query);

  // Success response
  return res.status(201).json(new ApiResponse(201, { projectId: req.body.projectId }, "Project created successfully"));
});

// Api to get projects
export const getProjects = asyncHandler(async (req, res) => {
  const request = getSqlRequest();

  const query = `SELECT * FROM tb_project`;

  const result = await request.query(query);

  if (result.recordset.length === 0) {
    throw new ApiError(404, "No Projects found");
  }

  return res.status(200).json(new ApiResponse(200, { Projects: result.recordset }, "Projects fetched successfully"));
});
