const apiKey = '5fa4f7c9a509cd4c3f99e1b8d3de7071'; // Replace with your OpenWeatherMap API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherContainer = document.getElementById('weather-container');
const cityName = document.getElementById('city-name');
const date = document.getElementById('date');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feels-like');
const weatherDescription = document.getElementById('weather-description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const errorMessage = document.getElementById('error-message');

searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    try {
        const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError(error.message);
    }
}

function displayWeather(data) {
    weatherContainer.classList.remove('hidden');
    errorMessage.classList.add('hidden');

    cityName.textContent = data.name;
    date.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    feelsLike.textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind: ${data.wind.speed} m/s`;

    animateWeatherInfo();
}

function showError(message) {
    weatherContainer.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    errorMessage.textContent = message;

    anime({
        targets: errorMessage,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        easing: 'easeOutCubic'
    });
}

function animateWeatherInfo() {
    anime({
        targets: [cityName, date, weatherIcon, temperature, feelsLike, weatherDescription, '.detail'],
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(100),
        duration: 500,
        easing: 'easeOutCubic'
    });
}

// Add background color transition based on temperature
function updateBackgroundColor(temp) {
    const hue = Math.max(0, Math.min(240, 240 - (temp + 20) * 4));
    document.body.style.background = `linear-gradient(135deg, hsl(${hue}, 50%, 50%) 0%, hsl(${hue + 30}, 50%, 40%) 100%)`;
}