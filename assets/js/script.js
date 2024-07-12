const apiKey = '2236ce39243cb1dc6170710d12f986e2'; // Replace with your actual API key

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeather(city);
        saveSearchHistory(city);
    }
});

document.getElementById('history-list').addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        const city = event.target.textContent;
        fetchWeather(city);
    }
});

function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            fetchForecast(data.coord.lat, data.coord.lon);
        });
}

function fetchForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        });
}

function displayCurrentWeather(data) {
    const currentDate = new Date(data.dt * 1000).toLocaleDateString();
    document.getElementById('city-name').textContent = `${data.name} (${currentDate})`;
    document.getElementById('temp').textContent = `Temp: ${data.main.temp}°F`;
    document.getElementById('wind').textContent = `Wind: ${data.wind.speed} MPH`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity} %`;
    document.getElementById('icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather icon">`;
}

function displayForecast(data) {
    const forecastEl = document.getElementById('forecast-cards');
    forecastEl.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) { // 8 intervals per day
        const forecast = data.list[i];
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card');
        forecastCard.innerHTML = `
            <p>${new Date(forecast.dt_txt).toLocaleDateString()}</p>
            <p><img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather icon"></p>
            <p>Temp: ${forecast.main.temp}°F</p>
            <p>Wind: ${forecast.wind.speed} MPH</p>
            <p>Humidity: ${forecast.main.humidity} %</p>
        `;
        forecastEl.appendChild(forecastCard);
    }
}

function saveSearchHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        loadSearchHistory();
    }
}

function loadSearchHistory() {
    const historyEl = document.getElementById('history-list');
    historyEl.innerHTML = '';
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        historyEl.appendChild(li);
    });
}

// Load search history on page load
loadSearchHistory();