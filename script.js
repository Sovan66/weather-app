async function getWeatherByCity(city) {
  try {
    // 1️⃣ Convert city name → coordinates
    const geoUrl = `https://nominatim.openstreetmap.org/search?city=${city}&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (geoData.length === 0) {
      console.log("❌ City not found!");
      return;
    }

    const lat = geoData[0].lat;
    const lon = geoData[0].lon;

    // 2️⃣ Fetch weather data
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,snowfall`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    // 3️⃣ Display results in console
    console.log(`🌍 Weather in ${city}:`);
    console.log(`🌡️ Temperature: ${weatherData.current.temperature_2m}°C`);
    console.log(`💧 Humidity: ${weatherData.current.relative_humidity_2m}%`);
    console.log(`🌧️ Rain (precipitation): ${weatherData.current.precipitation} mm`);
    console.log(`❄️ Snowfall: ${weatherData.current.snowfall} mm`);
    console.log(`🌬️ Wind Speed: ${weatherData.current.wind_speed_10m} km/h`);

    // 4️⃣ Display results in webpage (make sure these IDs exist in your HTML)
    document.getElementById("Temperature").innerHTML = `${weatherData.current.temperature_2m} °C`;
    document.getElementById("Humidity").innerHTML = `${weatherData.current.relative_humidity_2m} %`;
    document.getElementById("Rain").innerHTML = `${weatherData.current.precipitation} mm`;
    document.getElementById("Snowfall").innerHTML = `${weatherData.current.snowfall} mm`;
    document.getElementById("WindSpeed").innerHTML = `${weatherData.current.wind_speed_10m} km/h`;
    document.getElementById("cityname").innerHTML=`${city}`

  } catch (error) {
    console.error("⚠️ Error fetching weather:", error);
  }

}

// 🔹 Example call — change city name here
getWeatherByCity("Bhubaneswar");

document.getElementById("submit").addEventListener("click", function (event) {
  event.preventDefault(); // stop page reload
  const city = document.getElementById("city").value.trim();

  if (city === "") {
    alert("Please enter a city name!");
    return;
  }
 getWeatherByCity(city);
});

document.body.style.backgroundImage =
  "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop')";

// 🌍 Function to fetch and update weather for common places
async function updateCommonPlaces() {
  const cities = ["Shanghai", "Boston", "Berlin", "Kolkata"];
  const tableRows = document.querySelectorAll("tbody tr");

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];

    try {
      // Convert city → coordinates
      const geoUrl = `https://nominatim.openstreetmap.org/search?city=${city}&format=json`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();
      if (geoData.length === 0) continue;

      const lat = geoData[0].lat;
      const lon = geoData[0].lon;

      // Get live weather
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,snowfall`;
      const weatherRes = await fetch(weatherUrl);
      const weatherData = await weatherRes.json();

      // Extract values
      const temp = weatherData.current.temperature_2m;
      const humidity = weatherData.current.relative_humidity_2m;
      const rain = weatherData.current.precipitation;
      const snow = weatherData.current.snowfall;
      const wind = weatherData.current.wind_speed_10m;

      // Fill the table row
      const tds = tableRows[i].querySelectorAll("td");
      tds[0].textContent = `${temp} °C`;
      tds[1].textContent = `${humidity} %`;
      tds[2].textContent = `${rain} mm`;
      tds[3].textContent = `${snow} mm`;
      tds[4].textContent = `${wind} km/h`;

    } catch (error) {
      console.error(`⚠️ Error fetching weather for ${city}:`, error);
    }
  }
}

// Run this once when page loads
updateCommonPlaces();


  