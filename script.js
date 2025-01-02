const apiKey = "7c9a4efdbddda6de5a761b925ed04517"; // Replace with your weather API key
const searchBar = document.getElementById("search-bar");
const suggestionBar = document.getElementById("suggestion-bar");
const forecastContainer = document.getElementById("forecast");
const loading = document.getElementById("loading");

// Fetch weather data
async function fetchWeather(city) {
    try {
        loading.classList.remove("hidden");
        forecastContainer.classList.add("hidden");

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        alert(error.message);
    } finally {
        loading.classList.add("hidden");
    }
}

// Display weather forecast
function displayForecast(data) {
    forecastContainer.innerHTML = ""; // Clear existing forecasts
    data.list.slice(0, 5).forEach((item) => {
        const forecastItem = document.createElement("div");
        forecastItem.className = "forecast-item";

        const date = new Date(item.dt_txt).toLocaleString("en-US", {
            weekday: "short",
            hour: "numeric",
        });

        forecastItem.innerHTML = `
            <h3>${data.city.name}</h3>
            <p>${date}</p>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
            <p>${item.weather[0].description}</p>
            <div class="forecast-item-details">
                <p>Temp: ${item.main.temp}°C</p>
                <p>Feels Like: ${item.main.feels_like}°C</p>
                <p>Humidity: ${item.main.humidity}%</p>
                <p>Wind: ${item.wind.speed} m/s</p>
            </div>
        `;
        forecastContainer.appendChild(forecastItem);
    });

    forecastContainer.classList.remove("hidden");
}

// Handle search suggestions
async function handleSuggestions() {
    const query = searchBar.value.trim();
    suggestionBar.innerHTML = "";

    if (query.length < 2) {
        suggestionBar.classList.add("hidden");
        return;
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
        );

        const suggestions = await response.json();
        if (!suggestions.length) return;

        suggestions.forEach((item) => {
            const suggestionItem = document.createElement("div");
            suggestionItem.className = "suggestion-item";
            suggestionItem.textContent = `${item.name}, ${item.country}`;
            suggestionItem.onclick = () => {
                searchBar.value = item.name;
                suggestionBar.classList.add("hidden");
                fetchWeather(item.name);
            };
            suggestionBar.appendChild(suggestionItem);
        });

        suggestionBar.classList.remove("hidden");
    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
}

// Fetch weather when pressing Enter
searchBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") fetchWeather(searchBar.value.trim());
});
