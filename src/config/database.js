const mongoose=require("mongoose");

const connectDB=async ()=>{
    await mongoose.connect("mongodb+srv://prateeksrivastava6397_db_user:Pr4Lk-JUJiViUiC@namastenode.geiwx9g.mongodb.net/DevTinder");
};


module.exports=connectDB;





