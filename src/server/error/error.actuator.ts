/** Actuator for logging errors */

export class ErrorActuator {

  public static handleError(error: Error, message: string): void {
    console.error(message);
    console.error(error);
  }
}
