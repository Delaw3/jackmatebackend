import { Request, Response } from "express";
import { asyncHandler } from "../utils/async.handler";
import { config } from "../config/config";
import { errorResponse, successResponse } from "../utils/response";
import { URequest } from "../interfaces/user.interface";
import { onboardingService } from "../services/onboarding.service";


export const loadUniversities = asyncHandler(async(req:Request, res:Response)=>{
     if (!config.universitiesApiUrl) {
          return res.status(500).json({ success: false, message: "Universities API URL is not configured." });
        }
        const result = await onboardingService.seedUniversities(
          config.universitiesApiUrl
        );

        return successResponse(res, "Universities seeded successfully", result, 200);

})

export const getAllUniversities = asyncHandler(async(req:URequest, res:Response)=>{
    const page = parseInt(req.query.page as string) || 1;
    const search = req.query.search as string || "";
    const userId = req.user?._id;
    if (!userId) {
        return errorResponse(res, "Invalid user ID", 400);
    }
    const results = await onboardingService.fetchAllUniversities(userId, page, search);
    return successResponse(res, "Universities fetched successfully", {...results}, 200);
})

export const addFaculty = asyncHandler(async(req:URequest, res:Response)=>{
    const { universityId, facultyName } = req.body;
    const faculty = await onboardingService.addFaculty(universityId, facultyName);
    return successResponse(res, "Faculty added successfully", faculty, 201);

})

export const addDepartment = asyncHandler(async(req:URequest, res:Response)=>{
    const { facultyId, departmentName } = req.body;
    const department = await onboardingService.addDepartment(facultyId, departmentName);
    return successResponse(res, "Department added successfully", department, 201);
})

export const allFaculties = asyncHandler(async(req:URequest, res:Response)=>{
    const userId = req.user?._id;
    if (!userId) {
        return errorResponse(res, "Invalid user ID", 400);
    }
    const page = parseInt(req.query.page as string) || 1;
    const search = req.query.search as string || "";
    const universityId = req.query.universityId as string;
    if (!universityId) {
        return errorResponse(res, "University ID is required", 400);
    }
    const results = await onboardingService.fetchAllFaculties( userId, universityId, page, search);
    return successResponse(res, "Faculties fetched successfully", {...results}, 200);

})

export const allDept = asyncHandler(async(req:URequest, res:Response)=>{
    const userId = req.user?._id;
    if (!userId) {
        return errorResponse(res, "Invalid user ID", 400);
    }
    const page = parseInt(req.query.page as string) || 1;
    const search = req.query.search as string || "";
    const facultyId = req.query.facultyId as string;
    if (!facultyId) {
        return errorResponse(res, "Faculty ID is required", 400);
    }
    const results = await onboardingService.fetchAllDepartments( userId, facultyId, page, search);
    return successResponse(res, "Faculties fetched successfully", {...results}, 200);

})

export const getUniversityDetails = asyncHandler(async(req:URequest, res:Response)=>{
    const userId = req.user?._id;
    if (!userId) {
        return errorResponse(res, "Invalid user ID", 400);
    }
    const universityId = req.params.id;
    if (!universityId) {
        return errorResponse(res, "University ID is required", 400);
    }
    const universitiesDetails = await onboardingService.getUniversityWithFaculties(userId, universityId);
    return successResponse(res, "University details fetched successfully", universitiesDetails, 200);
})