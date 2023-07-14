require('dotenv').config();
const express = require('express')
const router = express.Router()
var prisma = require("./DB/prisma")
const cors = require("cors");
const app = express()
const port = process.env.PORT

var indexRouter = require('./routes/index');
var urlsRouter = require('./routes/urls');
var userRouter = require('./routes/users');


// var whitelist = ['http://localhost:3000']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
// app.use(cors(corsOptions))
app.use(cors())
app.use(express.json());

app.use('/', indexRouter);
app.use('/urls', urlsRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send the error message
  res.status(err.status || 500);
  res.send('error');
});
module.exports = app;

//Section 6
app.get("/", (req, res) => {
})

app.listen(port);  