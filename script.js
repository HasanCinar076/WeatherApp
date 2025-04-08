
const inputBox = document.getElementById("input-box");
const weatherBody = document.getElementById("weather-body");
const forecastDiv = document.getElementById("forecast");
const mapDiv = document.getElementById("map");
const recommendationsDiv = document.getElementById("recommendations");

inputBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = inputBox.value.trim();
    if (city) {
      fetchWeather(city);
      fetchForecast(city);
      showMap(city);
    } else {
      swal("Error", "Please enter a city name!", "error");
    }
  }
});

function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5069d0b3575c2a6c2aaebef269c221d9&units=metric`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === 200) {
        displayWeather(data);
        displayRecommendations(data);
      } else {
        swal("Error", "City not found!", "error");
      }
    });
}

function fetchForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=5069d0b3575c2a6c2aaebef269c221d9&units=metric`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === "200") {
          displayForecast(data);
        }
      });
  }

function displayWeather(data) {
  weatherBody.style.display = "block";
  weatherBody.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Weather: ${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

function displayForecast(data) {
    forecastDiv.innerHTML = "<h3>5-Day Forecast</h3>";
    for (let i = 0; i < data.list.length; i += 8) {
      const forecast = data.list[i];
      forecastDiv.innerHTML += `
        <div>
          <p>${new Date(forecast.dt_txt).toDateString()}</p>
          <p>Temp: ${forecast.main.temp}°C</p>
          <p>${forecast.weather[0].description}</p>
        </div>
      `;
    }
  }


function showMap(city) {
  mapDiv.innerHTML = `<iframe
    width="100%"
    height="100%"
    frameborder="0"
    style="border:0"
    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAR7S2B-ThfTsYPuBS7D_ntldX-r4qbMV4&q=${city}"
    allowfullscreen>
  </iframe>`;
}


function displayRecommendations(data) {
    const temp = data.main.temp;
    const condition = data.weather[0].main; 
    let recommendation = "Enjoy your trip! Make the most of the weather today.";

    if (temp < 5) {
        recommendation = "It's quite cold. Dress in layers and wear a warm coat!";
    } else if (temp < 10) {
        recommendation = "It's chilly. Don't forget your jacket and a warm hat.";
    } else if (temp > 25 && temp <= 30) {
        recommendation = "It's warm. A t-shirt and shorts should be comfortable.";
    } else if (temp > 30) {
        recommendation = "It's very hot. Stay hydrated, wear sunscreen, and light clothes.";
    }

    // Additional checks based on weather conditions
    if (condition === 'Rain') {
        recommendation += " Bring an umbrella or a raincoat.";
    } else if (condition === 'Snow') {
        recommendation += " Roads might be slippery. Wear boots and drive safely.";
    } else if (condition === 'Thunderstorm') {
        recommendation += " Stay indoors if possible. It's safer!";
    } else if (condition === 'Clear') {
        recommendation += " It's a beautiful day to be outdoors!";
    }

    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = `<h3>Weather Recommendations</h3><p>${recommendation}</p>`;
}
