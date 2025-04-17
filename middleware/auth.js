const user= require('../model/userModel')
module.exports = {

    checkSession: (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/user/login');
        }
        next();
    },

    isLogin: (req, res, next) => {
        if (req.session.user) {
            return res.redirect('/user/userHome');
        }
        next();
    },
    
    isAlive:async (req,res,next)=>  {
        const userCheck= await user.findOne({email:req.session.user.email})
        if(!userCheck){
         req.session.user=false
        }
        next()
    }
};