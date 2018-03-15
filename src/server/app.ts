import * as bodyParser from 'body-parser';
import * as express from 'express';

import { BillingActuator, StripeClient } from './billing';
import { DbClient, IPpAccount } from './db';
import { ErrorActuator } from './error';
import { MessageActuator, TwilioClient } from './messages';
import { PwintyClient } from './printing';
import { SignupActuator } from './signup';
import { StatusActuator } from './status';

// Source maps for debugging
require('source-map-support').install();
process.on('unhandledRejection', console.error);

// Instantiate clients to be injected
const dbClient = new DbClient();
const pwintyClient = new PwintyClient();
const twilioClient = new TwilioClient();
const stripeClient = new StripeClient();

// Init necessary client instances
dbClient.init();
pwintyClient.init();
twilioClient.init();
stripeClient.init();

// Instantiate actuators that use clients
const statusActuator = new StatusActuator(dbClient);
const billingActuator = new BillingActuator(stripeClient);
const messageActuator = new MessageActuator(dbClient, pwintyClient, billingActuator);
const signupActuator = new SignupActuator(dbClient, stripeClient);

const app = express();
const port = process.env.PORT || 8080;

// Middleware
// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }));
// Tell express to use the json bodyParser for json data
app.use(bodyParser.json());

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
  signupActuator.handleSignup(req.body)
    .then(({ message, phone }) => twilioClient.sendMessageToPhone(message, phone))
    .then(() => res.sendStatus(200))
    .catch((error) => {
      const defaultMessage = 'Failed to sign up user';
      ErrorActuator.handleError(error, defaultMessage);
      // res.set('Content-Type', 'application/json');
      res.status(500).send({ message: error.message || defaultMessage });
    });
});

app.listen(port, () => console.log(`Express server listening on port ${port}`));
