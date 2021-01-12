// var cityName = ["Austin", "Chicago", "New York", "Orlando", "San Francisco", "Seattle"];


$("#button-addon").on("click", function() {
  event.preventDefault();
  renderSerachHistory();
  renderWeather()
});
renderSerachHistory();

// in the render history the postion of double cate value didnt' change ?? SHOULD BE FIXED
function renderSerachHistory() {
  // Set the local storage of search history if there is not an exicting one
  if (localStorage.getItem("city-name") == null) {
    localStorage.setItem("city-name", []);
  };

  // convert the localstorage into an array
  var updateArray = localStorage.getItem("city-name").split(',')

  // pushing new input values to the array
  var inputCity = $("#input-city").val();
  if (inputCity !== "" && updateArray.indexOf(inputCity) == -1) {
      updateArray.push(inputCity);
      localStorage.setItem("city-name", updateArray); 
  };
  
  // embed the html of search history
  $(".city-names").text("");
  for (i=updateArray.length-1; i > 0; i--) {
    var newLi = $("<li>");
    newLi.attr("class", "list-group-item");
    newLi.text(updateArray[i]);
    $(".city-names").append(newLi);
  }
};


function renderWeather() { 
  const unitMeasurement = "imperial";
  const inputCity = $("#input-city").val();
  const APIkey = "2064fd52831d78f096a7805f39e69981";
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+inputCity+"&appid="+APIkey+"&units="+unitMeasurement;
  
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(respones) {

    // city name
    $("#current-city").text(respones.name);

    // current date
    $("#current-date").text("("+unixToDate(respones.dt)+")");

    // weather icon
    var newImg = $("<img>");
    newImg.attr("src", "http://openweathermap.org/img/w/"+respones.weather[0].icon+".png");
    newImg.attr("alt", "Weather Icon");
    $("#current-date").append(newImg);
    
    // temperature in F, unit imperial
    $("#current-temp").text("Temperature: "+ respones.main.temp + "\u00B0F");
    // humidity %
    $("#current-humidity").text("Humidity: "+ respones.main.humidity + "%");
    // wind speed MPH
    $("#current-weedSpeed").text("Wind Speed: "+ respones.wind.speed + " MPH");
    // UV Index
    queryURL = "http://api.openweathermap.org/data/2.5/uvi?lat="+respones.coord.lat+"&lon="+respones.coord.lon+"&appid="+APIkey;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(respones) {

      $("#current-UVindex").text("UV Index: ");
      var newSpan = $("<span>");
      var UVindex = respones.value;
      if (UVindex < 2.1) {
        newSpan.attr("class", "alert alert-success");
      } else if (UVindex < 6.1) {
        newSpan.attr("class", "alert alert-warning");
      } else {
        newSpan.attr("class", "alert alert-danger");
      }
      newSpan.text(UVindex);
      $("#current-UVindex").append(newSpan);
    });

    // 5-Days Forecast
    queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+respones.coord.lat+"&lon="+respones.coord.lon+"&units="+unitMeasurement+"&appid=2064fd52831d78f096a7805f39e69981"
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(respones) {
      $(".5Forecast-title").removeAttr("hidden");
      $(".5Forecast").empty();

      for (i=1; i < 6; i++) {

        var newDiv = $("<div>");
        newDiv.attr("class", "col");
        $(".5Forecast").append(newDiv);

        var newDiv2 = $("<div>");
        newDiv2.attr("class", "card h-100 bg-primary text-light");
        newDiv.append(newDiv2);

        var newDiv3 = $("<div>");
        newDiv3.attr("class", "card-body");
        newDiv2.append(newDiv3);

        var newh5 = $("<h5>");
        newh5.attr("class", "card-title");
        newh5.text(unixToDate(respones.daily[i].dt));
        var newImg = $("<img>");
        newImg.attr("src", "http://openweathermap.org/img/w/"+respones.daily[i].weather[0].icon+".png");
        var newP = $("<p>");
        newP.attr("class", "card-text");
        newP.text("Temperature: "+ respones.daily[i].temp.day + "\u00B0F")
        var newP2 = $("<p>");
        newP2.attr("class", "card-text");
        newP2.text("Humidity: "+ respones.daily[i].humidity + "%")
        newDiv3.append(newh5, newImg, newP, newP2);
      }
    });   
  });
}





function unixToDate(unixDate) {
  var UnixTime = unixDate; 
  var myDate = new Date(UnixTime*1000);
  return myDate.toLocaleDateString(); 
}





