var apiKey = "29b9a6dfa87724598ef9c7b35a755e4c";
var weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
var iconUrl = "https://openweathermap.org/img/w/";

var form = document.querySelector("form");
var cityInput = form.querySelector("input");
var currentCity = document.querySelector(".city-name");
var currentDate = document.querySelector(".current-date");
var currentTemp = document.querySelector(".current-temp");
var currentWind = document.querySelector(".current-wind");
var currentHumidity = document.querySelector(".current-humidity");
var currentIcon = document.querySelector(".current-icon");
var forecastCards = document.querySelector(".forecast-cards");

window.addEventListener("load", function () {
  fetchCityWeatherInfo("London");
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  fetchCityWeatherInfo(cityInput.value).then((data) => {
    fetchForecast(data.coord.lat, data.coord.lon);
  });

  form.reset();
});

function fetchCityWeatherInfo(city) {
  return fetch(weatherUrl + `?q=${city}&appid=${apiKey}&units=metric`)
    .then((res) => res.json())
    .then((currentData) => {
      console.log(`
        City: ${currentData.name}
        Temp: ${Math.round(currentData.main.temp)}
        Wind: ${currentData.wind.speed}
        Humidity: ${currentData.main.humidity}%
        Icon URL: ${iconUrl + currentData.weather[0].icon + ".png"}
      `);

      currentCity.textContent = currentData.name;
      currentDate.textContent = new Date(
        currentData.dt * 1000
      ).toLocaleDateString();
      currentDate.datetime = new Date().toLocaleDateString();
      currentTemp.textContent = currentData.main.temp.toFixed(2);
      currentWind.textContent = currentData.wind.speed;
      currentHumidity.textContent = currentData.main.humidity;
      currentIcon.src = iconUrl + currentData.weather[0].icon + ".png";
      currentIcon.alt = currentData.weather[0].description;

      return currentData;
    })
    .catch((e) => console.log(e.message));
}
