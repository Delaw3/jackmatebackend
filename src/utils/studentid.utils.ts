import UserModel from "../model/user.model";

export const generateStudentId = async(): Promise<string> =>{
  const PREFIX = 'JCM';
  const YEAR = new Date().getFullYear();

  // Count existing records for this year
  const count = await UserModel.countDocuments({
    studentId: { $regex: `^${PREFIX}-${YEAR}-` }
  });

  // Sequence number with leading zeros
  const seq = (count + 1).toString().padStart(4, '0');

  return `${PREFIX}-${YEAR}-${seq}`;
}
