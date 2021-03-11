//variables

var city="";
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidity = $("#humidity");
var currentWSpeed = $("#wind-speed");
var currentUVindex = $("#uv-index");
var sCity=[];


var APIkey="c7266c368d6f532573a6d18eb1c26493";



function find(c){  // city search from local storage
  for (var i=0; i<sCity.length; i++){
    if (c.toUpperCase()===sCity[i]){
      return -1;
    }
  }
  return 1;
}


function displayWeather(event){ //display current and future weather
  event.preventDefault();
  if(searchCity.val().trim()!=="") {
    city=searchCity.val().trim();
    currentWeather(city);
  }
}


function currentWeather(city){ //get data from the server side
  var queryurl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIkey;
  
  $.ajax({
    url:queryurl,
    method:"GET"
  }).then(function (response) {
    console.log(response);

    var weathericon = response.weather[0].icon
    var iconurl = "http://openweathermap.org/img/w/" + weathericon + ".png"; //weather icons
    $(".icon").html("<img src='" + iconurl  + "'>");

    var date=new Date(response.dt*1000).toLocaleDateString();
    currentCity.html(response.name + "("+date+")" + "<img src="+iconurl+">"); //date format

    var tempF = (response.main.temp - 273.15) * 1.80 +32;
    currentTemperature.html((tempF).toFixed(2)+"&#8457");  //farenheit temp and symbol

    currentHumidity.html(response.main.humidity+"%"); //humidity
  

    var ws=response.wind.speed;
    var windsmph=(ws*2.237).toFixed(1);
    console.log(windsmph);
    currentWSpeed.html(windsmph+"MPH"); //wind speed

    UVindex(response.coord.lon, response.coord.lat); //get UV Index by coordinates
    forecast(response.id);
    if (response.cod==200){
      sCity=JSON.parse(localStorage.getItem("cityname"));
      if (sCity==null){
          sCity=[];
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
    }
  });

}


// UV Index response
function UVindex(ln,lt){  
  var uvqurl = "https://api.openweathermap.org/data/2.5/uvi?appid="+ APIkey+"&lat="+lt+"&lon="+ln;
  $.ajax({
    url:uvqurl,
    method:"GET"
  }).then(function(response){
        $(currentUVindex).html(response.value);
      });
}

// 5 day forecast display

function forecast(cityid) {
  var queryforecasturl = "https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIkey;
  $.ajax({
    url:queryforecasturl,
    method:"GET"
  }).then(function(response){

      for (i=0;i<5;i++){
        var date = new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
        var iconcode =response.list[((i+1)*8)-1].weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
        var tempK= response.list[((i+1)*8)-1].main.temp;
        var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
        var humidity= response.list[((i+1)*8)-1].main.humidity;

        $("#fDate"+i).html(date);
        $("#fImg"+i).html("<img src="+iconurl+">");
        $("#fTemp"+i).html(tempF+"&#8457");
        $("#fHumidity"+i).html(humidity+"%");

      }

  });
}

// add city to search history
function addToList(c){
  var listEl= $("<li>" +c.toUpperCase()+"</li>");
  $(listEl).attr("class","list-group-item");
  $(listEl).attr("data-value", c.toUpperCase());
  $(".list-group").append(listEl);
}

//render last cities

function loadlastCity(){
  $("ul").empty();
  var sCity = JSON.parse(localStorage.getItem("cityname"));
  if(sCity!==null){
    sCity=JSON.parse(localStorage.getItem("cityname"));
    for(i=0; i<sCity.length;i++){
      addToList(sCity[i]);
    }
    city=sCity[i-1];
    currentWeather(city);
  }
}

function clearHistory(event){
  event.preventDefault();
  sCity=[];
  localStorage.removeItem("cityname");
  document.location.reload();
}


$("#search-button").on("click", displayWeather);
$(window).on("load",loadlastCity);
$("#clear-history").on("click", clearHistory);
