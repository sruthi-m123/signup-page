const express = require("express");
const router = express.Router();
const userController = require('../controller/userController');
const auth = require("../middleware/auth");

router.get('/register', (req, res) => {
    try {
        res.render('user/register', { message: '' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);


router.get('/userHome',auth.isAlive, auth.checkSession, userController.loadHome);
router.get('/login', auth.isLogin, userController.login);

router.get('/logout', (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                console.log(err);
                return res.redirect('/user/userHome');
            }
            res.redirect('/user/login');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;