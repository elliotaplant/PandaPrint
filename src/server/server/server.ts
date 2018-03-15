import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Express } from 'express';

import { BillingActuator, StripeClient } from '../billing';
import { DbClient, IPpAccount } from '../db';
import { ErrorActuator } from '../error';
import { MessageActuator, TwilioClient } from '../messages';
import { PwintyClient } from '../printing';
import { SignupActuator } from '../signup';
import { StatusActuator } from '../status';

export class Server {
  // App
  private app: Express;

  // Clients
  private dbClient: DbClient;
  private pwintyClient: PwintyClient;
  private twilioClient: TwilioClient;
  private stripeClient: StripeClient;

  // Actuators
  private statusActuator: StatusActuator;
  private billingActuator: BillingActuator;
  private messageActuator: MessageActuator;
  private signupActuator: SignupActuator;

  constructor() {
    // Instantiate clients
    this.dbClient = new DbClient();
    this.pwintyClient = new PwintyClient();
    this.twilioClient = new TwilioClient();
    this.stripeClient = new StripeClient();

    // Instantiate Actuators
    this.statusActuator = new StatusActuator(this.dbClient);
    this.billingActuator = new BillingActuator(this.stripeClient);
    this.messageActuator = new MessageActuator(this.dbClient, this.pwintyClient, this.billingActuator);
    this.signupActuator = new SignupActuator(this.dbClient, this.stripeClient);
  }

  public init() {
    return this.initClients().then(() => this.initApp());
  }

  private initClients() {
    // Init necessary client instances
    this.pwintyClient.init();
    this.twilioClient.init();
    this.stripeClient.init();
    return this.dbClient.init(); // DB Client init is async, so we return a promise
  }

  private initApp() {
    this.app = express();
    const port = process.env.PORT || 8080;

    // Middleware
    // Tell express to use the body-parser middleware and to not parse extended bodies
    this.app.use(bodyParser.urlencoded({ extended: false }));
    // Tell express to use the json bodyParser for json data
    this.app.use(bodyParser.json());

    this.app.get('/', (req, res) => {
      // Send status page
      // This should be handled by the static page thing
      this.statusActuator.sendStatusPage(res);
    });

    // Recieve post requests to the /sms endpoint
    this.app.post('/sms', (req: any, res: any) => {
      res.set('Content-Type', 'text/plain');
      // Handle message with message actuator
      this.messageActuator.handleMessage(req.body)
        .then((replyMessage) => res.send(replyMessage))
        .catch((e) => {
          ErrorActuator.handleError(e, `Error handling message: ${JSON.stringify(req.body)}`);
          res.send('Hmm, something went wrong. We\'ll get back to you soon to fix it');
        });
    });

    this.app.post('/signup', (req: any, res: any) => {
      // Save user to DB
      // This should all be in the signup actuator
      this.signupActuator.handleSignup(req.body)
        .then(({ message, phone }) => this.twilioClient.sendMessageToPhone(message, phone))
        .then(() => res.sendStatus(200))
        .catch((error) => {
          const defaultMessage = 'Failed to sign up user';
          ErrorActuator.handleError(error, defaultMessage);
          res.status(500).send({ message: error.message || defaultMessage });
        });
    });

    return new Promise((resolve, reject) => {
      this.app.listen(port, (error: any) => {
        if (error) {
          return reject(error);
        } else {
          console.log(`Express server listening on port ${port}`);
          return resolve();
        }
      });
    });
  }
}
