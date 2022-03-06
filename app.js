const wrapper = document.querySelector(".wrapper"),
  inputPart = document.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  header = document.querySelector("header"),
  spinner = document.querySelector(".spinner"),
  btnClose = document.querySelector(".btn__exit"),
  weatherPartContainer = wrapper.querySelector(".weather-part");

let url;
const clearMessage = function () {
  weatherPartContainer.innerHTML = "";
  infoTxt.textContent = "";
};
const messageError = function (inp, message) {
  infoTxt.style.display = "block";
  infoTxt.classList.add("error");
  infoTxt.textContent = `${inp.value} ${message}`;
  inp.value = "";
};

const styleHeader = function (message = "", color = "#ccc") {
  header.textContent = `${message}`;
  header.style.borderBottom = `1px solid ${color}`;
};
const changeStatusDisplay = function (
  inpStatusDisplay,
  wthrStatusContainerDisplay,
  spinnerStatusDisplay
) {
  inputPart.style.display = `${inpStatusDisplay}`;
  weatherPartContainer.style.display = `${wthrStatusContainerDisplay}`;
  spinner.style.display = `${spinnerStatusDisplay}`;
};
const displayInfoWearher = function () {
  changeStatusDisplay("none", "flex", "block");
  styleHeader("", "transparent");
};

const statusOfWeatherIcon = function (id) {
  if (id === 800) return "icons/clear.svg";
  else if (id >= 200 && id <= 232) return "icons/storm.svg";
  else if (id >= 600 && id <= 622) return "icons/snow.svg";
  else if (id >= 701 && id <= 781) return "icons/haze.svg";
  else if (id >= 801 && id <= 804) return "icons/cloud.svg";
  else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321))
    return "icons/rain.svg";
};

const requestApi = async function (url) {
  return await fetch(url);
};
const closeContainerModal = function () {
  this.style.display = "none";
  changeStatusDisplay("block", "none", "none");
  styleHeader("Weather");
  inputField.value = "";
  infoTxt.style.display = "none";
};

const renderDates = async function (datas) {
  //ALL DATAS

  const data = await datas.json();
  const { id, description } = data.weather[0];
  const { temp_max, feels_like, humidity } = data.main;
  const { lat, lon } = data.coord;
  const { name } = data;
  const { country } = data.sys;

  const html = `
        <img src="${statusOfWeatherIcon(
          id
        )}" alt="Weather Icon" / class="icons">
        <div class="temp">
          <span class="numb">${Math.floor(temp_max)}</span>
          <span class="deg">°</span>C
        </div>
        <div class="weather description">${description}</div>
        <div class="location">
          <i class="bx bx-map"></i>
          <span>${name}, ${country}</span>
        </div>
        <div class="bottom-details">
          <div class="column feels">
            <i class="bx bxs-thermometer"></i>
            <div class="details">
              <div class="temp">
                <span class="numb-2">${Math.floor(feels_like)}</span>
                <span class="deg">°</span>C
              </div>
              <p>Feels like</p>
            </div>
          </div>
          <div class="column humidity">
            <i class="bx bxs-droplet-half"></i>
            <div class="details">
              <span>${Math.floor(humidity)}</span>
              <p>Humidity</p>
            </div>
          </div>
        </div>
    `;
  weatherPartContainer.insertAdjacentHTML("beforeend", html);
};

const consumePromise = async function (promise) {
  clearMessage();
  try {
    consumeData = await promise;
    if (!consumeData.ok) {
      throw setTimeout(() => {
        changeStatusDisplay("block", "none", "none");
        styleHeader("Weather");
      }, 1000);
    }

    const data = consumeData;
    setTimeout(() => {
      spinner.style.display = "none";
      btnClose.style.display = "block";
      renderDates(data);
    }, 1000);
  } catch (e) {
    messageError(inputField, "Was Not Found!");
  }
};

const executeRequeste = function (country) {
  url = `https://api.openweathermap.org/data/2.5/weather?q=${country}&units=metric&appid=bb97a1ccebacd797a8b67ab5b6a8394e`;
  const request = requestApi(url);

  consumePromise(request);
};
const getPositionOfCountry = function () {
  if (!navigator.geolocation) return;

  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      (postion) => resolve(postion),
      (err) => {
        infoTxt.classList.add("error");
        infoTxt.style.display = "block";
        reject((infoTxt.textContent = `You Denied Your Geolocation`));
      }
    );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const consumePromisePosition = async function (promise) {
  const position = await getPositionOfCountry();

  const { latitude: lat, longitude: lng } = position.coords;

  url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=bb97a1ccebacd797a8b67ab5b6a8394e`;

  const request = requestApi(url);
  consumePromise(request);
  displayInfoWearher();
};
inputField.addEventListener("keyup", (e) => {
  // if user pressed enter btn and input value is not empty
  if (!(e.key == "Enter" && inputField.value != "")) return;
  clearMessage();
  executeRequeste(e.target.value.toLowerCase());
  displayInfoWearher();
});

locationBtn.addEventListener("click", consumePromisePosition);

btnClose.addEventListener("click", closeContainerModal.bind(btnClose));
