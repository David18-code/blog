
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let  mongoose = require('mongoose');
const dotgit = require('dotgitignore')();
//let MongoStore = require('connect-mongo');
let expressSession = require('express-session')
require('dotenv').config()

let route = require('./route');
const MongoStore = require('connect-mongo');


let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




//connect database
const dburl = process.env.DBURL
mongoose.connect(dburl).then((err)=>{
  console.log("database connected");
 });

// set auth and cookie
app.use(expressSession({
  secret: "a secrete",
  resave: false,
  store: MongoStore.create({
      mongoUrl: dburl,
      collectionName: "sessionWarehouse",
      useUnifiedTopology: true
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  saveUninitialized: true,

}));


app.use('/', route);




//SERVER
let PORT = 3000;
app.listen(PORT,()=>{
  console.log("App is running on PORT" + PORT)
});

module.exports = app;


