import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getSqlRequest, sql } from "../db/connection.js";

// Api to add item
export const addItem = asyncHandler(async (req, res) => {
    const request = getSqlRequest();
  
    // Step 1: Get the last itemCode in the format IXXX (e.g. I001, I002)
    const lastItemQuery = `
      SELECT TOP 1 itemCode
      FROM tb_item
      WHERE itemCode LIKE 'I%'
      ORDER BY itemCode DESC
    `;
  
    const lastItemResult = await request.query(lastItemQuery);
  
    let newItemCode = "I001"; // default if no items found
  
    if (lastItemResult.recordset.length > 0) {
      const lastItemCode = lastItemResult.recordset[0].itemCode; // e.g. "I023"
      // Extract numeric part and increment
      const numericPart = parseInt(lastItemCode.substring(1), 10);
      const nextNumber = numericPart + 1;
      // Pad with leading zeros to 3 digits
      newItemCode = "I" + nextNumber.toString().padStart(3, "0");
    }
  
    // Prepare inputs using the generated itemCode
    request.input("itemCode", sql.NVarChar, newItemCode);
    request.input("itemName", sql.NVarChar, req.body.itemName);
    request.input("itemDescription", sql.NVarChar, req.body.itemDescription);
    request.input("createdAt", sql.DateTime, new Date());
  
    // SQL insert query
    const query = `
      INSERT INTO tb_item (
        itemCode, itemName, itemDescription, createdAt
      ) VALUES (
        @itemCode, @itemName, @itemDescription, @createdAt
      )
    `;
  
    await request.query(query);
  
    // Success response
    return res.status(201).json(new ApiResponse(201, { itemCode: newItemCode }, "Item created successfully"));
});  

// Api to get items
export const getItems = asyncHandler(async (req, res) => {
  const request = getSqlRequest();

  const query = `SELECT * FROM tb_item`;

  const result = await request.query(query);

  if (result.recordset.length === 0) {
    throw new ApiError(404, "No items found");
  }

  return res.status(200).json(new ApiResponse(200, { items: result.recordset }, "items fetched successfully"));
});
