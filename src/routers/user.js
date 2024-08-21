const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/auth')
const router = express.Router()
router.post('/users',(req,res)=>{
    console.log(req.body)
    const user=new User(req.body)
    user.save()
    .then((user)=>{res.status(200).send(user)}).
    catch((error)=>{res.status(400).send(error)})
})
router.get('/users',(req,res)=>{
    User.find({}).then((user)=>{res.status(200).send(user)}).
    catch((error)=>{res.status(500).send(error)})
})
router.get('/users/:id',(req,res)=>{

const _id=req.params.id
User.findById(_id).then((user)=>{
    if(!user){
        res.status(404).send('unable to find user')
    }res.status(200).send(user)
}).catch((error)=>{res.status(500).send(error)})
})

router.patch('/users/:id',async(req,res)=>{
    try{
        const _id=req.params.id
        const updates=Object.keys(req.body)
        // const user=await User.findByIdAndUpdate(_id,res.body,{new:true,runValidators:true}).

        const user=await User.findById(_id)
     
            if(!user){
                res.status(404).send('unable to find user')}
                updates.forEach((ele)=>{user[ele]=req.body[ele]})
                await user.save()
            res.status(200).send(user)
    }   catch{
        (error)=>{res.status(400).send(error)}}
    
})

router.delete('/users/:id',async(req,res)=>{
    try{
        const _id=req.params.id
        const user=await User.findByIdAndDelete(_id)
        if(!user){
            res.status(404).send('unable to find user')
        }res.status(200).send(user)

    } 
    catch{
        (error)=>{res.status(500).send(error)}}
})


router.post('/login',async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateToken()
        res.status(200).send({user,token})
    }catch(e){
        res.status(400).send(e.message)
    }
})


router.post('/users',async(req,res)=>{
    try{
        const user=new User (req.body)
        const token=await user.generateToken()
        await user.save()
        res.status(200).send({user,token})

    }catch(e){
        res.status(400).send(e)
    }

})

router.get('/profile',auth,async(req,res)=>{
    res.status(200).send(req.user)
})

router.delete('/logout',auth,async(req,res)=>{
    try{
        console.log(req.user)
        req.user.tokens=req.user.tokens.filter((q)=>{
            return q!==req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})





module.exports=router