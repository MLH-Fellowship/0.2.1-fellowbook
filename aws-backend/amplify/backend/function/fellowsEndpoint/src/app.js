/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bodyParser = require('body-parser');
const express = require('express');
const fetch = require('node-fetch');

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "fellows";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const CLIENT_ID = '22d8bad72f3469cd766c';
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "username";
const partitionKeyType = "S";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/fellows/:username";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/********************************************
 * HTTP GET method to get list all fellows  *
 * Ideally this would be part of the main   *
 * /fellows/{username} method, but I can't  *
 * get it to work ("Missing Authentication  *
 * Token" error), so this will have to do   *
 * for now at least                         *
 ********************************************/
app.get('/fellows/list', function (req, res) {
  const params = {};

  dynamodb.scan({
    TableName: tableName,
  }, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err.message });
    } else {
      res.json(data.Items);
    }
  });
});

/********************************************
 * HTTP GET method to get access token for  *
 * user and redirect them to the web app    *
 * Again, ideally this is its own /authorise*
 * endpoint, but I couldn't get that to work*
 * (Internal Server Error!) so this will do *
 * for now at least                         *
 ********************************************/
app.get('/fellows/authorise', (req, res) => {
  const code = req.query.code;
  fetch(
    `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`,
    { headers: { Accept: 'application/json' } },
  ).then(res => res.json)
    .then(json => {
      const redirectUrl = `http://localhost:3000?access_token=${json.access_token}`;

      // Hack: meta refresh, express res.redirect isn't working :(
      res.set('Content-Type', 'text/html');
      res.status(200).send(`<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${redirectUrl}"></head></html>`);
      // return res.redirect(redirectUrl);
    });
});

/*****************************************
 * HTTP GET method to get single fellow  *
 *****************************************/
app.get('/fellows/:username', function (req, res) {
  const params = {};

  if (req.params[partitionKeyName]) {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }

    const getItemParams = {
      TableName: tableName,
      Key: params
    }

    dynamodb.get(getItemParams, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.json({ error: 'Could not load items: ' + err.message });
      } else {
        if (data.Item) {
          res.json(data.Item);
        } else {
          res.json(data);
        }
      }
    });
  }
});


/************************************
* HTTP put method for insert object *
*************************************/

app.put(path, function (req, res) {
  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  const putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body });
    } else {
      res.json({ success: 'put call succeed!', url: req.url, data: data })
    }
  });
});

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, function (req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  const putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body });
    } else {
      res.json({ success: 'post call succeed!', url: req.url, data: data })
    }
  });
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function (req, res) {
  const params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  const removeItemParams = {
    TableName: tableName,
    Key: params
  }
  dynamodb.delete(removeItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url });
    } else {
      res.json({ url: req.url, data: data });
    }
  });
});
app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
