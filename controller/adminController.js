const Admin = require("../model/adminModel");
const user = require('../model/userModel')
const bcrypt= require('bcrypt')
const saltround=10;


const login= async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({email})
    if(!admin) return res.render('admin/login',{message:"admin not found"})
    const isMatch= await bcrypt.compare(password,admin.password)
    if(!isMatch) return res.render('admin/login',{message:"invalid credentials"})
      req.session.admin=admin;
    return res.redirect('/admin/dashboard')  
  } catch (error) {
    console.error("Error fetching admins:", error);
  }
};

const loadLogin=(req,res)=>{
  res.render('admin/login',{message:''});
}

const dashboard= async (req,res)=>{
  try{
    const users= await user.find()
    res.render('admin/dashboard',{users,msg:''})
  }catch(err){
    console.log("Dashboard error:",'err')
    
  }
}

const adduser= async (req,res)=>{
  try{
const {uname,email,password}=req.body;

const add= await user.findOne({email})
if(add){
  const users=await user.find()
  return res.render('admin/dashboard',{users,msg:"user alredy exists"})
  
}
const hashedPassword=await bcrypt.hash(password,saltround)
const newUser=new user({
  uname:uname.trim(),
  email:email.trim(),
password:hashedPassword
});
await newUser.save()

return res.redirect('/admin/dashboard')
  }catch(err){
console.log("error found")
return res.render('admin/dashboard', { users: [], msg: "Something went wrong" });
  }
}
const edituser=async(req,res)=>{
  try{
const{uname,password,email}=req.body;
const edit= await user.findOne({email})
if(!edit){
  const users=await user.find()
  return res.render('admin/dashboard',{users,msg:'user not found'});
}
const hashedPassword=await bcrypt.hash(password,saltround)
edit.password= hashedPassword
edit.uname= uname
await edit.save();
return res.redirect('/admin/dashboard')

  }catch(err){
    return res.render('admin/dashboard', { users: [], msg: "Something went wrong" });
  }
}
const deleteuser=async(req,res)=>{
  try{
const{email}=req.body
const deleteuser =await user.findOneAndDelete({email})
return res.redirect('/admin/dashboard')
}catch(err){
  return res.render('admin/dashboard', { users: [], msg: "Something went wrong" });
}
}
const searchuser = async (req, res) => {
  try {
    const { username } = req.body;
    const users = await user.find({ uname: { $regex: username, $options: 'i' } });

    const msg = users.length === 0 ? "No user found" : null;
    return res.render('admin/dashboard', { users, msg });

  } catch (err) {
    console.log("Search error", err);
    return res.render('admin/dashboard', { users: [], msg: "Something went wrong" });
  }
};



module.exports = { loadLogin,dashboard,login,adduser,deleteuser,edituser,searchuser };
