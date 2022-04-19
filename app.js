const express = require('express');
const path=require("path");
const hbs=require('hbs');
const morgan=require('morgan');
const weather=require('./weather');
const app = express()
const port = 3000;

const publicDirectoryPath=path.join(__dirname,'/public');
const viewDirectoryPath=path.join(__dirname,'/template');
const partialDirectoryPath=path.join(viewDirectoryPath,'/partials')

app.set('view engine','hbs')
app.use(express.static(publicDirectoryPath));
app.set('views',viewDirectoryPath);
hbs.registerPartials(partialDirectoryPath);

const log=(req,res,next)=>{
    if(req.originalUrl==='/favicon.ico') return next()
    console.log(req.originalUrl);
    next();
}

const weatherPolicy=(req,res,next)=>{
    if(req.params.city==='london') return res.send(404)
    next()
}

// app.use(log)
app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.render('basePage',{
      title:"Home page",
      h1Title:"Home page",
      content:"Welcome to Home page."
  })
})

app.get('/about', (req, res) => {
    res.render('basePage',{
        title:"About me",
        h1Title:"About me page",
        content:"Hi! I am Hamdollah."
    })
});

app.get('/weather', async(req, res) => {
    // const data=await weather.getWeather();
    res.render('weather',{
        title:"Weather",
        h1Title:"Get weather",
        // content:`${data.location.name} temperature is ${data.current.temperature}.`
    })
});

app.get('/weather/:city',weatherPolicy, async(req, res) => {
    const data=await weather.getWeather(req.params.city);
    res.send(data);
});

app.get('/contact',(req,res)=>{
    res.render('basePage',{
        title:"Contact",
        h1Title:"Contact us page",
        content:"Welcome to Contact page."
    })
})

app.get('*', (req, res) => {
    res.status(404)
    res.render('error404',{
        title:"Error",
        h1Title:"Error 404!",
        error:"Page not found :("
    })
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})