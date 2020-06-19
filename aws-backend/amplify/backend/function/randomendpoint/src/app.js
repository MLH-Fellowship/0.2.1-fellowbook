const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "fellowsdb";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const path = "/random";

// Durstenfeld shuffle from https://stackoverflow.com/a/12646864
function shuffleFellows(fellows) {
  for (let i = fellows.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = fellows[i];
    fellows[i] = fellows[j];
    fellows[j] = temp;
  }
  return fellows;
}

function filterFellows(fellows, query) {
  query = query.toLowerCase();
  // Get all fellows where the query is part of the pod name, or the query is the pod ID
  return fellows.filter(fellow =>
    fellow.pod.toLowerCase().includes(query) ||
    fellow.pod_id === query
  );
}

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

app.get(path, function (req, res) {
  dynamodb.scan({
    TableName: tableName,
  }, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err.message });
    } else {
      const fellows = data.Items;
      if (req.query.query) {
        // If there's a query, we want to get all fellows matching the query
        const filteredFellows = filterFellows(fellows, req.query.query);
        res.json(shuffleFellows(filteredFellows));
      } else {
        // Otherwise we just want a single random fellow
        const randomFellow = fellows[Math.floor(Math.random() * fellows.length)];
        res.json(randomFellow);
      }
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
