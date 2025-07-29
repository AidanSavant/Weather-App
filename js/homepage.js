const WEATHER_API_KEY = "aa24e2ff6e0a6ca124d7064e8377f661";

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const WEATHER_REV_GEOCODE_URL = "https://api.openweathermap.org/geo/1.0/reverse";

const locSearchInput = document.getElementById("locSearchInput");
const autocompleteResults = document.getElementById("autocompleteResults");
const locSearchBtn = document.getElementById("locSearchBtn");
const weatherCard = document.getElementById("weatherCard");
const cityName = document.getElementById("cityName");
const stateAndCountry = document.getElementById("StateAndCountry");
const currDate = document.getElementById("currDate");
const weatherIcon = document.getElementById("weatherIcon");
const currTemp = document.getElementById("currentTemp");
const weatherDesc = document.getElementById("weatherDesc");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");

function displayWeather(weather_data) {
    updateDate();
    cityName.textContent = weather_data.name;
    currTemp.textContent = `${Math.round(weather_data.main.temp)}`;
    weatherDesc.textContent = weather_data.weather[0].description;
    humidity.textContent = `${weather_data.main.humidity}%`;
    windSpeed.textContent = `${Math.round(weather_data.wind.speed)} mph`;
    pressure.textContent = `${weather_data.main.pressure} hPa`;
    visibility.textContent = `${(weather_data.visibility / 1609.34).toFixed(2)} mi`;
    feelsLike.textContent = `Feels like ${Math.round(weather_data.main.feels_like)}°F`;
    stateAndCountry.textContent = `${weather_data.sys.state || 'N/A'}, ${weather_data.sys.country}`;
    
    weatherIcon.src = `https://openweathermap.org/img/wn/${weather_data.weather[0].icon}@2x.png`;
    weatherIcon.alt = weather_data.weather[0].description;
}

function updateDate() {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    currDate.textContent = new Date().toLocaleDateString("en-us", options);
}

async function fetchReversedGeocode(lat, lon) {
    const revURL = `${WEATHER_REV_GEOCODE_URL}?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_API_KEY}`;

    return fetch(revURL)
        .then(response => response.json())
        .then(data => {
            if(data && data.length > 0) {
                return {
                    state: data[0].state || "N/A",
                    country: data[0].country,
                    name: data[0].name || "Unknown Location"
                };
            } else {
                throw new Error("No location found for the coordinates!");
            }
        })
        .catch(error => {
            console.error("Error fetching reversed geocode: ", error);
            return { state: "N/A", country: "Unknown", name: "Unknown Location" };
        });
}

function fetchWeatherByCoords(lat, lon) {
    fetchReversedGeocode(lat, lon)
        .then(async location => {
            const weatherUrl = `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`;

            return fetch(weatherUrl)
                .then(response => response.json())
                .then(weatherData => {
                    weatherData.sys.state = location.state;
                    weatherData.sys.country = location.country;
                    weatherData.name = location.name;

                    displayWeather(weatherData);
                });
        })
        .catch(error => {
            console.error("Error getting weather by coordinates: ", error);
            alert("Could not find weather for your location! Please try again!");
        });
}

document.addEventListener("DOMContentLoaded", () => {
    updateDate();

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            fetchWeatherByCoords(lat, lon);
        },
        () => {
            alert("Unable to retrieve your location!");
        });
    }
    else {
        alert("Geolocation is not supported by this browser!");
    }
});

function parseQuery(query) {
    const parsedQuery = query.trim().split(/\s*,\s*|\s+/);
    return parsedQuery.length === 2 
        ? `${parsedQuery[0]},${parsedQuery[1]},US` 
        : null;
}

async function fetchGeocode(locationQuery) {
    const parsedQuery = parseQuery(locationQuery);
    if(!parsedQuery) {
        throw new Error("Invalid query! Failed to parse query!");
    }

    console.log("Parsed query: ", parsedQuery);

    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(parsedQuery)}&limit=1&appid=${WEATHER_API_KEY}`;

    const resp = await fetch(geocodeUrl);
    const data = await resp.json();
    console.log(data);

    if(!data || data.length === 0) {
        throw new Error(`No location found for: "${locationQuery}"`);
    }

    return {
        lat: data[0].lat,
        lon: data[0].lon,
        state: data[0].state || null,
        country: data[0].country,
        name: data[0].name
    };
}


async function fetchWeatherForLocation(location) {
    try {
        const weatherUrl = `${WEATHER_API_URL}?lat=${location.lat}&lon=${location.lon}&appid=${WEATHER_API_KEY}&units=imperial`;
        
        const resp = await fetch(weatherUrl);
        const weatherData = await resp.json();
        if(!weatherData || weatherData.cod !== 200) {
            throw new Error("Weather data not found for the specified location!");
        }
        
        weatherData.sys.state = location.state;
        weatherData.sys.country = location.country;
        weatherData.name = location.name;
        
        displayWeather(weatherData);
    }
    catch(error) {
        console.error("Error getting weather: ", error);
        alert("Could not find weather for that location! Please try again!");
    }
}

locSearchBtn.addEventListener("click", async () => {
    const locationInput = locSearchInput.value.trim();
    if(!locationInput) {
        alert("Please enter a city name (optionally with state, e.g., 'Jennings Louisiana')!");
        return;
    }

    try {
        const location = await fetchGeocode(locationInput);
        await fetchWeatherForLocation(location);
    } catch (error) {
        console.error("Error getting weather: ", error);
        alert("Could not find weather for that location! Please try again with format 'city, state' (e.g., 'jennings, louisiana')!");
    }
});
