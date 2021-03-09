//variables

var city="";
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidity = $("humidity");
var currentWSpeed = $("wind-speed");
var currentUVindex = $("uv-index");
var sCity=[];


var APIkey="c7266c368d6f532573a6d18eb1c26493";


function displayWeather(event){
  event.preventDefault();
  if(searchCity.val().trim()!=="") {
    city=searchCity.val().trim();
    currentWeather(city);
  }
}


function currentWeather(city){
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIkey;
  
  $.ajax({
    url:queryURL,
    method:"GET"
  }).then(function (response) {
    console.log(response);

    var weathericon = data.weather[0].icon
    var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png"; //weather icons
    $(".icon").html("<img src='" + iconurl  + "'>");

    var date = newDate(response.dt*1000).toLocaleDateString();
    $(currentCity).html(response.name + "("+date+")" + "<img src="+iconurl+">"); //date format

    var tempF = (response.main.temp - 273.15) * 1.80 +32;
    $(currentTemperature).html((tempF).toFixed(2)+"&#8457");  //farenheit temp and symbol

    $(currentHumidity).html(response.main.humidity+"%"); //humidity

    var ws=response.wind.speed;
    var windsmph=(ws*2.237).toFixed(1);
    $(currentWSpeed).html(windsmph+"MPH"); //wind speed

    UVIndex(response.coord.lon, response.coord.lat); //get UVIndex by coordinates
    forecast(response.id);
    if (response.cod==200){
      sCity.push(city.toUpperCase());
      localStorage.setItem("cityname", JSON.stringify(sCity));
      addToList(city);
    }
    else {
      if(find(city)>0){
        sCity.push(city.toUpperCase());
        localStorage.setItem("cityname",JSON.stringify(sCity));
        addToList(city);
      }
    }

  });

}


// UVI Index response
function UVIndex(ln,lt){  
  var uvqURL = "https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
  $.ajax({
    url:uvqURL,
    method:"GET"
  }).then(function(response){
        $(currentUvindex).html(response.value);
      });
}

// 5 day forecast display

function forecast(cityid) {
  var queryforecastURL = "https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
  $.ajax({
    url:queryforecastURL,
    method:"GET"
  }).then(function(response){

      for (i=0;i<5;i++){
        var date = new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
        var iconCode =response.list[((i+1)*8)-1].weather[0].icon;
        var iconUrl="https://openweathermap.org/img/wn/"+iconcode+".png";
        var tempK= response.list[((i+1)*8)-1].main.temp;
        var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
        var humidity= response.list[((i+1)*8)-1].main.humidity;

        $("#fDate"+i).html(date);
        $("#fImg"+i).html("<img src="+iconUrl+">");
        $("#fTemp"+i).html(tempF+"&#8457");
        $("#fHumidity"+i).html(humidity+"%");

      }

  });
}

$("#search-button").on("click", displayWeather);
