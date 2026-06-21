const userAuth=(req,res,next)=>{
       const Authtoken="xyz"
       const token="xyz"
       if(Authtoken===token){
           next()
       }else{
           res.status(401).send("Unauthorized token")
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