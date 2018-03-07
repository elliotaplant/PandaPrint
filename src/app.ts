import * as express from 'express';
import PwintyClient from './pwinty-client';
import TwilioClient from './twilio-client';
import StatusPageHandler from './status-page.handler';
const twilioKeys = require('../twilio-keys.json');

const pwintyClient = new PwintyClient(process.env.PWINTY_MERCHANT_ID, process.env.PWINTY_API_KEY, process.env.PWINTY_ENV);
const twilioClient = new TwilioClient(twilioKeys.accountSid, twilioKeys.authToken);
const statusPageHandler = new StatusPageHandler();

const app = express();

app.get('/status', (req, res) => {
  // Send status page
  statusPageHandler.sendStatusPage(res);
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

app.listen(1337, () => console.log('Express server listening on port 1337'));
