const AWS = require('aws-sdk');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const bodyParser = require('body-parser');
const express = require('express');
const fetch = require('node-fetch');

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "fellowsdb";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const path = "/standups";

const BASE_API_URL = 'https://api.github.com/graphql';

const latestPodStandupQuery = (pod) => {
  if (!pod.match(/^[0-9]\.[0-9]\.[0-9]$/)) return null;

  return `{
    organization(login: "MLH-Fellowship") {
      team(slug: "pod-${pod.replace(/\./g, '-')}") {
        discussions(last: 1) {
          nodes {
            comments(last: 20) {
              nodes {
                bodyHTML
                author {
                  login
                }
                url
              }
            }
          }
        }
      }
    }
  }`;
}

const latestUserStandupQuery = (username) => {
  // TODO this username is case-sensitive
  // Make it case insensitive. How? Maybe get original_username from our DynamoDB?
  return `{
    organization(login: "MLH-Fellowship") {
      teams(last: 1, userLogins: "${username}") {
        totalCount
        edges {
          node {
            name
            discussions(last: 1) {
              nodes {
                comments(first: 20) {
                  nodes {
                    bodyHTML
                    author {
                      login
                    }
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;
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
  if (req.query.pod) {
    const query = latestPodStandupQuery(req.query.pod);
    if (!query) return res.json({ error: 'Unknown or Invalid pod' });

    fetch(BASE_API_URL,
      {
        method: 'post',
        headers: {
          Authorization: "bearer " + process.env.GITHUB_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      },
    ).then(res => res.json()).then(json => {
      const comments = json.data.organization.team.discussions.nodes[0].comments.nodes;
      comments.forEach(comment => {
        comment.username = comment.author.login;
        comment.body = comment.bodyHTML;
        delete comment.bodyHTML;
        delete comment.author;
      });
      return res.json(comments);
    });
  } else if (req.query.user) {
    const query = latestUserStandupQuery(req.query.user);
    if (!query) return res.json({ error: 'Unknown or Invalid user' });

    fetch(BASE_API_URL,
      {
        method: 'post',
        headers: {
          Authorization: "bearer " + process.env.GITHUB_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      },
    ).then(res => res.json()).then(json => {
      const comments = json.data.organization.teams.edges[0].node.discussions.nodes[0].comments.nodes;
      const userComment = comments.find(comment => comment.author.login === req.query.user);
      if (!userComment) return res.json({ error: 'No standup found for user. Check the username!' });

      userComment.username = userComment.author.login;
      userComment.body = userComment.bodyHTML;
      delete userComment.bodyHTML;
      delete userComment.author;
      return res.json(userComment);
    });
  }
});

app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
