//jshint esversion: 6

const express = require ("express");
const https = require ("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res){

  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req,res){
  console.log(req.body.cityName);
  //Location
  //var cityName = "melbourne";
  var city = req.body.cityName;
  var state = req.body.stateName;
  var country = req.body.countryName;
  var location = "";

  if (city.length > 0){
    if (state.length > 0){
      if (country.length > 0){
        location = city + "," + state + "," + country;
      } else {
        location = city + "," + state;
      }
    } else {
      location = city;
    }
  } else {
    location = "Melbourne";
  }

  const appID = "b9b2d5836efccc28194a6c76638429a0";

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid="+ appID +"&units=metric";

  https.get(url, function (response){
    response.on("data", function(data){
      console.log(response.statusCode);

      const weatherData = JSON.parse(data);

      //Temperature
      const temperature = weatherData.main.temp;

      //Weather description
      var weatherExtract = weatherData.weather[0].description;
      const weatherDescription = weatherExtract[0].toUpperCase() + weatherExtract.substring(1);

      //Weather icon
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      //Output to send to the root page
      res.write("<p>The temperature is " + temperature + "</p>");
      res.write("<p>The weather is " + weatherDescription + "</p>");
      res.write("<img src='" + imageURL + "'>");
      res.send();
    });
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server connected on port 3000");
});
