import * as express from 'express';
import PwintyClient from './pwinty.client';
import TwilioClient from './twilio.client';
import DbClient from './db.client';
import StatusPageHandler from './status-page.handler';
import MessageHandler from './message.handler';
import SignupHandler from './signup.handler';
import PpAccount from './pp-account.class';
const twilioKeys = require('../twilio-keys.json');

const dbClient = new DbClient();
const pwintyClient = new PwintyClient(process.env.PWINTY_MERCHANT_ID, process.env.PWINTY_API_KEY, process.env.PWINTY_ENV);
const twilioClient = new TwilioClient(twilioKeys.accountSid, twilioKeys.authToken);
const statusPageHandler = new StatusPageHandler(dbClient);
const messageHandler = new MessageHandler(dbClient);
const signupHandler = new SignupHandler(dbClient);

const app = express();

app.get('/', (req, res) => {
  // Send status page
  statusPageHandler.sendStatusPage(res);
});

// Recieve post requests to the /sms endpoint
app.post('/sms', (req: any, res: any) => {
  // Handle message with message handler
  messageHandler.handleMessage(req.phone, req.body)
    .then(replyMessage => res.send(replyMessage))
    // TODO: add error handler to app
    .catch(e => res.send('Hmm, something went wrong. We\'ll get back to you soon to fix it'));
});

app.post('/signup', (req: any, res: any) => {
  // Save user to DB
  signupHandler.handleSignup(req)
    .then(replyMessage => twilioClient.sendMessageToNumber(replyMessage, req.phone))
    .then(() => res.set('200'))
    .catch(() => res.send('500')); // send error
})

app.listen(3000, () => console.log('Express server listening on port 1337'));
