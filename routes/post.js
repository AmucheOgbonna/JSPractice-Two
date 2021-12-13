const router = require('express').Router();
const Post = require('../models/post');
const auth = require('../middlewares/auth')


router.post('/', auth(), async (req,res)=>{
    const data = req.body;

    try {
        const post = await new Post({
            title: data.title,
            body: data.body,
            user_id: req.USER_ID
        }).save();
        res.status(201).send({message: "Post Created", data:post})
    } catch (error) {
        res.status(400).send({message: "Post Not Created", error: error.message})
    }
    
})

router.patch('/:post_id', auth(), async (req,res)=>{
    const data = req.body;

    try {
        const post = await Post.findOne({_id: req.params.post_id})
        if(post.user_id !== req.USER_ID)return res.status(403).send({message:"You cannnot edit this post"})
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

router.get('/', async (req,res)=>{
        try {
        const posts = await Post.find().populate("user_id", "email fullname")
        res.status(201).send({message: "All Post Log", data:posts})
    } catch (error) {
        res.status(400).send({message: "all Post cannot be logged", error})
    }
})

router.get('/:post_id', async (req,res)=>{
        try {
        const post = await Post.findById(req.params.post_id).populate("user_id", "email fullname")
        res.status(201).send({message: "Post Log", data:post})
    } catch (error) {
        res.status(400).send({message: "Post cannot be logged", error})
    }
})

router.delete('/:post_id', auth(), async (req,res)=>{
        try {
        const post = await Post.findOne(req.params.post_id);
        if(post.user_id !== req.USER_ID)return res.status(403).send({message:"You cannnot delete this post"})
        await Post.findByIdAndDelete(req.params.post_id)

        res.status(201).send({message: "Post Deleted", data:post})
    } catch (error) {
        res.status(400).send({message: "Post cannot be deleted", error})
    }
})

module.exports= router;

