const express=require("express");

const app=express();

app.post("/user",(req,res)=>{
    console.log("Geting Request body",req.query)
    res.send("Data Save  Sucessful..")
})

// It  only match get api call "/user"
app.get("/user",(req,res)=>{
   res.send({firstName:"Prateek",lastName:"Srivastava"})
})

app.get("/userprofile/:userID/:userName",(req,res)=>{
   console.log("Geting Request body",req.params)
   res.send({firstName:"Prateek",lastName:"Srivastava"})
})


app.delete("/delete/user/data",(req,res)=>{
   console.log("Data remove from db..")
   res.send("Data Sucessful remove...")
})

app.use("/hello",(req,res)=>{
   res.send("Hello from server");
})


// If use it match all api call lke"/test"
app.use("/test",(req,res)=>{
   res.send("Hiw test from server");
})



app.use("/profile",(rea,res,next)=>{

   console.log("Response!!")
   // res.send("Getting response from server1")
   next()

},
(req,res,next)=>{
   console.log("respopnse 2!")
   // res.send("Getting Response from server 2")
   next();
},

(req,res,next)=>{
   console.log("Resposnse from 3")
   res.send("Getting Response from server 3")
   
}
)




app.use("/",(req,res)=>{
   res.send("Namste Prateek");
})


app.listen(7777,()=>{
    console.log("Server start listening on port 7777...")
});