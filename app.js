const express = require("express");

const bp = require("body-parser");

const mongoose = require("mongoose");

const multer = require('multer');

const fs = require('fs');

const path = require('path');

const {
  auth,
  requiresAuth
} = require('express-openid-connect');

const dotenv = require('dotenv');

var storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50000000
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('myImage');

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}



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

app.set('view engine', 'ejs');

app.use(bp.urlencoded({
  extended: true
}));

const port = 3000;

mongoose.connect("mongodb+srv://admin:qsvQjmPPnADSp83d@pawhelper.5qct4.mongodb.net/doginfoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



const doginfoSchema = {

  name: String,
  number: String,
  city: String,
  state: String,
  pin: String,
  img: String

}

const doginfo = new mongoose.model("doginfo", doginfoSchema);



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

app.post('/help', function (req, res) {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      if (req.file == undefined) {
        console.log("undefined");
      } else {
        var dogdetails = {
          name: req.body.name,
          number: req.body.phone,
          city: req.body.city,
          state: req.body.state,
          pin: req.body.pin,
          img: req.file.filename

        }
        doginfo.create(dogdetails, (err, item) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect('/');
          }
        });
      }
    }
  });



});



app.listen(port, function (req, res) {
  console.log("------------------------------------------------------     SERVER STARTED     ------------------------------------------------------");
})