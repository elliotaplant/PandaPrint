import * as twilio from 'twilio';
import * as express from 'express';
const { accountSid, authToken } = require('../twilio-keys.json');
// const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();

const client = new twilio.RestClient(accountSid, authToken);

function sendTwilioText() {
  client.messages.create({
    body: 'Hello from Node',
    to: '+15109175552',  // Personal number
    from: '+14155793449' // My twilio number
  })
  .then((message) => console.log(message.sid))
  .catch(error => console.error('No good', error));
}

// Recieve post requests to the /sms endpoint
app.post('/sms', (req, res) => {
  if (req.)
  const twiml = new twilio.MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

app.listen(1337, () => console.log('Express server listening on port 1337'))
