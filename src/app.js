"use strict";
exports.__esModule = true;
var express = require("express");
var pwinty_client_1 = require("./pwinty-client");
var twilio_client_1 = require("./twilio-client");
var twilioKeys = require('../twilio-keys.json');
var pwintyClient = new pwinty_client_1["default"](process.env.PWINTY_MERCHANT_ID, process.env.PWINTY_API_KEY, process.env.PWINTY_ENV);
var twilioClient = new twilio_client_1["default"](twilioKeys.accountSid, twilioKeys.authToken);
var app = express();
app.get('/status', function (req, res) {
    // Send status page
});
// Recieve post requests to the /sms endpoint
app.post('/sms', function (req, res) {
    // Handle message with message handler
});
app.post('/signup', function (req, res) {
    // Save user to DB
    // If fails, try sending error to phone number or email
    // If fails, damn
    // Send user a welcome text
    // If fails, try sending error to email
    // If fails, damn
    // Send 200 response to requestor
    // Send error response to requestor if error
});
app.listen(1337, function () { return console.log('Express server listening on port 1337'); });
