const express = require('express');
const path = require("path");
const hbs = require('hbs');
const morgan = require('morgan');
const cookieParser=require('cookie-parser');
const appConfig=require("./configs/app")

const app = express()
const port = appConfig.port;
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

app.use((err,req,res,next)=>{
    console.log(err);
    res.status(err.status?err.status:500).json({
        status:err.status?err.status:500,
        message:err.message?err.message:"Something wrong! Please try again later..."
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})