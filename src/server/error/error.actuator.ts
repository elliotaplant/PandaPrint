/** Actuator for logging errors */

export class ErrorActuator {

  static handleError(error: Error, message: string): void {
    console.error(message);
    console.error(error);
  }
}
