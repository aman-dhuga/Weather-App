window.addEventListener("load", () => {
  if ("geolocation" in navigator) {
    console.log("location is available");
    navigator.geolocation.getCurrentPosition(async (position) => {
      let lat = position.coords.latitude;
      let long = position.coords.longitude;
      let place = document.querySelector(".place");
      let temperature = document.querySelector(".temperature");
      let detail = document.querySelector(".temperature-description");
      let icon = document.querySelector(".icon");
      let feelTemp = document.querySelector(".feels-like");
      let humidityPercentage = document.querySelector(".humidity");
      let sunRise = document.querySelector(".sun-rise");
      let sunSet = document.querySelector(".sun-set");

      // console.log(position.coords);
      // document.getElementById("lat").innerHTML = lat;
      // document.getElementById("long").innerHTML = long;

      // example for weather api with node.js
      // use node.js to fetch data as weather api only allows accesss through local server

      const fetch_response = await fetch(`/weather/${lat},${long}`);
      const fetch_json = await fetch_response.json();
      console.log(fetch_json);

      let { temp, feels_like, humidity, sunrise, sunset } = fetch_json.current;

      let celcius = convertCelcius(temp);
      let feels = convertCelcius(feels_like);
      let description = fetch_json.current.weather[0].description;
      let location = fetch_json.timezone;
      let weatherIcon = fetch_json.current.weather[0].icon;

      let sr = format_time(sunrise, location);
      let ss = format_time(sunset, location);

      let el = document.createElement("img");
      el.src = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
      el.width = 180;
      icon.appendChild(el);

      place.textContent = location;
      temperature.textContent = celcius;
      detail.textContent = description;
      feelTemp.textContent = feels;
      humidityPercentage.textContent = humidity;
      sunRise.textContent = sr;
      sunSet.textContent = ss;

      const data = { lat, long };

      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const response = await fetch("/app", options);
      const json = await response.json();
      console.log(json);

      //bring back the data from the server which comes from the database
      getData();
    });
  } else {
    console.log("location is not available");
  }
});

function convertCelcius(temperature) {
  return Math.floor(temperature - 273.15);
}

function format_time(s, t) {
  const dtFormat = new Intl.DateTimeFormat("en-US", {
    timeStyle: "medium",
    timeZone: t,
  });

  return dtFormat.format(new Date(s * 1e3));
}

async function getData() {
  const response = await fetch("/app");
  const data = await response.json();
  console.log(data);
}

const handleDelete = () => {
  deleteData();
};

async function deleteData() {
  const options = {
    method: "DELETE",
  };
  const response = await fetch("/app", options);
  const data = await response.json();
  console.log(data);
}
