var apiKey = "29b9a6dfa87724598ef9c7b35a755e4c";
var city = "London";
var iconUrl = "https://openweathermap.org/img/w/";

fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
)
  .then(function (res) {
    return res.json();
  })
  .then(function (currentData) {
    console.log(`
    Temp: ${Math.round(currentData.main.temp)}
    Wind: ${currentData.wind.speed}
    Humidity: ${currentData.main.humidity}%
    Icon URL: ${iconUrl + currentData.weather[0].icon + ".png"}
  `);

    return currentData;
  })
  .then(function (currentData) {
    return fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=${apiKey}&units=metric`
    );
  })
  .then(function (res) {
    return res.json();
  })
  .then(function (forecastData) {
    console.log(forecastData);
  });
