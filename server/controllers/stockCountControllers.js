import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getSqlRequest, sql } from "../db/connection.js";

// Api to add stock count
export const addStockCount = asyncHandler(async (req, res) => {
  const request = getSqlRequest();

  // Get warehouseId from URL params
  const { warehouseId } = req.params;
  
  // Validate required inputs from request body
  const { itemCode, locationId, quantity, countedBy } = req.body;
  if (!itemCode || !locationId || quantity === undefined || !countedBy) {
    throw new ApiError(400, "itemCode, locationId, quantity, and countedBy are required");
  }

  // Validate warehouseId from params
  if (!warehouseId) {
    throw new ApiError(400, "warehouseId is required");
  }

  // Prepare inputs for insert
  request.input("itemCode", sql.NVarChar, itemCode);
  request.input("warehouseId", sql.NVarChar, warehouseId);
  request.input("locationId", sql.NVarChar, locationId);
  request.input("quantity", sql.Int, quantity);
  request.input("countedBy", sql.NVarChar, countedBy);
  request.input("countedAt", sql.DateTime, new Date());

  // Insert query
  const query = `
    INSERT INTO tb_stockcounts (
      itemCode, warehouseId, locationId, quantity, countedBy, countedAt
    ) VALUES (
      @itemCode, @warehouseId, @locationId, @quantity, @countedBy, @countedAt
    )
  `;

  await request.query(query);

  // Success response
  return res.status(201).json(new ApiResponse(201, { 
    itemCode, 
    warehouseId, 
    locationId, 
    quantity, 
    countedBy 
  }, "Stock count created successfully"));
});

// Api to get stock counts
export const getStockCounts = asyncHandler(async (req, res) => {
  const request = getSqlRequest();

  const query = `SELECT * FROM tb_stockcounts ORDER BY countedAt DESC`;

  const result = await request.query(query);

  if (result.recordset.length === 0) {
    throw new ApiError(404, "No stock counts found");
  }

  return res.status(200).json(new ApiResponse(200, { stockCounts: result.recordset }, "Stock counts fetched successfully"));
});

// Api to get latest stock count by itemCode
export const getLatestStockCountByItem = asyncHandler(async (req, res) => {
  const request = getSqlRequest();

  // Get itemCode from URL params
  const { itemCode } = req.params;

  // Validate itemCode
  if (!itemCode) {
    throw new ApiError(400, "itemCode is required in URL params");
  }

  // Prepare input
  request.input("itemCode", sql.NVarChar, itemCode);

  // Query with JOINs to get itemName and locationName
  const query = `
    SELECT TOP 1 
      sc.quantity,
      i.itemName,
      sl.locationName
    FROM tb_stockcounts sc
    INNER JOIN tb_item i ON sc.itemCode = i.itemCode
    INNER JOIN tb_sk_location sl ON sc.locationId = sl.locationId
    WHERE sc.itemCode = @itemCode 
    ORDER BY sc.countedAt DESC
  `;

  const result = await request.query(query);

  if (result.recordset.length === 0) {
    throw new ApiError(404, `No stock count found for itemCode: ${itemCode}`);
  }

  return res.status(200).json(new ApiResponse(200, { stockCount: result.recordset[0] }, "Latest stock count with item and location details fetched successfully"));
});

