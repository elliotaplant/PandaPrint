import { DbClient } from '../db';
/**
 * A actuator for displaying the app status
 */

export class StatusActuator {
  constructor(private dbClient: DbClient) { }
  public sendStatusPage(res: any) {
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(
      `<head></head>
      <body>
        <h1>Hi Elliot! Found you at ${new Date().toString()}</h1>
        <h3>The server appears to be alive</h3>
        <pre>${JSON.stringify({ object: 'Goes here' }, null, 2)}</pre>
      </body>`,
    );
  }
}
