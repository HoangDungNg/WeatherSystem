const express = require('express');
const path = require('path');
const createError = require('http-errors');
const routes = require('./routes');
const app = express();
const port = 3000;

// for reading data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'Weather System';

app.use(express.static(path.join(__dirname, '/public')));

app.use('/', routes());

app.use((req, res, next) => {
  return next(createError(404, 'File not found'));
});

// this is handling errors middleware
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  console.error(err); // this displays the exact error for developers without leaking info to users
  const status = err.status || 500; // 500 indicates internal errors
  res.locals.status = status;
  res.status(status);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Server lisening on port ${port}`);
});
