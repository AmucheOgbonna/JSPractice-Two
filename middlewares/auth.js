const jwt = require('jsonwebtoken');
const User = require('./../models/user')

module.exports = ()=>{
   return  async (req,res, next)=>{
        try{
            const token = req.headers.authorization;
            if(!token) throw new Error("Token not found");
            const decoded = jwt.decode(token);

            const user =await User.findById(decoded.user_id)
            // if(!user) return res.status(401).send("Unauthoized user")
            if(!user)throw new Error("Unauthorized User");
            req.USER_ID = user._id;
            next();
            
        }catch(error){
            next(error)
        }
    }
}