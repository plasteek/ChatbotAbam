'use strict';

// Import all libraries
const line = require('@line/bot-sdk');
const express = require('express');
const chatbot = require('./lib/bot');

// Construct Chatbot Instances
let bot = new chatbot();

// create LINE SDK config from env variables
const config = {
    channelAccessToken: "I1PVJRhv+bRjNe/3ZDmfnyQMsZbiwwEI6Ivz7RLI4h07JMOvx11UomfGzTV8H5aGOdJq+FKn+Qv3yJC7x7i2YYQ8toHkWNOGpMMauwcgbL83q6N9fFRwkpo2JWatE1RcEpXrMktJPkoTHgiA1MCf1gdB04t89/1O/w1cDnyilFU=",
    channelSecret: "4a1aabec3f52e7a60ba170a6d5d4182d"
}

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
line.middleware(config);
app.post('/callback', line.middleware(config), (req, res) => {
  console.log(req.body.event);
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {

  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // Chatbot processing
  bot.process(client, event);
  
  // return good condition
  return 200;
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
