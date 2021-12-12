const express = require('express');
const app = express();
const morgan = require('morgan');

const port = 8081;

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan('dev'));

app.get('/ping',(req,res)=>{
    res.send("Hello World")
})

// setup mongodb Connection
const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/blog";
const User = require('./models/user');
const Post = require('./models/post')
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = "njbiuh93djknmkomijfiiuvbojpokkc"

app.post('/auth/signup', async (req,res)=>{
    const data = req.body;
    try {
        const user =await new User({
            email:data.email,
            password:data.password,
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

app.post('/auth/signin', async (req,res)=>{
    const data =req.body;
    try {
        const user = await User.findOne({email:data.email})
        if(!user){
            return res.status(400).send({message:"User does not exist",})}
        if(data.password != user.password){return res.status(400).send({message:"Invalid user or password"})}
        const token = jwt.sign({user_id:user._id}, JWT_SECRET_KEY);
        res.status(201).send({
            message:"User Logged-In", 
            data:{ token,email:user.email, fullname:user.fullname, user_id:user._id }})
    } catch (error) {
        res.status(400).send({message:"User couldn't be sign in",error})
    }
    


})

app.post('/post', async (req,res)=>{
    const data = req.body;

    try {
        const post = await new Post({
            title: data.title,
            body: data.body,
            user_id: data.user_id
        }).save();
        res.status(201).send({message: "Post Created", data:post})
    } catch (error) {
        res.status(400).send({message: "Post Not Created", error})
    }
    
})

app.patch('/post/:post_id', async (req,res)=>{
    const data = req.body;

    try {
        const post = await Post.findOne({_id: req.params.post_id})
        if(!post){
            console.log(post);
            return res.status(400).send({message:"No post to updated! "})
        }

        const newPost = await Post.findByIdAndUpdate(req.params.post_id, 
        {
            $set:{
                title:data.title,
                body:data.body
            }
        },{new:true})//parial update
        // const newPost = Post.findByIdAndUpdatea(req.params.post_id, data)---fullupdate
         res.status(200).send({message: "Post updated!", data: newPost})
    } catch (error) {
        console.log(error);
        res.status(400).send({message: "Post Not Edited", error})
    }
    
})

app.get('/post', async (req,res)=>{
        try {
        const posts = await Post.find().populate("user_id", "email fullname")
        res.status(201).send({message: "All Post Log", data:posts})
    } catch (error) {
        res.status(400).send({message: "all Post cannot be logged", error})
    }
})

app.get('/post/:post_id', async (req,res)=>{
        try {
        const post = await Post.findById(req.params.post_id).populate("user_id", "email fullname")
        res.status(201).send({message: "Post Log", data:post})
    } catch (error) {
        res.status(400).send({message: "Post cannot be logged", error})
    }
})

app.delete('/post/:post_id', async (req,res)=>{
        try {
        const post = await Post.findByIdAndDelete(req.params.post_id);
        res.status(201).send({message: "Post Deleted", data:post})
    } catch (error) {
        res.status(400).send({message: "Post cannot be deleted", error})
    }
})

app.get('/profile/:user_id', async (req,res)=>{
    try {
    const profile = await User.findById(req.params.user_id).select("-password -__v")
    res.status(201).send({message: "User Profile", data:profile})
} catch (error) {
    res.status(400).send({message: "Couldn't get Profile", error})
}
})

app.patch('/profile/:user_id', async (req,res)=>{
    const data =req.body;
    try {
    const profile = await User.findById(req.params.user_id).select("-password -__v")
    if(!profile){
        return res.status(400).send({
            message:"User profile does not exist"
        })
    }
    const newProfile =await User.findByIdAndUpdate(req.params.user_id,
        {
        $set:{fullname:data.fullname}
        },{new: true})
    res.status(201).send({message: "User Profile", data:newProfile})
} catch (error) {
    res.status(400).send({message: "Couldn't get Profile", error})
}
})

app.delete('/profile/:user_id', async (req,res)=>{
    try {
    const profile = await User.findByIdAndDelete(req.params.user_id);
    res.status(201).send({message: "User Profile Deleted", data:profile})
} catch (error) {
    res.status(400).send({message: "User Profile Couldn't be deleted", error})
}
})

app.listen(port, async ()=>{
    try {
       await mongoose.connect(MONGODB_URI) ;
       console.log(":::> Connected to MongoDB");
    } catch (error) {
        console.log(":::> Couldn't connect to Database");
    }
    console.log(`::::> Lisening on https://localhost:${port}`);
})