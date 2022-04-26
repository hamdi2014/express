const express=require("express");
const router=express.Router();
const weatherRouter=require("./weather");
const userRouter=require("./user");
const taskRouter=require("./task");
const authRouter=require('./auth');
const isLogin=require('../tools/auth')

router.get('/', (req, res) => {
    res.render('basePage',{
        title:"Home page",
        h1Title:"Home page",
        content:"Welcome to Home page."
    })
  })
  
  router.get('/about', (req, res) => {
      res.render('basePage',{
          title:"About me",
          h1Title:"About me page",
          content:"Hi! I am Hamdollah."
      })
  });
  
  router.get('/contact',(req,res)=>{
      res.render('basePage',{
          title:"Contact",
          h1Title:"Contact us page",
          content:"Welcome to Contact page."
      })
  });
  
  router.use('/weather',weatherRouter);
  router.use('/auth',authRouter);
  router.use('/users',isLogin,userRouter);
  router.use('/tasks',isLogin,taskRouter);

  router.get('*', (req, res) => {
    res.status(404)
    res.render('error404',{
        title:"Error",
        h1Title:"Error 404!",
        error:"Page not found :("
    })
  });

  router.all('*', (req, res) => {
    res.sendStatus(404)
  });

  module.exports=router;