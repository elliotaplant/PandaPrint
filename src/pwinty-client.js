"use strict";
exports.__esModule = true;
// Must require pwinty since it doesn't have @types
var pwintyInit = require('pwinty');
/**
  A client to interact with the pwinty API
*/
var PwintyClient = /** @class */ (function () {
    function PwintyClient(merchantId, apiKey, env) {
        if (env === void 0) { env = 'sandbox'; }
        this.merchantId = merchantId;
        this.apiKey = apiKey;
        this.env = env;
    }
    PwintyClient.prototype.init = function () {
        this.pwinty = pwintyInit(this.merchantId, this.apiKey, "https://" + this.env + ".pwinty.com/v2.5/");
    };
    PwintyClient.prototype.createPwintyOrderIfNecessary = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.currentOrder) {
                resolve(_this.currentOrder);
            }
            else {
                _this.pwinty.createOrder(_this.defaultMailingAddress(), function (err, order) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        _this.currentOrder = order;
                        resolve(_this.currentOrder);
                    }
                });
            }
        });
    };
    PwintyClient.prototype.addPhotoToPwintyOrder = function (photoUrl) {
        var _this = this;
        if (!this.currentOrder) {
            throw new Error('No order exists to add photo');
        }
        var photo = Object.assign({ type: "4x6", url: photoUrl, copies: "1", sizing: "Crop" });
        return new Promise(function (resolve, reject) {
            _this.pwinty.addPhotoToOrder(_this.currentOrder.id, photo, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(photo);
                }
            });
        });
    };
    PwintyClient.prototype.getPwintyOrderStatus = function (orderId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.pwinty.getOrderStatus(orderId, function (err, status) {
                if (err || !status.isValid) {
                    reject(err);
                }
                else {
                    resolve(orderId);
                }
            });
        });
    };
    PwintyClient.prototype.updatePwintyOrderStatus = function (orderId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.pwinty.updateOrderStatus({
                id: orderId,
                status: 'Submitted'
            }, function (err, status) {
                if (err) {
                    reject(err);
                }
                else {
                    _this.currentOrder = null;
                    resolve(status);
                }
            });
        });
    };
    // Private methods
    PwintyClient.prototype.defaultMailingAddress = function () {
        return {
            countryCode: 'US',
            qualityLevel: 'Standard',
            attributes: {
                finish: 'glossy'
            },
            recipientName: 'Amber Fearon',
            address1: '3705 Florida Ct. Unit E',
            addressTownOrCity: 'North Chicago',
            stateOrCounty: 'IL',
            postalOrZipCode: '60088'
        };
    };
    return PwintyClient;
}());
exports["default"] = PwintyClient;
