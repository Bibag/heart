if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
//Require Modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const passportLocal = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const User = require('./models/user');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//Require Routes
const userRoutes = require('./routes/users');
const heartRoutes = require('./routes/hearts');
//Connect to mongo database
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/Bitu-Test';
mongoose.connect(dbUrl)
    .then(() => console.log('Database connected!'))
    .catch(error => console.log('Database connect error!', error));
//Execute express
const app = express();
//Config express
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//Config and use method
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
// app.use(methodOverride('_method'));
app.use(mongoSanitize({
    replaceWith: '_'
}));
//Create new store
const secret = process.env.SECRET || 'thisshouldbeabettersecret';
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 3600
})
store.on('error', function (error) {
    console.log("SESSION STORE ERROR!", error);
})
//Config and use express-session
const sessionConfig = {
    store,
    name: 'BITU_session',
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
//Config statics serve
app.use(express.static(path.join(__dirname, 'public')));
//Config flash
app.use(flash());
//Use helmet contentSecurePolicy
const scriptSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://www.bootstrapcdn.com/",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://unpkg.com",
    "*.pusher.com",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://kit-free.fontawesome.com",
    "https://www.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://events.mapbox.com",
    "https://sockjs-ap1.pusher.com",
    "wss://ws-ap1.pusher.com",
    "wss://ws-ap1.pusher.com:443",
    "https://sockjs-ap1.pusher.com:443",
    "*.pusher.com"
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/wizzardimages/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
                "https://bitu.vn/",
                "https://images.pexels.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//Config passport
// Initializing Passport
app.use(passport.initialize());
// Starting the session
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Use middleware to set local key values to use in all templates
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});
//Use routes

app.use('/', userRoutes);
app.use('/heart', heartRoutes);

//Home  route
app.get('/', (req, res) => {
    res.render('home');
});

//Other return Not found
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

//Middletwaer handle error
app.use((error, req, res, next) => {
    const { statusCode = 500 } = error;
    if (!error.message) error.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode);
    res.render('error', { error });
});

//Catching uncaught exceptions
process.on('uncaughtException', err => {
    console.error('There was an uncaught error', err)
    process.exit(1)
})


//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}!`);
});