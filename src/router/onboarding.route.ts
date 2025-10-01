import { Router } from "express";
import { addDepartment, addFaculty, allDept, allFaculties, getAllUniversities, getLevels, getSemesters, getUniversityDetails, loadUniversities, onboarding } from "../controllers/onboarding.controllers";
import { validateToken } from "../middleware/auth.validate";
import { addDepartmentSchema, addFacultySchema, saveOnboardingSchema } from "../validators/schema";
import { validate } from "../middleware/validate";

const router = Router();

export default router;

router.post("/seed-universities", loadUniversities );
router.get("/universities", validateToken, getAllUniversities );
router.post("/add-faculty", validate(addFacultySchema), addFaculty );
router.post("/add-department", validate(addDepartmentSchema), addDepartment );
router.get("/faculties",validateToken, allFaculties );
router.get("/departments", validateToken, allDept)
router.get("/get-uni-details/:id", validateToken, getUniversityDetails );
router.get("/get-levels", validateToken, getLevels);
router.get("/get-semesters", validateToken, getSemesters);

// Save onboarding details
router.post("/save-onboarding", validateToken, validate(saveOnboardingSchema), onboarding );

