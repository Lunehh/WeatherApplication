const apiKey = '7c9a4efdbddda6de5a761b925ed04517'; // Replace with your OpenWeather API key
const searchButton = document.getElementById('search');
const geolocationButton = document.getElementById('geolocation');
const toggleModeButton = document.getElementById('toggle-mode');
const cityInput = document.getElementById('city');
const weatherInfo = document.getElementById('weather-info');
const forecastInfo = document.getElementById('forecast-info');
const errorMessage = document.getElementById('error-message');
const loadingIndicator = document.getElementById('loading');
const forecastContainer = document.getElementById('forecast');

// Event Listeners
searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        showLoading();
        getWeather(city);
        getForecast(city);
        
        // Animate search container
        document.getElementById('search-container').classList.add('animate');
    }
});

geolocationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByCoordinates(lat, lon);
            
            // Animate search container
            document.getElementById('search-container').classList.add('animate');
        });
    } else {
        showError('Geolocation is not supported by this browser.');
    }
});

toggleModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Fetch Weather Data
function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            hideLoading();
            if (data.cod === '404') {
                showError('City not found');
                return;
            }
            displayWeather(data);
        })
        .catch(error => {
            hideLoading();
            showError('Error fetching weather data');
        });
}

function getWeatherByCoordinates(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            hideLoading();
            displayWeather(data);
        })
        .catch(error => {
            hideLoading();
            showError('Error fetching weather data');
        });
}

// Fetch Forecast Data
function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => console.error('Error fetching forecast data:', error));
}

// Display Weather Data
function displayWeather(data) {
    const cityName = document.getElementById('city-name');
    const temperature = document.getElementById('temperature');
    const description = document.getElementById('description');
    const weatherIcon = document.getElementById('weather-icon');

    cityName.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description;
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    weatherInfo.classList.remove('hidden');
}

// Display Forecast Data
function displayForecast(data) {
   forecastContainer.innerHTML = ''; // Clear previous forecasts

   data.list.forEach((item, index) => {
       if (index % 8 === 0) { // Show one forecast every 8 entries (every 24 hours)
           const forecastItem = document.createElement('div');
           forecastItem.className = 'forecast-item';
           forecastItem.innerHTML = `
               <h4>${new Date(item.dt * 1000).toLocaleDateString()}</h4>
               <p>${Math.round(item.main.temp)}°C</p>
               <p>${item.weather[0].description}</p>
               <img src='http://openweathermap.org/img/wn/${item.weather[0].icon}.png' alt='Weather Icon'>
           `;
           forecastContainer.appendChild(forecastItem);
       }
   });

   forecastInfo.classList.remove('hidden'); // Show forecast info
}

// Show Loading Indicator
function showLoading() {
   loadingIndicator.classList.remove('hidden'); // Show loading indicator
   weatherInfo.classList.add('hidden'); // Hide weather info
   errorMessage.classList.add('hidden'); // Hide error message
}

// Hide Loading Indicator
function hideLoading() {
   loadingIndicator.classList.add('hidden'); // Hide loading indicator
}

// Show Error Message
function showError(message) {
   errorMessage.textContent = message;
   errorMessage.classList.remove('hidden'); // Show error message
   weatherInfo.classList.add('hidden'); // Hide weather info
   forecastInfo.classList.add('hidden'); // Hide forecast info
}
