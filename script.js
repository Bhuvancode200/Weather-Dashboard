const cityInput = document.getElementById("city-input");

const searchBtn = document.getElementById("search-btn");

// const inputField = document.querySelector("#city"); 
const loadingIndicator = document.getElementById("loading");

const errorContainer = document.getElementById("error-container");

const errorMessage = document.getElementById("error-message");

const currentWeather = document.getElementById("current-weather");

const forecastContainer = document.getElementById("forecast-container");

const forecastCards = document.getElementById("forecast-cards");
// Weather-Elements


const cityName = document.getElementById("city-name");

const currentDate = document.getElementById("current-date");

const weatherIcon = document.getElementById("weather-icon");

const weatherDescription = document.getElementById("weather-description");

const currentTemp = document.getElementById("current-temp");

const tempHigh = document.getElementById("temp-high");

const tempLow = document.getElementById("temp-low");

const humidity = document.getElementById("humidity");

const windSpeedoutput = document.getElementById("wind-speed");

//  OpenWeatherMap API key in here!
const API_KEY = "6e903b4b37ac6ea3f22f8cad007b04f5";

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast";
const ICON_URL = "https://openweathermap.org/img/wn/";


searchBtn.addEventListener("click", handleSearch);
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});


function init() 
{
  cityInput.focus();
}

function handleSearch() 
{
  const city = cityInput.value.trim();

  if (city === "") {
    showError("Please enter a city name");
    return;
  }

  fetchWeatherData(city);
}
function showLoading() 
{
  loadingIndicator.classList.remove("hidden");

  errorContainer.classList.add("hidden");
  currentWeather.classList.add("hidden");
  forecastContainer.classList.add("hidden");
}

let searchHistory = [];
function hideLoading() 
{
  loadingIndicator.classList.add("hidden");
}

function showError(message) 
{
  errorMessage.textContent = message;
  errorContainer.classList.remove("hidden");
  currentWeather.classList.add("hidden");
  forecastContainer.classList.add("hidden");
}

// fetches current  weather from the API.
async function fetchWeatherData(city) 

{
  showLoading();

  try {
    const weatherResponse = await fetch(`${WEATHER_API_URL}?q=${city}&units=metric&appid=${API_KEY}`);
    if (!weatherResponse.ok) {
      throw new Error(weatherResponse.statusText);
    }
    const weatherData = await weatherResponse.json();

    const forecastResponse = await fetch(`${FORECAST_API_URL}?q=${city}&units=metric&appid=${API_KEY}`);
    if (!forecastResponse.ok) {
      throw new Error(forecastResponse.statusText);
    }
    const forecastData = await forecastResponse.json();

    updateCurrentWeather(weatherData);
    console.log("Forecast loaded:", forecastData);
    updateForecast(forecastData);

    hideLoading();
    currentWeather.classList.remove("hidden");
    forecastContainer.classList.remove("hidden");
  } catch (error) {
    hideLoading();
    showError("City not found or network error. Please try again.");
    console.error("Error fetching weather data:", error);
  }
}

//current weather details onto the page.
function updateCurrentWeather(data) 

{
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  currentDate.textContent = formatDate(new Date());

  const iconCode = data.weather[0].icon;
  weatherIcon.src = `${ICON_URL}${iconCode}@2x.png`;
  weatherIcon.alt = data.weather[0].main;
  weatherDescription.textContent = data.weather[0].description;

  currentTemp.textContent = `${Math.round(data.main.temp)}°C`;
  tempHigh.textContent = `High: ${Math.round(data.main.temp_max)}°C`;
  tempLow.textContent = `Low: ${Math.round(data.main.temp_min)}°C`;

  humidity.textContent = `${data.main.humidity}%`;
 windSpeedoutput.textContent = `${data.wind.speed} m/s`;
}

function updateForecast(data)
 {
  forecastCards.innerHTML = "";

  const forecastList = data.list;
  const dailyData = getDailyForecast(forecastList);

  dailyData.forEach((day) => {
    const card = createForecastCard(day);
    forecastCards.appendChild(card);
  });
   }
function getDailyForecast(forecastList) {
  const dailyData = [];
  const today = new Date().setHours(0, 0, 0, 0);

  const dailyMap = new Map();

  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const day = date.setHours(0, 0, 0, 0);

    if (day === today) 
      
      {
      return;
    }
    const hour = date.getHours();
    if (!dailyMap.has(day) || Math.abs(hour - 12) < Math.abs(dailyMap.get(day).date.getHours() - 12)) {
      item.date = date;
      dailyMap.set(day, item);
    }
  });
  dailyMap.forEach((value) => 
    {
    dailyData.push(value);
  });
  return dailyData.slice(0, 5);
}

function createForecastCard(data) 
{
  const card = document.createElement("div");
  card.className = "forecast-card";

  const date = document.createElement("div");
  date.className = "forecast-date";
  date.textContent = formatDate(data.date, true);

  const icon = document.createElement("img");
  icon.className = "forecast-icon";
  icon.src = `${ICON_URL}${data.weather[0].icon}.png`;
  icon.alt = data.weather[0].description;

  const temp = document.createElement("div");
  temp.className = "forecast-temp";

  const high = document.createElement("span");
  high.className = "forecast-high";
  high.textContent = `${Math.round(data.main.temp_max)}°`;

  const low = document.createElement("span");
  low.className = "forecast-low";
  low.textContent = `${Math.round(data.main.temp_min)}°`;
  temp.appendChild(high);

  temp.appendChild(low);

  card.appendChild(date);

  card.appendChild(icon);

  card.appendChild(temp);
  return card;
}
function formatDate(date, short = false) 
{
  const options = {
    weekday: short ? "short" : "long",
    month: short ? "short" : "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}
window.addEventListener("load", init);
