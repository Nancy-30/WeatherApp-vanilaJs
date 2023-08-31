const cityInput = document.querySelector(".city-input");
const serachBtn = document.querySelector(".search-btn");
const locationBtn = document.querySelector(".location-btn");
const currDiv = document.querySelector(".current-weather");
const weatherDiv = document.querySelector(".weather-cards");

// openWeatherMap api key
const API_KEY = "4b09a7755b5444d39c2b387a1fb3ebde";

const createWeatherCard = (cityName, weatherItem, index) => {
  if (index === 0) {
    return `<div class="details">
      <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]} )</h2>
      <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}C</h6>
    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
    </div>
    <div class = "icon">
    <img src = "https://openweathermap.org/img/wn/${
      weatherItem.weather[0].icon
    }@4x.png" alt = "weather icon">
    <h4>${weatherItem.weather[0].description}</h4>
    `;
  } else {
    return `<li class="card">
    <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
    <img src = "https://openweathermap.org/img/wn/${
      weatherItem.weather[0].icon
    }@2x.png" alt = "weather icon">
    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}C</h6>
    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
  </li>`;
  }
};

const getWeatherDetails = (cityName, lat, lon) => {
  // api for weather details
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();

        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });

      cityInput.value = "";
      weatherDiv.innerHTML = "";
      currDiv.innerHTML = "";
      fiveDaysForecast.forEach((weatherItem, index) => {
        if (index === 0) {
          currDiv.insertAdjacentHTML(
            "beforeend",
            createWeatherCard(cityName, weatherItem, index)
          );
        } else {
          weatherDiv.insertAdjacentHTML(
            "beforeend",
            createWeatherCard(cityName, weatherItem, index)
          );
        }
      });
    })
    .catch(() => {
      alert("Error occured");
    });
};

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim(); // trim extra space from the inputed city
  if (!cityName) {
    alert("Enter the city name");
  }

  const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`; //api for coordinates

  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) return alert(`No coordinates found for ${cityName}`);
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      alert("Error in feteching the coordinates");
    });
};

const getUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

      // city coordinates using reverse geocoding api
      fetch(REVERSE_GEOCODING_URL)
        .then((res) => res.json())
        .then((data) => {
          if (!data.length)
            return alert(`No coordinates found for ${cityName}`);
          const { name } = data[0];
          getWeatherDetails(name, latitude, longitude);
        })
        .catch(() => {
          alert("Error in feteching the city");
        });
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert("permission denied");
      }
    }
  );
};
serachBtn.addEventListener("click", getCityCoordinates);
locationBtn.addEventListener("click", getUserCoordinates);
cityInput.addEventListener(
  "keyup",
  (e) => e.key === "Enter" && getUserCoordinates
); //use enter key to find the city
