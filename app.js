const dotenv = require('dotenv');
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const passport = require('passport');
const passportConfig = require('./passport_config');
const MongoDBStore = require('connect-mongodb-session')(session);
const fileUpload = require('express-fileupload');
const path = require('path');

function getExtension(filename) {
  let i = filename.lastIndexOf('.');
  return (i < 0) ? '' : filename.substr(i);
}

global.rootDir = __dirname;

dotenv.config({path: './config/config.env'});

global.dbConfig = require("./config/db.config");
const authConfig = require("./config/auth.config");

require('./mongo_connector')();
const sessionStore = new MongoDBStore({
  uri: `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,
  databaseName: dbConfig.DB,
  collection: 'sessions',
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
  }
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const whitelist = ['http://developer1.com', 'http://developer2.com']
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(null, true);
      //callback(new Error())
    }
  }
}

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
passportConfig(passport);
let sess = session({
  key: 'token',
  secret: authConfig.secret,
  store: sessionStore,
  name: 'token',
  touchAfter: 24 * 3600, resave: true, saveUninitialized: true, autoRemove: 'native',
  cookie: {secure: false, maxAge: new Date().getTime() + (60 * 60 * 24 * 1000 * 7)},
});
app.use(sess);

app.use(passport.initialize());
app.use(passport.session());

const middlewares = require('./middlewares');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const categoryRouter = require('./routes/category');
const bannerRouter = require('./routes/banner');
const blogRouter = require('./routes/blog');
const s3Manager = require('./services/s3manager');

// app.use((req, res, next) => {
//   console.log(req.headers);
//   next();
// });

app.use('/', indexRouter);
app.use('/', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/banner', bannerRouter);
app.use('/api/blog', blogRouter);

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));
app.post('/upload', middlewares.adminCheck, function(req, res, next) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  req.files = Object.assign({},req.files)['file'];
  let file = req.files.tempFilePath;
  let fileName = req.files.name;
  let ext = getExtension(fileName);
  s3Manager.uploadFile(file, ext, (err, result) => {
    if(err) {
      next(err);
    } else {
      res.send(result);
    }
  });
});

app.get('/file/:file', s3Manager.getFile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({"status": "Error", "message": err.message || "Unknown Error"});
});

module.exports = app;