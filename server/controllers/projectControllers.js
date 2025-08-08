import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getSqlRequest, sql } from "../db/connection.js";

// Api to add project
export const addProject = asyncHandler(async (req, res) => {
  const request = getSqlRequest();

  // Step 1: Get the last projectId in the format PXXX (e.g. P001, P002)
  const lastProjectQuery = `
    SELECT TOP 1 projectId
    FROM tb_project
    WHERE projectId LIKE 'P%'
    ORDER BY projectId DESC
  `;

  const lastProjectResult = await request.query(lastProjectQuery);

  let newProjectId = "P001"; // default if no projects found

  if (lastProjectResult.recordset.length > 0) {
    const lastProjectId = lastProjectResult.recordset[0].projectId; // e.g. "P023"
    // Extract the numeric part and increment
    const numericPart = parseInt(lastProjectId.substring(1), 10);
    const nextNumber = numericPart + 1;
    // Pad with leading zeros to 3 digits
    newProjectId = "P" + nextNumber.toString().padStart(3, "0");
  }

  request.input("projectId", sql.NVarChar, newProjectId);
  request.input("projectName", sql.NVarChar, req.body.projectName);
  request.input("createdAt", sql.DateTime, new Date());

  // SQL insert query
  const query = `
    INSERT INTO tb_project (
      projectId, projectName, createdAt
    ) VALUES (
      @projectId, @projectName, @createdAt
    )
  `;

  await request.query(query);

  // Success response
  return res.status(201).json(new ApiResponse(201, { projectId: newProjectId }, "Project created successfully"));
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
