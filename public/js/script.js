const weatherForm=document.querySelector("form");
const search=document.querySelector("input");
let weather=document.getElementById("weather")
weatherForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const location=search.value;
    weather.innerText=`Searching for weather of ${location}...`
    fetch(`http://127.0.0.1:3000/weather/${location}`).then((response)=>{
        if(response.ok){
            response.json().then((result)=>{
                weather.innerText=`City Name: ${result.location.name}\n
                Temperature: ${result.current.temperature}\n
                Weather Description: ${result.current.weather_descriptions[0]}\n
                Wind Speed: ${result.current.wind_speed} km/h\n
                Humidity: ${result.current.humidity}%\n
                Feels Like: ${result.current.feelslike}`;
                document.getElementById("icon").src=result.current.weather_icons[0]
            })
        }else{
            weather.innerText=`Permission denied for ${location} weather.`
        }
    })
})