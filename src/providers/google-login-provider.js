"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var base_login_provider_1 = require("../entities/base-login-provider");
var user_1 = require("../entities/user");
var GoogleLoginProvider = (function (_super) {
    __extends(GoogleLoginProvider, _super);
    function GoogleLoginProvider(clientId) {
        var _this = _super.call(this) || this;
        _this.clientId = clientId;
        return _this;
    }
    GoogleLoginProvider.prototype.initialize = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.loadScript(GoogleLoginProvider.PROVIDER_ID, "//apis.google.com/js/platform.js", function () {
                gapi.load('auth2', function () {
                    _this.auth2 = gapi.auth2.init({
                        client_id: _this.clientId,
                        scope: 'email'
                    });
                    _this.auth2.then(function () {
                        if (_this.auth2.isSignedIn.get()) {
                            var user = new user_1.SocialUser();
                            var profile = _this.auth2.currentUser.get().getBasicProfile();
                            var authObject = _this.auth2.currentUser.get().getAuthResponse();
                            user.id = profile.getId();
                            user.name = profile.getName();
                            user.email = profile.getEmail();
                            user.photoUrl = profile.getImageUrl();
                            user.firstName = profile.getGivenName();
                            user.lastName = profile.getFamilyName();
                            user.authToken = authObject;
                            resolve(user);
                        }
                    });
                });
            });
        });
    };
    GoogleLoginProvider.prototype.signIn = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var promise = _this.auth2.signIn();
            promise.then(function () {
                var user = new user_1.SocialUser();
                var profile = _this.auth2.currentUser.get().getBasicProfile();
                var authObject = _this.auth2.currentUser.get().getAuthResponse();
                user.id = profile.getId();
                user.name = profile.getName();
                user.email = profile.getEmail();
                user.photoUrl = profile.getImageUrl();
                user.authToken = authObject;
                resolve(user);
            });
        });
    };
    GoogleLoginProvider.prototype.signOut = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.auth2.signOut().then(function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    };
    return GoogleLoginProvider;
}(base_login_provider_1.BaseLoginProvider));
GoogleLoginProvider.PROVIDER_ID = "GOOGLE";
exports.GoogleLoginProvider = GoogleLoginProvider;
