/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
const fetch = require("node-fetch");
const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

const CLIENT_ID = '22d8bad72f3469cd766c';
const CLIENT_SECRET = '87dc73ff01cde6be87ac29f3ff7c9dd4e50683f8';

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/authorise', async (req, res) => {
  const code = req.query.code;
  const response = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`,
    { headers: { Accept: 'application/json' } },
  );
  const json = await response.json();
  return res.redirect(`http://localhost:3000?access_token=${json.access_token}`);
});

app.listen(3000, function () {
  console.log("App started");
});

module.exports = app;
