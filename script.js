const apiKey = '!REPLACE!'; // replace with your api key.

window.addEventListener('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    });
  }
});

document.getElementById('getWeather').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value;
  if (city) {
    fetchWeatherByCity(city);
    updateSearchHistory(city);
  } else {
    alert('Please enter a city name');
  }
});

function fetchWeatherByCity(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(displayWeather)
    .catch(console.error);
}

function fetchWeatherByCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(displayWeather)
    .catch(console.error);
}

function displayWeather(data) {
  if (data.cod === 200) {
    document.getElementById('cityName').innerText = `Weather in ${data.name}`;
    document.getElementById('temperature').innerText = `Temperature: ${data.main.temp}°C`;
    document.getElementById('condition').innerText = `Condition: ${data.weather[0].description}`;
    document.getElementById('details').innerText = `Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s | Pressure: ${data.main.pressure} hPa`;
    document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  } else {
    alert(data.message);
  }
}

const historyKey = 'weatherSearchHistory';

window.addEventListener('load', () => {
  const history = JSON.parse(localStorage.getItem(historyKey)) || [];
  updateHistoryList(history);
});

function updateSearchHistory(city) {
  let history = JSON.parse(localStorage.getItem(historyKey)) || [];
  if (!history.includes(city)) {
    history.unshift(city);
    history = history.slice(0, 5); 
    localStorage.setItem(historyKey, JSON.stringify(history));
  }
  updateHistoryList(history);
}

function updateHistoryList(history) {
  const list = document.getElementById('searchHistory');
  list.innerHTML = '';
  history.forEach(city => {
    const li = document.createElement('li');
    li.innerText = city;
    li.addEventListener('click', () => fetchWeatherByCity(city));
    list.appendChild(li);
  });
}

document.getElementById('clearHistory').addEventListener('click', () => {
  localStorage.removeItem(historyKey);
  updateHistoryList([]);
});

let isCelsius = true;
document.getElementById('toggleUnits').addEventListener('click', () => {
  const temperatureElem = document.getElementById('temperature');
  const city = document.getElementById('cityName').innerText.replace('Weather in ', '');

  if (city) {
    const currentTemp = parseFloat(temperatureElem.innerText.match(/[-+]?[0-9]*\.?[0-9]+/)[0]);
    if (isCelsius) {
      const fahrenheit = (currentTemp * 9) / 5 + 32;
      temperatureElem.innerText = `Temperature: ${fahrenheit.toFixed(2)}°F`;
      document.getElementById('toggleUnits').innerText = 'Switch to Celsius';
    } else {
      const celsius = ((currentTemp - 32) * 5) / 9;
      temperatureElem.innerText = `Temperature: ${celsius.toFixed(2)}°C`;
      document.getElementById('toggleUnits').innerText = 'Switch to Fahrenheit';
    }
    isCelsius = !isCelsius;
  } else {
    alert('No weather data available to convert.');
  }
});
