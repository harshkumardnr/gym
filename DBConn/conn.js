const mongoose =require("mongoose");

mongoose.connect('mongodb://localhost:27017/GYM_BACKEND').then(()=>console.log('DB connection successful!')).catch(err=>{
    console.log(err);
})