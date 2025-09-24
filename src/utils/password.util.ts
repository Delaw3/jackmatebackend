import  * as bcrypt from "bcrypt"


export const hashPassword = async (password: string | Buffer<ArrayBufferLike>) => {
    const saltRounds = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, saltRounds);
    
}

export const comparePassword = async (password: string | Buffer<ArrayBufferLike>, hashPassword: string) => {
    return await bcrypt.compare(password, hashPassword);
}

