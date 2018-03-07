"use strict";
exports.__esModule = true;
var twilio = require("twilio");
/**
  A client to interact with the twilio API
*/
var TwilioClient = /** @class */ (function () {
    function TwilioClient(accountSid, authToken) {
        this.accountSid = accountSid;
        this.authToken = authToken;
    }
    TwilioClient.prototype.init = function () {
        this.twilio = new twilio.RestClient(this.accountSid, this.authToken);
    };
    TwilioClient.prototype.sendMessageToNumber = function (message, number) {
    };
    return TwilioClient;
}());
exports["default"] = TwilioClient;
