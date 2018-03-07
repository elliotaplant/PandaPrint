import * as twilio from 'twilio';
import * as express from 'express';
const { accountSid, authToken } = require('../twilio-keys.json');

const app = express();

// Put in message handler
const client = new twilio.RestClient(accountSid, authToken);

app.get('/status', (req, res) => {
  // Send status page
});

// Recieve post requests to the /sms endpoint
app.post('/sms', (req: any, res: any) => {
  // Handle message with message handler
});

app.post('/signup', (req: any, res: any) => {
  // Save user to DB
    // If fails, try sending error to phone number or email
      // If fails, damn
  // Send user a welcome text
    // If fails, try sending error to email
      // If fails, damn
  // Send 200 response to requestor
    // Send error response to requestor if error
})

app.listen(1337, () => console.log('Express server listening on port 1337'))
