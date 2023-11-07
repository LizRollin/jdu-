// server.js (v0.5)

const express = require("express");
const fs = require("fs");
const app = express();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var bodyParser = require('body-parser')

// x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: false }))

// json

app.use(bodyParser.json())

const prodwsurl = "https://jmcs-prod.just-dance.com"
const room = "MainJD2024"

const entities = require("./files/entities.json");
const entitiesphone = require("./files/entities-phone.json");
const configuration = require("./files/configuration.json");
const onlinequest = require("./files/onlinequest.json");
const party = require("./files/party.json");
const quests = require("./files/quests.json");
const songs = require("./files/songs.json");
const skuconstants = require("./files/skuconstants.json");
const skupackages = require("./files/skupackages.json");
const subscription = require("./files/subscription.json");
const sweat = require("./files/sweat.json");
const users = require("./files/users.json");
const playlist = require("./files/playlist.json");
const coop = require("./files/coop.json");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// entities

app.get(
  "/v2/spaces/f1ae5b84-db7c-481e-9867-861cf1852dc8/entities",
  (req, res) => {
    res.send(entities);
  }
);

app.get(
  "/v2/spaces/e9116be2-587b-4c95-8eb7-ef8a1908b8fc/entities",
  (req, res) => {
    res.send(entitiesphone);
  }
);

// configuration

app.get(
  "/v1/applications/341789d4-b41f-4f40-ac79-e2bc4c94ead4/configuration",
  (req, res) => {
    res.send(configuration);
  }
);

app.get(
  "/v1/applications/210da0fb-d6a5-4ed1-9808-01e86f0de7fb/configuration",
  (req, res) => {
    res.send(configuration);
  }
);

// sku, party and subscription

app.post("/carousel/v2/packages", (req, res) => {
  res.send({
    __class: "PackageIds",
    packageIds: ["bannerOverride","transitionOverride"]
  });
});

app.post("/subscription/v1/refresh", (req, res) => {
  res.send(subscription);
});

app.post("/carousel/v2/pages/party", (req, res) => {
  res.send(party);
});

app.get("/com-video/v1/com-videos-fullscreen", (req, res) => {
  res.send([]);
});

app.get("/community-remix/v1/active-contest", (req, res) => {
  res.send([]);
});

app.get("/constant-provider/v1/sku-constants", (req, res) => {
  res.send(skuconstants);
});

app.get("/packages/v1/sku-packages", (req, res) => {
  res.send(skupackages);
});

// content-authorization

app.get('/content-authorization/v1/maps/*', (req, res) => {
  var ss = req.url.split("/").pop();
  const path = './videos/' + ss + '.json'
  try {
  if (fs.existsSync(path)) {
    console.log(path + " exists.")
    var fileurls = require('./videos/' + ss + '.json');
	  res.send(fileurls);
  } else {
    console.log(path + " does not exist.")
      var ticket = req.header("Authorization")
      var contentlen = req.header("Content-Length")
      var xhr = new XMLHttpRequest();
      var n = req.url.lastIndexOf('/');
      var result = req.url.substr(0)
      xhr.open('GET', prodwsurl + result, false);
      xhr.setRequestHeader('X-SkuId', 'jd2017-pc-ww');
      xhr.setRequestHeader('Authorization', ticket);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
      res.send(xhr.responseText);
  }
} catch(err) {
  console.error(err)
}
});

// playlists, coop and sweat

app.post("/carousel/v2/pages/partycoop", (req, res) => {
  res.send(coop);
});

app.post("/carousel/v2/pages/quests", (req, res) => {
  res.send(onlinequest);
});

app.post("/carousel/v2/pages/create-playlist", (req, res) => {
  res.send(playlist);
});

app.post("/carousel/v2/pages/sweat", (req, res) => {
  res.send(sweat);
});

// sessions

app.post('/v3/profiles/sessions', (req, res) => {
  var xhr = new XMLHttpRequest();
  var ticket = req.header("Authorization")
  var appid = req.header("Ubi-AppId")
  xhr.open('POST', 'https://public-ubiservices.ubi.com/v3/profiles/sessions', false);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Ubi-AppId', appid);
  xhr.setRequestHeader('Authorization', ticket);
  xhr.send();
  res.send(xhr.responseText);
});

app.get('/v3/users/*', (req, res) => {
res.send(users);
});

app.get("/profile/v2/profiles", (req, res) => {
var profileid = req.url.split('=').pop()
var ticket = req.header("Authorization")
var xhr = new XMLHttpRequest();
xhr.open('GET', prodwsurl + '/profile/v2/profiles?profileIds=' + profileid, false);
xhr.setRequestHeader('X-SkuId', 'jd2017-pc-ww');
xhr.setRequestHeader('Authorization', ticket);
xhr.send();
res.send(xhr.responseText);
});

app.post("/profile/v2/profiles", (req, res) => {
var ticket = req.header("Authorization")
var xhr = new XMLHttpRequest();
xhr.open('POST', prodwsurl + '/profile/v2/profiles', true);
xhr.setRequestHeader('X-SkuId', 'jd2017-pc-ww');
xhr.setRequestHeader('Authorization', ticket);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify(req.body, null, 2));
res.send(xhr.responseText);
});

// others

app.get("/questdb/v1/quests", (req, res) => {
  res.send(quests);
});

app.get("/songdb/v1/songs", (req, res) => {
  res.send(songs);
});

app.get("/status/v1/ping", (req, res) => {
  res.send([]);
});

app.get("/leaderboard/v1/maps/*", (req, res) => {
  var ticket = req.header("Authorization")
  var contentlen = req.header("Content-Length")
  var xhr = new XMLHttpRequest();
  var n = req.url.lastIndexOf('/');
  var result = req.url.substr(0)
  xhr.open('GET', prodwsurl + result, false);
  xhr.setRequestHeader('X-SkuId', 'jd2017-pc-ww');
  xhr.setRequestHeader('Authorization', ticket);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
  res.send(xhr.responseText);
});

app.delete("/wdf/v1/rooms/" + room + "/session", (req, res) => {
  var ticket = req.header("Authorization")
  var contentlen = req.header("Content-Length")
  var xhr = new XMLHttpRequest();
  xhr.open('DELETE', 'https://jmcs-prod.just-dance.com/wdf/v1/rooms/' + room + '/session', false);
  xhr.setRequestHeader('X-SkuId', 'jd2017-pc-ww');
  xhr.setRequestHeader('Authorization', ticket);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
  res.send(xhr.responseText);
});

function checkHttps(req, res, next) {
  if (req.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    res.redirect("https://" + req.hostname + req.url);
  }
}

app.all("*", checkHttps);
app.use(express.static("public"));

// routing

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
