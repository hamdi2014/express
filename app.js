const express = require('express');
const path = require("path");
const hbs = require('hbs');
const morgan = require('morgan');
const cookieParser=require('cookie-parser');

const app = express()
const port = 3000;
require('./db');
const indexRouter = require("./router/index")

const publicDirectoryPath = path.join(__dirname, '/public');
const viewDirectoryPath = path.join(__dirname, '/template');
const partialDirectoryPath = path.join(viewDirectoryPath, '/partials');

app.use(express.json());
app.set('view engine', 'hbs')
app.use(express.static(publicDirectoryPath));
app.set('views', viewDirectoryPath);
hbs.registerPartials(partialDirectoryPath);

app.use(cookieParser());
app.use(morgan('dev'));
app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})