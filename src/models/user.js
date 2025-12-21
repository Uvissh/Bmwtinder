const  mongoose = require('mongoose');
const  validator =  require("validator");
const jwt = require("jsonwebtoken");

const userSchema  = mongoose.Schema({

    firstName:{
        type : String,
        required:true,
        minLength:3,
        maxLength:15,
    },
    lastName :{
        type : String,
    },
    emailId:{
        type: String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address"+value);
            }
        }
    },

    password:{
        type: String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("invlaid password" + value);
            }
        },
    },
    age:{
        type:String,
        min:18,
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","machine"].includes(value)){
                throw new Error("Gender is not valid");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://www.bmw-motorrad.in/content/dam/bmwmotorradnsc/common/multiimages/images/models/sport/s1000rr/2024/productstage/nsc-s1000rr-P0N3H-multiimage-1920x1200.jpg.asset.1732605093706.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invlaid Photo URL"+ value);
                
            }
        }

    },

    

    about:{
        type:String,
        default:"this is default about user",
    },
    skills:{
        type:[String],
    },
},{timestamps :true});

//schema based methods
userSchema.methods.getJWT = async function (){
    const user = this;
              const token = await jwt.sign({_id:user._id},"bhateria@12345");
              return token;
}

 const User = mongoose.model("User",userSchema);
 module.exports = User;