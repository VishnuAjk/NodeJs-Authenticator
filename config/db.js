require('dotenv').config()
const mongoose = require('mongoose');
console.log("Database URL:", process.env.DATABASE_URL);
exports.connectMongoose =()=>{
    mongoose.connect(process.env.DATABASE_URL,
    {
        useNewUrlParser: true
    })
    .then((e)=>console.log("Connected to Mongoose"))
    .catch((e)=>console.log("Not Connect Mongodb"))
}
