const express = require("express");
const app = express();
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const nocache = require("nocache");
const connectDB = require("./db/collectDB");


const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');

app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'mysecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false,
    }
}));

app.use(nocache());

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

(async () => {
    try {
        await connectDB();
        console.log("MongoDB connected successfully");

       
        // app.use((req, res) => {
        //     res.status(404).render('404');
        // });

        // app.use((err, req, res, next) => {
        //     console.error(err.stack);
        //     res.status(500).render('500');
        // });

        app.listen(3000, () => {
            console.log(" Server started on http://localhost:3000");
        });
    } catch (err) {
        console.error(" Failed to start server:", err);
        process.exit(1);
    }
})();