const express = require("express");
const {
  auth,
  requiresAuth
} = require('express-openid-connect');
const dotenv = require('dotenv');
const app = express();
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'riTBOXDT2IG1NzJIalI0trEesNrvIMoL',
  issuerBaseURL: 'https://dev-mr46eaxb.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
app.use(express.static(__dirname));

const port = 3000;

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/adopt', requiresAuth(), function (req, res) {
  res.send("You're logged in")
})


app.get('/help', requiresAuth(), function (req, res) {
  res.sendFile(__dirname + "/login/register.html");
})

app.listen(port, function (req, res) {
  console.log("server started");
})