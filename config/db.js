import mongoose from "mongoose";

const connectDB = async() =>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`DB connected : ${conn.connection.host}`);

    }catch(err){
        console.log(`DB Error : ${err.message}`);
    }
}

export default connectDB;