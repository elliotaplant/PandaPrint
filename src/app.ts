import * as express from 'express';
import { PwintyClient } from './printing';
import { BillingActuator, StripeClient } from './billing';
import { MessageActuator, TwilioClient } from './messages';
import { DbClient, PpAccount } from './db';
import { StatusActuator } from './status';
import { SignupActuator } from './signup';
const twilioKeys = require('../twilio-keys.json');

const dbClient = new DbClient();
const pwintyClient = new PwintyClient(process.env.PWINTY_MERCHANT_ID, process.env.PWINTY_API_KEY, process.env.PWINTY_ENV);
const twilioClient = new TwilioClient(twilioKeys.accountSid, twilioKeys.authToken);
const stripeClient = new StripeClient();
const statusActuator = new StatusActuator(dbClient);
const billingActuator = new BillingActuator(stripeClient);
const messageActuator = new MessageActuator(dbClient, pwintyClient, billingActuator);
const signupActuator = new SignupActuator(dbClient);

const app = express();

app.get('/', (req, res) => {
  // Send status page
  statusActuator.sendStatusPage(res);
});

// Recieve post requests to the /sms endpoint
app.post('/sms', (req: any, res: any) => {
  // Handle message with message actuator
  messageActuator.handleMessage(req.phone, req.body)
    .then(replyMessage => res.send(replyMessage))
    // TODO: add error actuator to app
    .catch(e => res.send('Hmm, something went wrong. We\'ll get back to you soon to fix it'));
});

app.post('/signup', (req: any, res: any) => {
  // Save user to DB
  signupActuator.handleSignup(req)
    .then(replyMessage => twilioClient.sendMessageToNumber(replyMessage, req.phone))
    .then(() => res.set('200'))
    .catch(() => res.send('500')); // send error
})

app.listen(3000, () => console.log('Express server listening on port 3000'));
