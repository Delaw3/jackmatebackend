import UserModel from "../model/auth.model";
import constants from "../utils/constants";
import logger from "../utils/logger";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utils/password.util";
import { customError, errorResponse } from "../utils/response";
import { generateToken, verifyToken } from "../utils/jwt.util";
import { IUser } from "../interfaces/user.interface";
import { otpService } from "./otp.service";
import { sendMail } from "./email.service";
import { config } from "../config/config";


export class AuthService {
    constructor() {}

    async signUp (data: IUser){

        const {email, password } = data
        const existingUser = await UserModel.findOne({ email: email.toLowerCase() })

        if(existingUser){
           throw new customError("User already exists", constants.VALIDATION_ERROR)
        }

        const hash = await hashPassword(password) 

        const user = new UserModel({
            email,
            password: hash
        })
        await user.save()
        const userObj = user.toObject() as any
        delete userObj.password
        const token = generateToken (
            {
                _id: userObj._id,
                email: user.email
            }
        )
        logger.info(`New user registered: ${email}`);
        return {...userObj, token};

    }

   async signIn(data: IUser) {
        const {email, password } = data
        const user = await UserModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            throw new customError("User does not exist", constants.NOT_FOUND);
        }
 
        if (await comparePassword(password, user.password)) {
            const token = generateToken
            ({
                    _id: user._id.toString(),
                    email: user.email 
            });
            
            return token;
        }

        throw new customError("Invalid credentials", constants.UNAUTHORIZED);
    }

    async forgetPassword(email: string) {
        const user = await UserModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            throw new customError("User does not exist", constants.NOT_FOUND);
        };
        // Generate otp
        const otp = otpService.generateOtp();
        await otpService.setOtp(email, otp);

        // Send OTP via email
        sendMail(email, "Password Reset OTP", `Your OTP is ${otp}. It is valid for 5 minutes.`)

        return true;
    }

    async verifyOtp(otp: string) {
        const email = await otpService.verifyOtp(otp);
        if (!email) {
            throw new customError("Invalid or expired OTP", constants.VALIDATION_ERROR);
        };
        const resetToken =  jwt.sign(
            {email},
            config.jwtSecret as string,
            {expiresIn: '10m'}
            
        ) // short-lived token for resetting password 

        return { resetToken: resetToken };

    }

    async resetPassword(resetToken: string, newPassword: string) {
        const payload = verifyToken(resetToken) as { email?: string };
        const user = await UserModel.findOne({ email: payload.email?.toLowerCase() });
        if (!user) {
            throw new customError("User does not exist", constants.NOT_FOUND);
        };
        const hash = await hashPassword(newPassword) 
        user.password = hash;
        await user.save();
        return true;
    }   
        
}

export const authService = new AuthService();