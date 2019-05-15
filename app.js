const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");

const auth = require("./auth");
const middleware = require("./middleware");

const dashboardRouter = require("./routes/dashboard");
const publicRouter = require("./routes/public");
// const usersRouter = require("./routes/users");


// App initialization
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "assets")));

app.use(session({
  secret: 'xinchaocacban',
  resave: true,
  saveUninitialized: false
}));

app.use(auth.oidc.router);
// app.use(oidc.router);
app.use(middleware.addUser);
// oidc & oktaclient
app.use((req, res, next) => {
  if (!req.userinfo) {
    return next();
  }

  auth.oktaClient.getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
    }).catch(err => {
      next(err);
    });
});
// Routes
app.use("/", publicRouter);
app.use("/dashboard", middleware.loginRequired, dashboardRouter);
// app.use("/users", usersRouter);

// Error handlers
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});


module.exports = app;
