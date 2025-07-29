const WEATHER_API_KEY = "aa24e2ff6e0a6ca124d7064e8377f661";

const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast";
const WEATHER_REV_GEOCODE_URL = "https://api.openweathermap.org/geo/1.0/reverse";

const city = document.getElementById("city")
const stateAndCountry = document.getElementById("stateAndCountry")

// Where's my JS macros :(((

const day1Name = document.getElementById("day1Name");
const day1Date = document.getElementById("day1Date");
const day1Icon = document.getElementById("day1Icon");
const day1TempHigh = document.getElementById("day1TempHigh");
const day1TempLow = document.getElementById("day1TempLow");
const day1WeatherDesc = document.getElementById("day1WeatherDesc");
const day1Humidity = document.getElementById("day1Humidity");
const day1WindSpeed = document.getElementById("day1WindSpeed");
const day1Pressure = document.getElementById("day1Pressure");
const day1Visibility = document.getElementById("day1Visibility");

const day2Name = document.getElementById("day2Name");
const day2Date = document.getElementById("day2Date");
const day2Icon = document.getElementById("day2Icon");
const day2TempHigh = document.getElementById("day2TempHigh");
const day2TempLow = document.getElementById("day2TempLow");
const day2WeatherDesc = document.getElementById("day2WeatherDesc");
const day2Humidity = document.getElementById("day2Humidity");
const day2WindSpeed = document.getElementById("day2WindSpeed");
const day2Pressure = document.getElementById("day2Pressure");
const day2Visibility = document.getElementById("day2Visibility");

const day3Name = document.getElementById("day3Name");
const day3Date = document.getElementById("day3Date");
const day3Icon = document.getElementById("day3Icon");
const day3TempHigh = document.getElementById("day3TempHigh");
const day3TempLow = document.getElementById("day3TempLow");
const day3WeatherDesc = document.getElementById("day3WeatherDesc");
const day3Humidity = document.getElementById("day3Humidity");
const day3WindSpeed = document.getElementById("day3WindSpeed");
const day3Pressure = document.getElementById("day3Pressure");
const day3Visibility = document.getElementById("day3Visibility");

const day4Name = document.getElementById("day4Name");
const day4Date = document.getElementById("day4Date");
const day4Icon = document.getElementById("day4Icon");
const day4TempHigh = document.getElementById("day4TempHigh");
const day4TempLow = document.getElementById("day4TempLow");
const day4WeatherDesc = document.getElementById("day4WeatherDesc");
const day4Humidity = document.getElementById("day4Humidity");
const day4WindSpeed = document.getElementById("day4WindSpeed");
const day4Pressure = document.getElementById("day4Pressure");
const day4Visibility = document.getElementById("day4Visibility");

const day5Name = document.getElementById("day5Name");
const day5Date = document.getElementById("day5Date");
const day5Icon = document.getElementById("day5Icon");
const day5TempHigh = document.getElementById("day5TempHigh");
const day5TempLow = document.getElementById("day5TempLow");
const day5WeatherDesc = document.getElementById("day5WeatherDesc");
const day5Humidity = document.getElementById("day5Humidity");
const day5WindSpeed = document.getElementById("day5WindSpeed");
const day5Pressure = document.getElementById("day5Pressure");
const day5Visibility = document.getElementById("day5Visibility");

const dayElements = [
    {
        name: day1Name, date: day1Date, icon: day1Icon, tempHigh: day1TempHigh, tempLow: day1TempLow,
        weatherDesc: day1WeatherDesc, humidity: day1Humidity, windSpeed: day1WindSpeed, 
        pressure: day1Pressure, visibility: day1Visibility
    },
    {
        name: day2Name, date: day2Date, icon: day2Icon, tempHigh: day2TempHigh, tempLow: day2TempLow,
        weatherDesc: day2WeatherDesc, humidity: day2Humidity, windSpeed: day2WindSpeed, 
        pressure: day2Pressure, visibility: day2Visibility
    },
    {
        name: day3Name, date: day3Date, icon: day3Icon, tempHigh: day3TempHigh, tempLow: day3TempLow,
        weatherDesc: day3WeatherDesc, humidity: day3Humidity, windSpeed: day3WindSpeed, 
        pressure: day3Pressure, visibility: day3Visibility
    },
    {
        name: day4Name, date: day4Date, icon: day4Icon, tempHigh: day4TempHigh, tempLow: day4TempLow,
        weatherDesc: day4WeatherDesc, humidity: day4Humidity, windSpeed: day4WindSpeed, 
        pressure: day4Pressure, visibility: day4Visibility
    },
    {
        name: day5Name, date: day5Date, icon: day5Icon, tempHigh: day5TempHigh, tempLow: day5TempLow,
        weatherDesc: day5WeatherDesc, humidity: day5Humidity, windSpeed: day5WindSpeed, 
        pressure: day5Pressure, visibility: day5Visibility
    }
];

