import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getSqlRequest, sql } from "../db/connection.js";

// Api to add warehouse
export const addWarehouse = asyncHandler(async (req, res) => {
  const request = getSqlRequest();

  // Step 1: Get the last warehouseId in the format WXXX (e.g. W001, W002)
  const lastWarehouseQuery = `
    SELECT TOP 1 warehouseId
    FROM tb_warehouse
    WHERE warehouseId LIKE 'W%'
    ORDER BY warehouseId DESC
  `;

  const lastWarehouseResult = await request.query(lastWarehouseQuery);

  let newWarehouseId = "W001"; // default if no warehouses found

  if (lastWarehouseResult.recordset.length > 0) {
    const lastWarehouseId = lastWarehouseResult.recordset[0].warehouseId; // e.g. "W023"
    // Extract numeric part and increment
    const numericPart = parseInt(lastWarehouseId.substring(1), 10);
    const nextNumber = numericPart + 1;
    // Pad with leading zeros to 3 digits
    newWarehouseId = "W" + nextNumber.toString().padStart(3, "0");
  }

  // Prepare inputs using the generated warehouseId
  request.input("warehouseId", sql.NVarChar, newWarehouseId);
  request.input("projectId", sql.NVarChar, req.body.projectId);
  request.input("warehouseName", sql.NVarChar, req.body.warehouseName);
  request.input("createdAt", sql.DateTime, new Date());

  // SQL insert query
  const query = `
    INSERT INTO tb_warehouse (
      warehouseId, projectId, warehouseName, createdAt
    ) VALUES (
      @warehouseId, @projectId, @warehouseName, @createdAt
    )
  `;

  await request.query(query);

  // Success response
  return res.status(201).json(new ApiResponse(201, { warehouseId: newWarehouseId }, "Warehouse created successfully"));
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

// Api to get warehouses by projectId
export const getWarehousesByProjectId = asyncHandler(async (req, res) => {
  const request = getSqlRequest();
  
  const { projectId } = req.params;

  const query = `SELECT * FROM tb_warehouse Where projectId = @projectId`;
  
  // Prepare input
  request.input("projectId", sql.NVarChar, projectId);

  const result = await request.query(query);

  if (result.recordset.length === 0) {
    throw new ApiError(404, "No Warehouses found");
  }

  return res.status(200).json(new ApiResponse(200, { Warehouses: result.recordset }, "Warehouses fetched successfully"));
});
