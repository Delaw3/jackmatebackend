import UserModel from "../model/auth.model";
import constants from "../utils/constants";
import logger from "../utils/logger";
import { hashPassword } from "../utils/password.util";
import { customError, errorResponse } from "../utils/response";

export class AuthService {
    constructor() {}

    async signUp (email: string, password: string){

        const existingUser = await UserModel.findOne({email:email})

        if(existingUser){
           throw new customError("User already exists", constants.VALIDATION_ERROR)
        }

        const hash = await hashPassword(password) 

        const user = new UserModel({
            email,
            password: hash
        })
        await user.save()
        logger.info(`New user registered: ${email}`);
        return user;

    }


    
        
}