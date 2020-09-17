const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const key = require(__dirname + "/config.js");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res) {
    res.render("Home");
});

app.post("/", function(req, res) {
    const query = req.body.cityName;
    const apikey = key.getApiKey();
    const unit = "imperial";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query +"&appid=" + apikey + "&units=" + unit;

    https.get(url, function(response) {
        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const iconImageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<h1>The temperature in " + query + " is " + temp + " degrees farenheit.</h1>");
            res.write("<p>The weather is currently " + description + "</p>");
            res.write("<img src=" + iconImageURL + ">");
            res.send();

            console.log(temp);
            console.log(description);
            
        });
    });
});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});