const User = require('../models/user');
const auth = require('../middlewares/auth')
const profile = {};

profile.edit = async (req,res)=>{
    try {
        const profile = await User.findById(req.params.user_id).select("-password -__v")
        res.status(201).send({message: "User Profile", data:profile})
    } catch (error) {
        res.status(400).send({message: "Couldn't get Profile", error})
    }
}

profile.view = async (req,res)=>{
    const data =req.body;
    const user_id = req.USER_ID;
    try {
        const profile = await User.findById(user_id).select("-password -__v")
        if(!profile){
            return res.status(400).send({
                message:"User profile does not exist"
            })
        }
        const newProfile =await User.findByIdAndUpdate(user_id,
            {
            $set:{fullname:data.fullname}
            },{new: true})
        res.status(201).send({message: "User Profile Updated", data:newProfile})
    } catch (error) {
        res.status(400).send({message: "Couldn't get Profile", error})
    }
}

profile.delete = async (req,res)=>{
    try {
        const profile = await User.findByIdAndDelete(req.USER_ID);
        res.status(201).send({message: "User Profile Deleted", data:profile})
    } catch (error) {
        res.status(400).send({message: "User Profile Couldn't be deleted", error})
    }
}

module.exports = profile;