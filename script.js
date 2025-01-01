const apiKey = '7c9a4efdbddda6de5a761b925ed04517'; // Replace with OpenWeather API key
const searchButton = document.getElementById('search');
const cityInput = document.getElementById('city');
const weatherInfo = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');

searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeather(city);
    }
});

function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '404') {
                showError('City not found');
                return;
            }
            displayWeather(data);
        })
        .catch(error => showError('Error fetching weather data'));
}

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
    errorMessage.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
}
