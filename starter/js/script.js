var apiKey = "29b9a6dfa87724598ef9c7b35a755e4c";
var weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
var iconUrl = "https://openweathermap.org/img/w/";
var history = new Set(JSON.parse(localStorage.getItem("searchHistory")));

var form = document.querySelector("form");
var cityInput = form.querySelector("input");
var currentCity = document.querySelector(".city-name");
var currentDate = document.querySelector(".current-date");
var currentTemp = document.querySelector(".current-temp");
var currentWind = document.querySelector(".current-wind");
var currentHumidity = document.querySelector(".current-humidity");
var currentIcon = document.querySelector(".current-icon");
var forecastCards = document.querySelector(".forecast-cards");
var searchHistory = document.querySelector(".search-history");


window.addEventListener("load", function () {
  renderSearchHistory();

  fetchCityWeatherInfo("London").then((data) => {
    fetchForecast(data.coord.lat, data.coord.lon);
  });
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (cityInput.value.trim().length === 0) 
  return ;

  var text = cityInput.value.trim();

  fetchCityWeatherInfo(text)
  .then((data) => {
    fetchForecast(data.coord.lat, data.coord.lon);
  });
   .then(() => {
    history.add(text.toLowerCase());
    renderSearchHistory();
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

function fetchForecast(lat, lon) {
  fetch(forecastUrl + `?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then((res) => res.json())
    .then((data) => data.list)
    .then((data) =>
      data.reduce((acc, item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();

        if (date === new Date().toLocaleDateString()) return acc;

        acc[date] = {
          date,
          timestamp: item.dt,
          temp: item.main.temp.toFixed(2),
          wind: item.wind.speed,
          humidity: item.main.humidity,
          iconUrl: iconUrl + item.weather[0].icon + ".png",
          iconDescription: item.weather[0].description,
        };
        return acc;
      }, {})
    )
    .then((data) =>
      Object.values(data).sort((a, b) => a.timestamp - b.timestamp)
    )
    .then((data) => data.map(renderForecast))
    .then((data) => {

        forecastCards.innerHTML = "";
      return data.forEach((forecast, index) => {
        forecastCards.appendChild(forecast);
      });
    })
    .catch((e) => console.log(e.message));
}

function renderForecast(data) {
  const { date, temp, wind, humidity, iconUrl, iconDescription } = data;

  const div = document.createElement("div");
  div.classList.add("forecast");
  div.innerHTML = `
          <header>
            <h3>${date}</h3>
            <img src="${iconUrl}" alt="${iconDescription}">
          </header>
          <p>Temp: ${temp} ºC</p>
          <p>Wind: ${wind} KPH</p>
          <p>Humidity: ${humidity}%</p>
  `;
  return div;
}

function renderSearchHistory() {
  searchHistory.innerHTML = "";
  history.forEach((item) => {
    const searchButton = document.createElement("button");
    searchButton.textContent = item;
    searchButton.addEventListener("click", (e) => {
      fetchCityWeatherInfo(item).then((data) => {
        fetchForecast(data.coord.lat, data.coord.lon);
      });
    });
    searchHistory.appendChild(searchButton);
  });
  localStorage.setItem("searchHistory", JSON.stringify([...history]));
}