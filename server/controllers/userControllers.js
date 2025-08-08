import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getSqlRequest, sql } from "../db/connection.js";
import bcrypt from "bcrypt";

// Api to add User
export const addUser = asyncHandler(async (req, res) => {
  const request = getSqlRequest();

  // Step 1: Get the last userId in the format UXXX (e.g. U001, U002)
  const lastUserQuery = `
    SELECT TOP 1 userId
    FROM tb_user
    WHERE userId LIKE 'U%'
    ORDER BY userId DESC
  `;

  const lastUserResult = await request.query(lastUserQuery);

  let newUserId = "U001"; // default if no users found

  if (lastUserResult.recordset.length > 0) {
    const lastUserId = lastUserResult.recordset[0].userId; // e.g. "U023"
    // Extract the numeric part and increment
    const numericPart = parseInt(lastUserId.substring(1), 10);
    const nextNumber = numericPart + 1;
    // Pad with leading zeros to 3 digits
    newUserId = "U" + nextNumber.toString().padStart(3, "0");
  }

  // Generate password hash
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  request.input("userId", sql.NVarChar, newUserId);
  request.input("userName", sql.NVarChar, req.body.userName);
  request.input("password", sql.NVarChar, hashedPassword);
  request.input("createdAt", sql.DateTime, new Date());

  // SQL insert query
  const query = `
    INSERT INTO tb_user (
      userId, userName, password, createdAt
    ) VALUES (
      @userId, @userName, @password, @createdAt
    )
  `;

  await request.query(query);

  // Success response
  return res.status(201).json(new ApiResponse(201, { userId: newUserId }, "User created successfully"));
});

// Api to get users
export const getUsers = asyncHandler(async (req, res) => {
  const request = getSqlRequest();

  const query = `SELECT * FROM tb_user`;

  const result = await request.query(query);

  if (result.recordset.length === 0) {
    throw new ApiError(404, "No Users found");
  }

  return res.status(200).json(new ApiResponse(200, { Users: result.recordset }, "Users fetched successfully"));
});

// Api to login user
export const loginUser = asyncHandler(async (req, res) => {
  const request = getSqlRequest();

  const { userName, password } = req.body;

  const query = `
  SELECT *
  FROM tb_user 
  WHERE userName = @userName;
`;
  request.input("userName", sql.NVarChar, userName);
  const result = await request.query(query);

  if (result.recordset.length === 0) {
    throw new ApiError(404, "No User found with this username");
  }

  const user = result.recordset[0];
  const userId = result.recordset[0].userId;
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(404, "Invalid username or password");
  }

  return res.status(200).json(new ApiResponse(200, { userId }, "Login successful"));
});

