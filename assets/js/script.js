  function initPage() {
      const inputEl = document.getElementById("city-input");
      const searchEl = document.getElementById("search-button");
      const clearEl = document.getElementById("clear-history");
      const nameEl = document.getElementById("city-name");
      const currentPicEl = document.getElementById("current-pic");
      const currentTempEl = document.getElementById("Temp");
      const currentHumidityEl = document.getElementById("humidity");
      const currentWindEl = document.getElementById("Wind");
      const currentUVEl = document.getElementById("UV-index");
      const historyEl = document.getElementById("history");
      let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

// my unique API key generated from openweathermap site
      const APIKey = 'dbd779372f4b89029fd7d48fc1500f23';
      function getWeather(cityName) {
          //  Method for using "date" objects obtained from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
          let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        //   api response will display forecast for selected city
          axios.get(queryURL)
              .then(function(response) {
                
                // uses current date to get weather forecast

                  const currentDate = new Date(response.data.dt * 1000);
                  const day = currentDate.getDate();
                  const month = currentDate.getMonth() + 1;
                  const year = currentDate.getFullYear();
                //   puts the response in Month/day/year format
                  nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
                  let weatherPic = response.data.weather[0].icon;
                  currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                  currentPicEl.setAttribute("alt", response.data.weather[0].description);
                //   Links to the html to display information
                  currentTempEl.innerHTML = "Temp: " + k2f(response.data.main.temp) + " &#176F";
                  currentWindEl.innerHTML = "Wind: " + response.data.wind.speed + " MPH";
                  let lat = response.data.coord.lat;
                  let lon = response.data.coord.lon;
                  let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
                  axios.get(UVQueryURL)
                      .then(function(response) {
                          let UVIndex = document.createElement("span");
                          UVIndex.setAttribute("class", "badge badge-danger");
                          UVIndex.innerHTML = response.data[0].value;
                          currentUVEl.innerHTML = "UV Index: ";
                          currentUVEl.append(UVIndex);
                      });

                      let cityID = response.data.id;
                      let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                      //  Using the city name, this will display the 5-day forecast from open weather map api
                  axios.get(forecastQueryURL)
                      .then(function(response) {

                          const forecastEls = document.querySelectorAll(".forecast");
                          for (i = 0; i < forecastEls.length; i++) {
                              forecastEls[i].innerHTML = "";
                              const forecastIndex = i * 8 + 4;
                              const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                              const forecastDay = forecastDate.getDate();
                              const forecastMonth = forecastDate.getMonth() + 1;
                              const forecastYear = forecastDate.getFullYear();
                              const forecastDateEl = document.createElement("p");
                              forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                              forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                              forecastEls[i].append(forecastDateEl);
                              const forecastWeatherEl = document.createElement("img");
                              forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                              forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                              forecastEls[i].append(forecastWeatherEl);
                              // Forecast Temp
                              const forecastTempEl = document.createElement("p");
                              forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                              forecastEls[i].append(forecastTempEl);
                              // Forecast Humidity
                              const forecastHumidityEl = document.createElement("p");
                              forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                              forecastEls[i].append(forecastHumidityEl);
                              // Forecast Wind
                              const forecastWindEl = document.createElement("p");
                              forecastWindEl.innerHTML = "Wind: " + response.data.list[forecastIndex].wind.speed + " MPH";
                              forecastEls[i].append(forecastWindEl);
                          }
                      })
              });
            }

            // stores the information in localStorage

      searchEl.addEventListener("click", function() {
          const searchTerm = inputEl.value;
          getWeather(searchTerm);
          searchHistory.push(searchTerm);
          localStorage.setItem("search", JSON.stringify(searchHistory));
          renderSearchHistory();
      })

      clearEl.addEventListener("click", function() {
          searchHistory = [];
          renderSearchHistory();
      })

      function k2f(K) {
          return Math.floor((K - 273.15) * 1.8 + 32);
      }

      function renderSearchHistory() {
          historyEl.innerHTML = "";
          for (let i = 0; i < searchHistory.length; i++) {
              const historyItem = document.createElement("input");
              historyItem.setAttribute("type", "text");
              historyItem.setAttribute("style", "margin-bottom: 10px;")
              historyItem.setAttribute("readonly", true);
              historyItem.setAttribute("class", "form-control d-block bg-grey");
              historyItem.setAttribute("value", searchHistory[i]);
              historyItem.addEventListener("click", function() {
                  getWeather(historyItem.value);
              })
              historyEl.append(historyItem);
          }
      }

      //  Saves the user's search and then displays them underneath the search form
      renderSearchHistory();
      if (searchHistory.length > 0) {
          getWeather(searchHistory[searchHistory.length - 1]);
      }

  }
  initPage();