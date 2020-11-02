const express = require("express");
const dataStore = require("nedb");
const fetch = require("node-fetch");

const app = express();

app.listen(3000, () => console.log("Port is listening"));

app.use(express.static("public"));
// app.use(express.static(__dirname + "/public"));

app.use(
  express.json({
    limit: "1mb",
  })
);

const dataBase = new dataStore("database.db");
dataBase.loadDatabase();

app.get("/app", (request, response) => {
  dataBase.find({}, (err, data) => {
    response.json(data);
  });
});

app.post("/app", (request, response) => {
  console.log(request.body);
  const timeStamp = Date.now();
  request.body.timeStamp = timeStamp;
  dataBase.insert(request.body);
  response.json({
    status: "success",
    timesStamp: timeStamp,
    latitude: request.body.lat,
    longitude: request.body.long,
  });
});

app.delete("/app", function (request, response) {
  dataBase.remove({}, { multi: false }, function (err, numRemoved) {
    response.json(numRemoved);
  });
});

// use app.get to send info to retrieve info frmm the weather api using latlong as a paramter

app.get("/weather/:latlong", async function (request, response) {
  const latlong = request.params.latlong.split(",");
  console.log(latlong);
  const key = "4cf1628190964f925f65e4cda3261489";
  const lat = latlong[0];
  const long = latlong[1];
  console.log(lat, long);

  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude={part}&appid=${key}`;
  const fetch_response = await fetch(url);
  const json = await fetch_response.json();
  response.json(json);
});