function processForecastData(forecastData) {
    const dailyForecasts = {};
    
    forecastData.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dateKey = date.toDateString();
        
        if (!dailyForecasts[dateKey]) {
            dailyForecasts[dateKey] = {
                date: date,
                temps: [],
                conditions: [],
                humidity: [],
                windSpeed: [],
                pressure: [],
                visibility: []
            };
        }
        
        dailyForecasts[dateKey].temps.push(forecast.main.temp);
        dailyForecasts[dateKey].conditions.push(forecast.weather[0]);
        dailyForecasts[dateKey].humidity.push(forecast.main.humidity);
        dailyForecasts[dateKey].windSpeed.push(forecast.wind.speed);
        dailyForecasts[dateKey].pressure.push(forecast.main.pressure);
        dailyForecasts[dateKey].visibility.push(forecast.visibility || 10000);
    });
    
    const sortedDays = Object.values(dailyForecasts)
        .sort((a, b) => a.date - b.date)
        .slice(0, 5);
    
    return sortedDays.map(day => ({
        date: day.date,
        tempHigh: Math.round(Math.max(...day.temps)),
        tempLow: Math.round(Math.min(...day.temps)),
        condition: day.conditions[Math.floor(day.conditions.length / 2)],
        humidity: Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length),
        windSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b) / day.windSpeed.length),
        pressure: Math.round(day.pressure.reduce((a, b) => a + b) / day.pressure.length),
        visibility: Math.round((day.visibility.reduce((a, b) => a + b) / day.visibility.length) / 1609.34 * 100) / 100
    }));
}

function displayForecast(forecastData) {
    const processedData = processForecastData(forecastData);
    
    city.textContent = forecastData.city.name;
    stateAndCountry.textContent = `${forecastData.city.state || 'N/A'}, ${forecastData.city.country || 'N/A'}`;

    processedData.forEach((dayData, index) => {
        if(index < dayElements.length) {
            const elements = dayElements[index];
            const dayName = dayData.date.toLocaleDateString("en-us", { weekday: 'long' });
            const dayDate = dayData.date.toLocaleDateString("en-us", { month: 'short', day: 'numeric' });
            
            elements.name.textContent = dayName;
            elements.date.textContent = dayDate;
            elements.tempHigh.textContent = `${dayData.tempHigh}`;
            elements.tempLow.textContent = `${dayData.tempLow}`;
            elements.weatherDesc.textContent = dayData.condition.description;
            elements.humidity.textContent = `${dayData.humidity}%`;
            elements.windSpeed.textContent = `${dayData.windSpeed} mph`;
            elements.pressure.textContent = `${dayData.pressure} hPa`;
            elements.visibility.textContent = `${dayData.visibility} mi`;
            
            elements.icon.src = `https://openweathermap.org/img/wn/${dayData.condition.icon}@2x.png`;
            elements.icon.alt = dayData.condition.description;
        }
    });
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
            }
            else {
                throw new Error("No location found for the coordinates!");
            }
        })
        .catch(error => {
            console.error("Error fetching reversed geocode: ", error);
            return { state: "N/A", country: "Unknown", name: "Unknown Location" };
        });
}

function fetchForecastByCoords(lat, lon) {
    fetchReversedGeocode(lat, lon)
        .then(async location => {
            const forecastUrl = `${FORECAST_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`;

            return fetch(forecastUrl)
                .then(response => response.json())
                .then(forecastData => {
                    forecastData.city.state = location.state;
                    forecastData.city.country = location.country;
                    forecastData.city.name = location.name;

                    displayForecast(forecastData);
                });
        })
        .catch(error => {
            console.error("Error getting forecast by coordinates: ", error);
            alert("Could not find forecast for your location! Please try again!");
        });
}

document.addEventListener("DOMContentLoaded", () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            fetchForecastByCoords(lat, lon);
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
    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(parsedQuery)}&limit=1&appid=${WEATHER_API_KEY}`;

    const resp = await fetch(geocodeUrl);
    const data = await resp.json();
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

async function fetchForecastForLocation(location) {
    try {
        const forecastUrl = `${FORECAST_API_URL}?lat=${location.lat}&lon=${location.lon}&appid=${WEATHER_API_KEY}&units=imperial`;
        
        const resp = await fetch(forecastUrl);
        const forecastData = await resp.json();
        if(!forecastData || forecastData.cod !== "200") {
            throw new Error("Forecast data not found for the specified location!");
        }
        
        forecastData.city.state = location.state;
        forecastData.city.country = location.country;
        forecastData.city.name = location.name;
        
        displayForecast(forecastData);
    }
    catch(error) {
        console.error("Error getting forecast: ", error);
        alert("Could not find forecast for that location! Please try again!");
    }
}
