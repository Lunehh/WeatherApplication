const apiKey = "7c9a4efdbddda6de5a761b925ed04517"; // Replace with your actual API key
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const loading = document.getElementById("loading");
const forecastContainer = document.getElementById("forecast");
const suggestions = document.getElementById("suggestions");

async function fetchWeather(city) {
    try {
        if (!city) throw new Error("City name cannot be empty.");
        
        loading.classList.remove("hidden");
        forecastContainer.classList.add("hidden");
        suggestions.classList.add("hidden");

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        alert(error.message);
    } finally {
        loading.classList.add("hidden");
    }
}

function displayForecast(data) {
    forecastContainer.innerHTML = ""; // Clear previous results
    forecastContainer.classList.remove("hidden");

    const forecasts = data.list.slice(0, 5); // Show 5 forecasts

    forecasts.forEach(item => {
        const forecastItem = document.createElement("div");
        forecastItem.className = "forecast-item";
        forecastItem.innerHTML = `
            <p>${new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
            <p>${item.main.temp.toFixed(1)}°C</p>
            <p>${item.weather[0].description}</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}

// Suggestion bar for cities
cityInput.addEventListener("input", async () => {
    const query = cityInput.value.trim();

    if (query.length < 3) {
        suggestions.classList.add("hidden");
        return;
    }

    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`);
    const cities = await response.json();

    suggestions.innerHTML = "";
    cities.forEach(city => {
        const li = document.createElement("li");
        li.textContent = `${city.name}, ${city.country}`;
        li.addEventListener("click", () => {
            cityInput.value = city.name;
            suggestions.classList.add("hidden");
        });
        suggestions.appendChild(li);
    });

    suggestions.classList.remove("hidden");
});

// Trigger fetchWeather on button click
searchBtn.addEventListener("click", () => fetchWeather(cityInput.value));
