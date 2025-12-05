const mongoose =  require("mongoose");
const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://uvissh42_db_user:Vishal12345@cluster0.pa49lxw.mongodb.net/bmwTinder"

    );

};

module.exports = connectDB;
