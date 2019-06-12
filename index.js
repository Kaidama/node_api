const express = require("express");
const http = require("http");
const path = require("path");
const logger = require("morgan");
const session = require("express-session");
const expressValidator = require("express-validator");
const cookieParser = require("cookie-parser");
const isLoggedIn = require("./utils/isLoggedIn");
const authChecker = require("./utils/authCheck");
// 1. client => [1st call] get(request from server ) >>
// 2. response from server:  >> 
let app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// exactly does what it says. This is a type of console log for development use in nodemon aka node monitor
app.use(logger("dev"));


// Built-in middleware function in Express. It parses incoming request with JSON payloads and is based on body-parser
app.use(express.json());
app.use(cookieParser("super-secret"));

let user = {};

app.use(
  // session used by app is a
  session({
    secret: "super-secret",
    saveUninitialized: false,
    resave: false,
    cookies: {
      secure: false,
      maxAge: 365 * 24 * 60 * 60 * 1000
    }
  })
);

app.use(
  expressValidator({
    errorFormatter: (params, message, value) => {
      let namespace = params.split(".");
      let root = namespace.shift();
      // remove the slash'/' and 
      let formParam = root;

      while (namespace.length) {
        formParam = +"[" + namespace.shift() + "]";

      }
      return {
        params: formParam,
        message: message,
        value: value
      };
    }
  })
);

let server = http.createServer(app);
// G E T
app.get("/", (req, res, next) => {
  console.log(req.session);
  console.log(req.cookies);

  if (req.query) {
    next();

    return;
  }
  res.send("Hey FOlks");
});

app.get("/", (req, res, next) => {
  console.log(req.query);
  console.log(`req.query: `, req.query );
  
  res.send(req.query);
});
// P O S T
app.post("/", (req, res, next) => {
  //the body is currently empty at this stage {}
  // this also creates a starting point for POST
  
  res.send(req.body);
});

app.post("/users/login", (req, res, next) => {
  
  // <form method="POST" action="/users/login"> (BUTTON is a handler due to the nature of FORM METHOD)** note you could also create 2 different methods of submit under one form. GET && POST

  // {current} ** when filled out and submitted => {behaviors.below()} are requests for checking of properties "password" and values that will pass or fail certain conditions. 

  // morgan_module = LOGGER is determined by the namespaces we initialized the app with validator, which is why we are able to GET/REQ(below) *** assuming SAVED DATA or user has already registered *** 
  req
    .checkBody("password")
    .equals(user.password)
    .withMessage("Password does not match");
  req
    .checkBody("email")
    .notEmpty()
    .withMessage("Please enter a email") 

  let errors = req.validationErrors();

  if (errors) {
    res.render("login", {
      error_msg: true,
      errors: errors,
      success_msg: false
    });
  } else {
    req.session.user = req.body.email;
    res.redirect("/show-me-my-page");
  }
});



app.post("/users/register", authChecker, (req, res) => {
    
    let errors = req.validationErrors()
    
    if (errors) {
        res.render('register', { error_msg: true, errors: errors })
    } else {
      
      // this POST is to request the 
      // the request currently is an empty object, when the conditions above fails to execute, the empty {user} object is now set to the submitted {body[properties]}
        user.email = req.body.email
        user.password = req.body.password

        req.session.user = req.body.username
        //session extends to user 
        res.redirect('/show-me-my-page')
    }
    console.log(errors)
})
// G E T

// HOME INDEX (also redirected to when loggedin)
app.get("/show-me-my-page", function(req, res, next) {
    if (req.session.user) {
        console.log('user is logged in')
        res.render("index", { user: req.session.user });
    } else {
        console.log('please register or login')
    res.render("index", { user: null });
  }
});

// WHEN REGISTER IS CLICKED 
app.get("/register", isLoggedIn, (req, res, next) => {
  console.log('Please enter your information to register')
  res.render("register", { error_msg: false });
  
});
// RESET PASSWORD
app.get("/users/ResetPassword", isLoggedIn, (req, res, next) => {
    res.render("ResetPassword", { success_msg: true, error_msg: false})
})

// 
app.get("/users/login", isLoggedIn, (req, res, next) => {

  res.render("login", { success_msg: false, error_msg: false });
});

app.get('/users/logout', (req, res) => {
    // sessionData extends to other interfaces ie: 
    // 
    req.session.destroy()

    console.log('session: ', req.session)

    res.redirect('/show-me-my-page')
})



app.get("*", (req, res) => {
  res.send("Page is not found");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
//use nodemon

