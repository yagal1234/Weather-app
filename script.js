const searchBtn = document.getElementById("searchBtn");
const weatherDiv = document.getElementById("weather");

searchBtn.addEventListener("click", () => {
    const city = document.getElementById("city").value.trim();

    if (!city) {
        weatherDiv.innerHTML = "<p class='error'>Please enter a city.</p>";
        return;
    }

    getWeather(city);
});

async function getWeather(city) {

    try {

        weatherDiv.innerHTML = "<p>Loading...</p>";

        // STEP 1: Get Latitude & Longitude
        const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Network Error");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found");
        }

        const location = geoData.results[0];

        const lat = location.latitude;
        const lon = location.longitude;

        // STEP 2: Get Weather

        const weatherURL =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Weather service unavailable");
        }

        const weatherData = await weatherResponse.json();

        displayWeather(location, weatherData);

    }

    catch(error){

        weatherDiv.innerHTML =
        `<p class="error">${error.message}</p>`;

    }

}

function displayWeather(location, data){

    weatherDiv.innerHTML = `

        <h2>${location.name}</h2>

        <h3>${location.country}</h3>

        <p><strong>Temperature:</strong>
        ${data.current.temperature_2m} °C</p>

        <p><strong>Humidity:</strong>
        ${data.current.relative_humidity_2m}%</p>

        <p><strong>Wind Speed:</strong>
        ${data.current.wind_speed_10m} km/h</p>

    `;

}