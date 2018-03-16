// Types for the utility class

export type ApiKey =
  'TWILIO_ACCOUNT_SID' |
  'TWILIO_AUTH_TOKEN' |
  'PWINTY_MERCHANT_ID' |
  'PWINTY_API_KEY' |
  'PWINTY_ENV' |
  'STRIPE_PUBLISHABLE_KEY' |
  'STRIPE_SECRET_KEY';

export enum Env {
  DEV = 'DEV',
  PROD = 'PROD',
}
