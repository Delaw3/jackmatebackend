import LevelModel from "../model/level.model";
import SemesterModel from "../model/semester.model";
import logger from "../utils/logger";

export const seedLevelsAndSemesters = async () => {
    
  // Seed Levels
  const levels = ["100", "200", "300", "400", "500", "600"];
  for (const lvl of levels) {
    await LevelModel.updateOne(
      { name: lvl },
      { $set: { name: lvl } },
      { upsert: true }
    );
  }

  // Seed Semesters
  const semesters = ["First Semester", "Second Semester"];
  for (const sem of semesters) {
    await SemesterModel.updateOne(
      { name: sem },
      { $set: { name: sem } },
      { upsert: true }
    );
  }

  logger.info(" Levels and Semesters seeded successfully");
};
