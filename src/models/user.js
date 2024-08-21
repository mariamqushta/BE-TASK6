const mongoose=require('mongoose')
const validator=require('validator')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const { type } = require('os')

const userschema=new mongoose.Schema({username:{
    type:String,required:true,trim:true
}
,password:{
    type:String,
    required:true,trim:true,minlength:8
    ,validate(value){
        let password= new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
        if(!password.test(value)){
            throw new error("password must include uppercase , lowercase , number , speacial character")
        }
    }
}
,email:{
    type:String,required:true,trim:true,lowercase:true,unique:true,
    validate(val){if(!validator.isEmail(val)){
        throw new Error('error isinvalid')
    }}
}
,age:{
    type:Number,default:18
    ,validate(val){if(val<=0){
        throw new Error('age must be positive number')
    }}
},tokens:[{
    type:String,required:true
}]

// pPPP22@kiidhmm
})

userschema.pre("save",async function(){
 const user =this
 console.log(user)

 if(user.isModified('password')){
    user.password=await bcryptjs.hash(user.password,8)
 }
})

userschema.statics.findByCredentials=async(em,pass)=>{
    const user =await User.findOne({email:em})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch= await bcryptjs.compare(pass,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}

userschema.methods.generateToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},"mariam33")
    user.tokens=user.tokens.concat(token)
    await user.save()
    return token
}

userschema.methods.toJSON=function(){
    const user =this
    const userobject=user.toObject()
    delete userobject.password
    delete userobject.tokens
    return userobject
}


const User=mongoose.model('User',userschema)





module.exports=User