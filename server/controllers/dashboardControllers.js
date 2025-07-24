import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getSqlRequest } from "../db/connection.js";

export const getDrivers = asyncHandler(async (req, res) => {
  const query = `
    SELECT d.*, t.name as transporterName
    FROM tms_3pl_tb_DriverMaster d
    JOIN tms_3pl_tb_transporterMaster t
    ON d.transporterId = t.transporterId;
  `;

  // Execute the SQL query
  const request = getSqlRequest();
  const result = await request.query(query);

  // Handle no records found
  if (!result.recordset.length) {
    throw new ApiError(404, "No data found in the Driver table");
  }

  // Respond with success
  res
    .status(200)
    .json(
      new ApiResponse(200, result.recordset, "Drivers fetched successfully")
    );
});
