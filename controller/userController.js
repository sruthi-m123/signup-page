const userSchema = require('../model/userModel');
const bycrpt = require('bcrypt');
const saltround = 10;

const registerUser = async (req, res) => {
  try {
    const { uname, email, password, confirmpassword } = req.body ;
  
    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res.render('user/register', { message: 'User already exists' });
    }

    if (password !== confirmpassword) {
      return res.render("user/register", { message: "Passwords do not match!" });
    }

    const hashedPassword = await bycrpt.hash(password, saltround);
    const newUser = new userSchema({
      uname: uname.trim(),
      email: email.trim(),
      password: hashedPassword
    });
    await newUser.save();
    
    req.session.successMessage = "Registration successful! Please login.";
   
    return res.redirect('/user/login');

  } catch (error) {
    console.error("Error during registration:", error);
    return res.render('user/register', { message: 'Something went wrong' });
  }
};

const login = async (req, res) => {
  try {
    
    const successMessage = req.session.successMessage;
    if (successMessage) {
      delete req.session.successMessage;
      return res.render("user/login", { message: successMessage });
    }
    res.render("user/login",{message:''});
  } catch (error) {
    console.log("something error in user login");
    res.render("user/login", { message: 'Error loading login page' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.render('user/login', { message: 'User not found!' });
    }

    const isMatch = await bycrpt.compare(password, user.password);
    if (!isMatch) {
      return res.render('user/login', { message: 'Incorrect password' });
    }

    req.session.user = user;
    return res.redirect("/user/userHome");
  } catch (error) {
    console.error("login error:", error);
    return res.render('user/login', { message: 'something went wrong!' });
  }
};

const loadHome = (req, res) => {
  if (!req.session.user) {
    return res.redirect('/user/login');
  }
  return res.render('user/userHome', { user: req.session.user });
};

module.exports = { registerUser, loginUser, loadHome, login };