const express=require('express');
const adminController=require('../controller/adminController')
const adminAuth= require('../middleware/adminAuth')
const router=express.Router()


router.get('/login',adminController.loadLogin)
router.post('/login',adminController.login)
router.get('/dashboard',adminAuth.checkSession,adminController.dashboard)


router.get('/logout', (req, res) => {
    try {
        
        res.clearCookie('connect.sid'); // or whatever your session cookie is named
        
        // Destroy the session
        req.session.destroy(err => {
            if (err) {
                console.error('Session destruction error:', err);
                return res.redirect('/admin/dashboard');
            }
            // Successful logout - redirect to login page
            return res.redirect('/admin/login');
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).render('admin/dashboard',{msg:'Logout failed because of unknown errors'});
    }
});





router.post('/add-user',adminController.adduser)
router.post('/edit-user',adminController.edituser)
router.post('/delete-user',adminController.deleteuser)
router.post('/search',adminController.searchuser)

module.exports=router;
