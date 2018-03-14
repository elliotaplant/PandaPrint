import * as bodyParser from 'body-parser';
import * as express from 'express';

import { BillingActuator, StripeClient } from './billing';
import { DbClient, IPpAccount } from './db';
import { ErrorActuator } from './error';
import { MessageActuator, TwilioClient } from './messages';
import { PwintyClient } from './printing';
import { SignupActuator } from './signup';
import { StatusActuator } from './status';

const dbClient = new DbClient();
const pwintyClient = new PwintyClient();
const twilioClient = new TwilioClient();
const stripeClient = new StripeClient();
const statusActuator = new StatusActuator(dbClient);
const billingActuator = new BillingActuator(stripeClient);
const messageActuator = new MessageActuator(dbClient, pwintyClient, billingActuator);
const signupActuator = new SignupActuator(dbClient, stripeClient);

const app = express();
const port = process.env.PORT || 8080;

// Middleware
// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  // Send status page
  statusActuator.sendStatusPage(res);
});

// Recieve post requests to the /sms endpoint
app.post('/sms', (req: any, res: any) => {
  res.set('Content-Type', 'text/plain');
  // Handle message with message actuator
  messageActuator.handleMessage(req.body)
    .then((replyMessage) => res.send(replyMessage))
    .catch((e) => {
      ErrorActuator.handleError(e, `Error handling message: ${JSON.stringify(req.body)}`);
      res.send('Hmm, something went wrong. We\'ll get back to you soon to fix it');
    });
});

app.post('/signup', (req: any, res: any) => {
  // Save user to DB
  signupActuator.handleSignup(req)
    .then((replyMessage) => twilioClient.sendMessageToPhone(replyMessage, req.phone))
    .then(() => res.set('200'))
    .catch(() => res.send('500')); // send error
});

app.listen(port, () => console.log(`Express server listening on port ${port}`));
