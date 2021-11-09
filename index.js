if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const helmet = require("helmet");

//const catchAsync = require('./utils/catchAsync');
const ExpressError = require("./utils/ExpressError");

const mongoSanitize = require('express-mongo-sanitize');

const walksRoutes = require("./routes/walks");
const commentsRoutes = require("./routes/comments");
const usersRoutes = require("./routes/users");


const MongoDBStore = require("connect-mongo");
// const dbUrl = process.env.DB_URL;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/dogApp';
// 'mongodb://localhost:27017/dogApp'
mongoose.connect(dbUrl, {        
	useNewUrlParser: true,									
	useUnifiedTopology: true });
   
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize({
    replaceWith: '_'
}))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

// const store = new MongoDBStore({
//     url: dbUrl,
//     secret,
//     touchAfter: 24 * 60 * 60
// });

// store.on("error", function (e) {
//     console.log("SESSION STORE ERROR", e)
// })

const sessionConfig = {
	store: MongoDBStore.create({
		mongoUrl:dbUrl,
		touchAfter: 24 * 3600 // time period in seconds
	}),
	name: 'session',
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",	
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com/jquery-3.6.0.min.js",   
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",	
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com/",	
    "https://use.fontawesome.com/",	             
	"https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",	
];
const fontSrcUrls = [
	"https://use.fontawesome.com/",
	"https://fonts.gstatic.com/",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/yolupa/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.locals.moment = require('moment');
 require("moment/min/locales.min");

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	//console.log(req.session);	
	// console.log(req.query);	
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success"),
	res.locals.error = req.flash("error"),
	next();	
})

app.use('/', usersRoutes);
app.use('/walks', walksRoutes);
app.use('/walks/:id/comments', commentsRoutes);


app.get("/",  (req, res) => {		   
	    res.render("home")		
})


app.all("*", (req, res, next) => {
	next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if(!err.message) err.message = "Something Went Wrong"
	res.status(statusCode).render("error", {err});
})





app.listen(3000, () => {
	console.log("APP IS LISTENING ON PORT 3000")
})