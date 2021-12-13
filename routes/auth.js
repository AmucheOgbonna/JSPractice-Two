const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt= require('bcrypt');
const User = require('../models/user');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;



router.post('/signup', async (req,res)=>{
    const data = req.body;
    try {
        const passwordHash = await bcrypt.hash(data.password, 10)

        const user =await new User({
            email:data.email,
            password:passwordHash,
            fullname:data.fullname
        }).save()
        const token = jwt.sign({user_id:user._id}, JWT_SECRET_KEY,{expiresIn:60*10});
        res.status(201).send({
            message:"User Created", 
            data:{ token,email:user.email, fullname:user.fullname, user_id:user._id }})
    } catch (error) {
        res.status(400).send({message:"User couldn't be Created",error})
    }
})

router.post('/signin', async (req,res)=>{
    const data =req.body;
    try {
        const user = await User.findOne({email:data.email})
        if(!user){return res.status(400).send({message:"User does not exist",})}

        const isValidPassword = await bcrypt.compare(data.password, user.password)

        if(!isValidPassword){return res.status(400).send({message:"Invalid user or password"})}
        const token = jwt.sign({user_id:user._id}, JWT_SECRET_KEY);
        res.status(201).send({
            message:"User Logged-In", 
            data:{ token,email:user.email, fullname:user.fullname, user_id:user._id }})
    } catch (error) {
        res.status(400).send({message:"User couldn't be sign in",error})
    }
})


module.exports= router;

