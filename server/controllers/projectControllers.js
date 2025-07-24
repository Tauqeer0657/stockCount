import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getSqlRequest, sql } from "../db/connection.js";

// Api to add project
export const addProject = asyncHandler(async (req, res) => {
  const request = getSqlRequest();

  // Add all required inputs
  request.input("projectId", sql.NVarChar, req.body.projectId);
  request.input("projectName", sql.NVarChar, req.body.projectName);
  request.input("createdAt", sql.DateTime, new Date());

  // SQL query for insertion
  const query = `
      INSERT INTO tb_project (
        projectId, projectName, createdAt
      ) VALUES (
        @projectId, @projectName, @createdAt
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
