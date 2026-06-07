const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async()=>{
    try{
        console.log("MONGO_URL:", process.env.MONGO_URL);
        const conn= await mongoose.connect(process.env.MONGO_URL);
        console.log(`Successfully connected MongoDB: ${conn.connection.host}`);

    }
    catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports=connectDB;