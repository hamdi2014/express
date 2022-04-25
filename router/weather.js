const express=require("express");
const router=express.Router();
const weather=require('../weather');

const weatherPolicy=(req,res,next)=>{
    if(req.params.city==='london') return res.send(404)
    next()
}

router.get('/', async(req, res) => {
    // const data=await weather.getWeather();
    res.render('weather',{
        title:"Weather",
        h1Title:"Get weather",
        // content:`${data.location.name} temperature is ${data.current.temperature}.`
    })
});

router.get('/:city',weatherPolicy, async(req, res) => {
    const data=await weather.getWeather(req.params.city);
    res.send(data);
});

module.exports=router;