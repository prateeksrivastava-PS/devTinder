const mongoose= require("mongoose");

const userSchema= mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        minLength:2,
        maxLength:40
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        lowerCase:true
    },
    password:{
        type:String,
        require :true
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender Not Valid")

            }

        }
    },
  photoUrl:{
    type:String,
    default:"https://www.shutterstock.com/image-vector/isolated-object-avatar-dummy-symbol-260nw-1290296656.jpg"
  },
  about:{
    type:String,
    default:"This is default about  of the user!"
  },
  skills:{
    type:[String]
  }
},{timestamps:true})

module.exports= mongoose.model("User",userSchema);

