const axios=require('axios');
const apiKey='262b8e5a905b6731af368d7496850179';
const apiAddress='http://api.weatherstack.com/current'

const getWeather=async(city='tabriz')=>{
    const data=await callApi(city);
    return data
}

const callApi=async(city)=>{
    const endPoint=`${apiAddress}?access_key=${apiKey}&query=${city}`;
    const response=await axios.get(endPoint);
    return response.data

}

const showResult=(weather)=>{
    const weatherObj={
        City_Name:weather.location.name,
        Temperature:weather.current.temperature,
        Weather_Description:weather.current.weather_descriptions[0],
        Wind_Speed:weather.current.wind_speed,
        Humidity:weather.current.humidity,
        Feels_Like:weather.current.feelslike
    }
    console.table(weatherObj);
}
const weatherObject={
    getWeather
}
module.exports=weatherObject;