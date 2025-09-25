import UserModel from "../model/auth.model";
import constants from "../utils/constants";
import logger from "../utils/logger";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utils/password.util";
import { customError, errorResponse } from "../utils/response";
import { generateToken } from "../utils/jwt.util";
import { IUser } from "../interfaces/user.interface";

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
        logger.info(`New user registered: ${email}`);
        return userObj;

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


    
        
}