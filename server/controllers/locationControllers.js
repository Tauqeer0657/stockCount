import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getSqlRequest, sql } from "../db/connection.js";

// Api to add location
export const addLocation = asyncHandler(async (req, res) => {
  const request = getSqlRequest();

  // Validate required inputs
  const { warehouseId, itemCode, locationName } = req.body;
  if (!warehouseId || !itemCode) {
    throw new ApiError(400, "warehouseId and itemCode are required");
  }

  // Step 1: Get the last locationId in the format LXXX (e.g. L001, L002)
  const lastLocationQuery = `
    SELECT TOP 1 locationId
    FROM tb_sk_location
    WHERE locationId LIKE 'L%'
    ORDER BY locationId DESC
  `;

  const lastLocationResult = await request.query(lastLocationQuery);

  let newLocationId = "L001"; // default if no locations found

  if (lastLocationResult.recordset.length > 0) {
    const lastLocationId = lastLocationResult.recordset[0].locationId; // e.g. "L023"
    const numericPart = parseInt(lastLocationId.substring(1), 10);
    const nextNumber = numericPart + 1;
    newLocationId = "L" + nextNumber.toString().padStart(3, "0");
  }

  // Prepare inputs for insert
  request.input("locationId", sql.NVarChar, newLocationId);
  request.input("locationName", sql.NVarChar, locationName);
  request.input("warehouseId", sql.NVarChar, warehouseId);
  request.input("itemCode", sql.NVarChar, itemCode);
  request.input("createdAt", sql.DateTime, new Date());

  // Insert query
  const query = `
    INSERT INTO tb_sk_location (
      locationId, warehouseId, itemCode, locationName, createdAt
    ) VALUES (
      @locationId, @warehouseId, @itemCode, @locationName, @createdAt
    )
  `;

  await request.query(query);

  // Success response
  return res.status(201).json(new ApiResponse(201, { locationId: newLocationId }, "Location created successfully"));
});

// Api to get locations
export const getLocations = asyncHandler(async (req, res) => {
  const request = getSqlRequest();

  const query = `SELECT * FROM tb_sk_location`;

  const result = await request.query(query);

  if (result.recordset.length === 0) {
    throw new ApiError(404, "No locations found");
  }

  return res.status(200).json(new ApiResponse(200, { locations: result.recordset }, "Locations fetched successfully"));
});
