const express = require("express");
const http = require("http");
const path = require("path");
const logger = require("morgan");
const session = require("express-session");
const expressValidator = require("express-validator");
const cookieParser = require("cookie-parser");
const isLoggedIn = require("./utils/isLoggedIn");
const authChecker = require("./utils/authCheck");

let app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use(logger("dev"));

// Built-in middleware function in Express. It parses incoming request with JSON payloads and is based on body-parser
app.use(express.json());
app.use(cookieParser("super-secret"));

let user = {};

app.use(
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
  res.send(req.query);
  //res.send({name: 'Jimmy'});
});
// P O S T
app.post("/", (req, res, next) => {
  res.send(req.body);
});

app.post("/users/login", (req, res, next) => {
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
        user.email = req.body.email
        user.password = req.body.password

        req.session.user = req.body.username

        res.redirect('/show-me-my-page')
    }
    console.log(errors)
})
// G E T


app.get("/show-me-my-page", function(req, res, next) {
    if (req.session.user) {
        console.log(132)
        res.render("index", { user: req.session.user });
    } else {
        console.log(134)
    res.render("index", { user: null });
  }
});

app.get("/register", isLoggedIn, (req, res, next) => {
  res.render("register", { error_msg: false });
});

app.get("/users/login", isLoggedIn, (req, res, next) => {
  res.render("login", { success_msg: false, error_msg: false });
});

app.get('/users/logout', (req, res) => {
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
