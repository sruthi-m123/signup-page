
module.exports = {
    checkSession: (req, res, next) => {
        if (!req.session.admin) {
            return res.redirect('/admin/login');
        }
        next();
    },

    isLogin: (req, res, next) => {
        if (req.session.admin) {
            return res.redirect('/admin/dashboard');
        }
        next();
    }
};
