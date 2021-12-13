const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config()

const port = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan('dev'));

// setup mongodb Connection
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;
const User = require('./models/user');
const Post = require('./models/post')
const jwt = require('jsonwebtoken');
const bcrypt= require('bcrypt');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const auth = require('./middlewares/auth')

const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const profileRoute = require('./routes/profile');


app.use("/auth",authRoute)
app.use("/post",postRoute)
app.use("/profile",profileRoute)


app.get('/ping',(req,res)=>{
    res.send("Hello World")
})

app.use("**", ( req, res,next)=>{
    res.status(404).send({message:"Route not found"})
})

app.use((error, req, res,next)=>{
    console.log(error);
    res.status(500).send({message:"Something went wrong", error})
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