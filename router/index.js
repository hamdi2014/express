const express=require("express");
const router=express.Router();
const weatherRouter=require("./weather");
const userRouter=require("./user");
const taskRouter=require("./task");
const authRouter=require('./auth');
const jwt=require('jsonwebtoken');
const {isLoginBySession,isLoginByJasonWebToken}=require('../tools/auth');
const upload=require('../tools/upload').upload;

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
router.use('/users',isLoginBySession,userRouter);
router.use('/tasks',isLoginBySession,taskRouter);

router.get('/test',(req,res)=>{
    const token=jwt.sign({myName:'Hamdollah'},'fuCamp');
    res.json({token});
    
});

router.get('/test/auth',isLoginByJasonWebToken,(req,res)=>{
    res.json(req.user)
})

router.get('/test/:token',(req,res)=>{
    const decode=jwt.decode(req.params.token);
    res.json({decode});;
});

router.get('/test/verify/:token',(req,res)=>{
    const verify=jwt.verify(req.params.token,"fuCamp");
    res.json({verify});;
    
});

router.post('/upload',upload.single("myFile"),async(req,res)=>{
    res.sendStatus(200)
})

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