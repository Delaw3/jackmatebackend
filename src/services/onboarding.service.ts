import axios from "axios";
import axiosRetry from "axios-retry";
import UniversityModel from "../model/universities.model";
import { customError } from "../utils/response";
import constants from "../utils/constants";
import UserModel from "../model/user.model";
import { paginate } from "../utils/pagination.util";
import { FacultyModel } from "../model/faculty.model";
import { DepartmentModel } from "../model/dept.model";
import { Types } from "mongoose";
import SemesterModel from "../model/semester.model";
import LevelModel from "../model/level.model";
import OnboardingModel from "../model/onboarding.model";
import { generateStudentId } from "../utils/studentid.utils";

// enable retry with exponential backoff
axiosRetry(axios, {
  retries: 3, // retry up to 3 times
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return (
      error.code === "ECONNABORTED" ||
      error.code === "ETIMEDOUT" ||
      (error.response !== undefined && typeof error.response.status === "number" && error.response.status >= 500)
    ) ? true : false;
  },
});


class OnboardingService {
  constructor() {}

  async checkUserExists(userId: string) {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      throw new customError("User not found", constants.NOT_FOUND);
    }
  }




 async seedUniversities(apiUrl: string) {
    const { data } = await axios.get(apiUrl, { timeout: 120000 }); // 60s timeout

    // the API returns { data: [...] }
    const universities = data.data;
    if (!Array.isArray(universities)) {
        throw new customError("Unexpected API format: expected { data: University[] }", constants.VALIDATION_ERROR);
    }

    let inserted = 0;
    for (const uni of universities) {
        if (!uni.name) continue;

        await UniversityModel.updateOne(
        { name: new RegExp(`^${uni.name}$`, "i") }, // case-insensitive match
        {
            $set: {
            name: uni.name,
            abbreviation: null,
            type: uni.type || null,
            state: null, // not provided by API
            city: null,  // not provided by API
            website: uni.url || null,
            source: apiUrl,
            },
        },
        { upsert: true }
        );
        inserted++;
    }

    return { total: universities.length, upserted: inserted };
};

async addFaculty(universityId: string, facultyName: string) {

    const university = await UniversityModel.findById(universityId);
    if (!university) new customError("University not found", constants.NOT_FOUND);

    const existingFaculty = await FacultyModel.findOne({ name: facultyName, university: universityId });
    if (existingFaculty) new customError("Faculty already exists for this university", constants.VALIDATION_ERROR);

    const faculty = new FacultyModel({
        name: facultyName,
        university: universityId
    });
    await faculty.save();
    return faculty;
}

async addDepartment(facultyId: string, departmentName: string) {

    const faculty = await FacultyModel.findById(facultyId);
    if (!faculty) new customError("Faculty not found", constants.NOT_FOUND);

    const existingDept = await DepartmentModel.findOne({ name: departmentName, faculty: facultyId });
    if (existingDept) new customError("Department already exists for this faculty", constants.VALIDATION_ERROR);
    const department = new DepartmentModel({
        name: departmentName,
        faculty: facultyId
    });
    await department.save();
    return department;
}


async fetchAllUniversities(
  userId: string,
  page: number = 1,
  search?: string
) {
  await this.checkUserExists(userId);

  const limit = 10; // default pagination limit
  const skip = (page - 1) * limit;

  // build query
  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { type: { $regex: search, $options: "i" } }
    ];
  }

  let universities;
  let total;

  if (search) {
    // if searching → return ALL results (no pagination)
    universities = await UniversityModel.find(query).sort({ name: 1 });
    total = universities.length;

    return {
      data: universities,
      total,
      page: 1,
      limit: total,
      totalPages: 1
    };
  } else {
    // normal fetch → with pagination
    universities = await UniversityModel.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    total = await UniversityModel.countDocuments(query);

    return paginate(
      universities,      // data
      total,             // total count
      { page, limit }    // pagination options
    );
  }
}

