import mongoose from "mongoose";

 export const dbConnect = async () =>{
    try {
        const connect = await mongoose.connect(process.env.DB_STRING!);
        console.log ("connected to " + connect.connection.name)
        
    } catch (error) {
        console.log (error);
        process.exit(1)
    }
}


