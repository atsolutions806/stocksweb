const mongoose =require('mongoose');
require('dotenv').config({path: '../.env'})

const DB_URI=process.env.MONGODB

mongoose.connect(
    DB_URI
)
.then(()=>console.log("DB connected Successfully"))
.catch((err)=> console.log('DB not connected Successfully'+err));
