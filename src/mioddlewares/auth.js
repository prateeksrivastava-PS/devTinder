const jwt = require('jsonwebtoken');
const  userModel= require("../models/user")
const userAuth=async (req,res,next)=>{
    try{
        //Geting token
        const {token}= req.cookies;

        if (!token) {
         return res.status(401).send("Please login token not valid");
        }

        const decodedToken = await jwt.verify(token, "KOBE@DEV$2021");

        const {_id}= decodedToken
           const user= await userModel.findById(_id)
        if(! user){
            throw new Error ("User Not Found")
        }

        req.userData=user;
        next();


    }catch(err){
             res.status(400).send(err.message)
    }

}

const  adminAuth=(req,res,next)=>{
    const Authtoken="xyz"
      const isAdminAuth= Authtoken==="xyz";
       if(isAdminAuth){
           next()
       }else{
           res.status(401).send("Unauthorized token")
       }

}

module.exports={
    adminAuth,userAuth
}