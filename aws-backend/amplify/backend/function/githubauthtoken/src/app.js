const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const fetch = require('node-fetch');

const CLIENT_ID = '22d8bad72f3469cd766c';
const CLIENT_SECRET = process.env.CLIENT_SECRET;

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/authorise', (req, res) => {
  const code = req.query.code;
  const url = `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`;

  fetch(
    url,
    { headers: { Accept: 'application/json' } },
  ).then(res => res.json())
    .then(json => {
      const redirectUrl = `https://mlhfellowbook.herokuapp.com?access_token=${json.access_token}`;

      // Hack: meta refresh, express res.redirect isn't working :(
      res.set('Content-Type', 'text/html');
      res.status(200).send(`<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${redirectUrl}"></head></html>`);
      // return res.redirect(redirectUrl);
    });
});


app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