async fetchAllFaculties(
  userId: string,  
  universityId: string,
  page: number = 1,
  search?: string
) {
    await this.checkUserExists(userId);
    // optional: validate university exists
    const limit = 10;
    const skip = (page - 1) * limit;

    const query: any = { university: universityId };

    if (search) {
        query.name = { $regex: search, $options: "i" };
    }

    let faculties;
    let total;

    if (search) {
        // search → return all matching (no pagination)
        faculties = await FacultyModel.find(query).sort({ name: 1 });
        total = faculties.length;

        return {
        data: faculties,
        total,
        page: 1,
        limit: total,
        totalPages: 1
        };
    } else {
        // normal fetch with pagination
        faculties = await FacultyModel.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit);

        total = await FacultyModel.countDocuments(query);

        return paginate(faculties, total, { page, limit });
    }
}

async fetchAllDepartments(
  userId: string,
  facultyId: string,
  page: number = 1,
  search?: string
) {
    await this.checkUserExists(userId);
    const limit = 10;
    const skip = (page - 1) * limit;

    const query: any = { faculty: facultyId };

    if (search) {
        query.name = { $regex: search, $options: "i" };
    }

    let departments;
    let total;

    if (search) {
        departments = await DepartmentModel.find(query).sort({ name: 1 });
        total = departments.length;

        return {
        data: departments,
        total,
        page: 1,
        limit: total,
        totalPages: 1
        };
    } else {
        departments = await DepartmentModel.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit);

        total = await DepartmentModel.countDocuments(query);

        return paginate(departments, total, { page, limit });
    }
}



async getUniversityWithFaculties (userId:string, universityId: string) {
    await this.checkUserExists(userId);
    const result = await UniversityModel.aggregate([
        { $match: { _id: new Types.ObjectId(universityId) } },

        // Get faculties
        {
        $lookup: {
            from: "faculties",
            localField: "_id",
            foreignField: "university",
            as: "faculties",
        },
        },

        // For each faculty, fetch departments
        {
        $lookup: {
            from: "departments",
            localField: "faculties._id",
            foreignField: "faculty",
            as: "departments",
        },
        },

        // Group faculties + departments under each faculty
        {
        $addFields: {
            faculties: {
            $map: {
                input: "$faculties",
                as: "faculty",
                in: {
                _id: "$$faculty._id",
                name: "$$faculty.name",
                departments: {
                    $filter: {
                    input: "$departments",
                    as: "dept",
                    cond: { $eq: ["$$dept.faculty", "$$faculty._id"] },
                    },
                },
                },
            },
            },
        },
        },

        // Remove the flat departments field
        { $project: { departments: 0 } },
    ]);

    return result[0] || null;
    };

    async getLevels(userId:string) {
        await this.checkUserExists(userId);
        const levels = await LevelModel.find().sort({ name: 1 });
        return levels;
    }

    async getSemesters(userId:string) {
        await this.checkUserExists(userId);
        const semesters = await SemesterModel.find().sort({ name: 1 });
        return semesters;
    }


async saveOnboarding(
  userId: string,
  universityId: string,
  facultyId: string,
  departmentId: string,
  levelId: string,
  semesterId: string
) {
  await this.checkUserExists(userId);

  const existing = await OnboardingModel.findOne({ user: userId });
  if (existing) {
    // update existing onboarding
    existing.university = new Types.ObjectId(universityId);
    existing.faculty = new Types.ObjectId(facultyId);
    existing.department = new Types.ObjectId(departmentId);
    existing.level = new Types.ObjectId(levelId);
    existing.semester = new Types.ObjectId(semesterId);

    if (!existing.studentId) {
      const studentId = await generateStudentId();
      existing.studentId = studentId;
      await UserModel.updateOne({ _id: userId }, { studentId });
    }

    await existing.save();
    return existing; // return the document directly
  }

  // generate student ID
  const studentId = await generateStudentId();
  console.log("Generated student ID:", studentId);

  // create new onboarding
  const onboarding = new OnboardingModel({
    user: new Types.ObjectId(userId),
    university: new Types.ObjectId(universityId),
    faculty: new Types.ObjectId(facultyId),
    department: new Types.ObjectId(departmentId),
    level: new Types.ObjectId(levelId),
    semester: new Types.ObjectId(semesterId),
    studentId
  });

  await UserModel.updateOne({ _id: userId }, { onboardingCompleted: true, studentId });
  await onboarding.save();

  return onboarding; // return directly so studentId is included
}



}
export const onboardingService = new OnboardingService();
