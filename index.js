import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

var AuthServiceConfig = (function () {
    /**
     * @param {?} providers
     */
    function AuthServiceConfig(providers) {
        this.providers = new Map();
        for (var i = 0; i < providers.length; i++) {
            var element = providers[i];
            this.providers.set(element.id, element.provider);
        }
    }
    return AuthServiceConfig;
}());
var AuthService = (function () {
    /**
     * @param {?} config
     */
    function AuthService(config) {
        var _this = this;
        this._user = null;
        this._authState = new BehaviorSubject(null);
        this.providers = config.providers;
        this.providers.forEach(function (provider, key) {
            provider.initialize().then(function (user) {
                user.provider = key;
                _this._user = user;
                _this._authState.next(user);
            }).catch(function (err) {
                // this._authState.next(null);
            });
        });
    }
    Object.defineProperty(AuthService.prototype, "authState", {
        /**
         * @return {?}
         */
        get: function () {
            return this._authState.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} providerId
     * @return {?}
     */
    AuthService.prototype.signIn = function (providerId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var /** @type {?} */ providerObject = _this.providers.get(providerId);
            if (providerObject) {
                providerObject.signIn().then(function (user) {
                    user.provider = providerId;
                    resolve(user);
                    _this._user = user;
                    _this._authState.next(user);
                });
            }
            else {
                reject(AuthService.LOGIN_PROVIDER_NOT_FOUND);
            }
        });
    };
    /**
     * @return {?}
     */
    AuthService.prototype.signOut = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var /** @type {?} */ providerId = _this._user.provider;
            var /** @type {?} */ providerObject = _this.providers.get(providerId);
            if (providerObject) {
                providerObject.signOut().then(function () {
                    resolve();
                    _this._user = null;
                    _this._authState.next(null);
                });
            }
            else {
                reject(AuthService.LOGIN_PROVIDER_NOT_FOUND);
            }
        });
    };
    return AuthService;
}());
AuthService.LOGIN_PROVIDER_NOT_FOUND = "Login provider not found";
AuthService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
AuthService.ctorParameters = function () { return [
    { type: AuthServiceConfig, },
]; };

/**
 * @param {?} config
 * @return {?}
 */

var SocialLoginModule = (function () {
    function SocialLoginModule() {
    }
    /**
     * @param {?} config
     * @return {?}
     */
    SocialLoginModule.initialize = function (config) {
        return {
            ngModule: SocialLoginModule,
            providers: [
                AuthService,
                {
                    provide: AuthServiceConfig,
                    useValue: config
                }
            ]
        };
    };
    return SocialLoginModule;
}());
SocialLoginModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                providers: [
                    AuthService
                ]
            },] },
];
/**
 * @nocollapse
 */
SocialLoginModule.ctorParameters = function () { return []; };

var SocialUser = (function () {
    function SocialUser() {
    }
    return SocialUser;
}());

/**
 * @abstract
 */
var BaseLoginProvider = (function () {
    function BaseLoginProvider() {
    }
    /**
     * @abstract
     * @return {?}
     */
    BaseLoginProvider.prototype.initialize = function () { };
    /**
     * @abstract
     * @return {?}
     */
    BaseLoginProvider.prototype.signIn = function () { };
    /**
     * @abstract
     * @return {?}
     */
    BaseLoginProvider.prototype.signOut = function () { };
    /**
     * @param {?} id
     * @param {?} src
     * @param {?} onload
     * @return {?}
     */
    BaseLoginProvider.prototype.loadScript = function (id, src, onload) {
        if (document.getElementById(id)) {
            return;
        }
        var /** @type {?} */ signInJS = document.createElement("script");
        signInJS.async = true;
        signInJS.src = src;
        signInJS.onload = onload;
        document.head.appendChild(signInJS);
    };
    return BaseLoginProvider;
}());

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GoogleLoginProvider = (function (_super) {
    __extends(GoogleLoginProvider, _super);
    /**
     * @param {?} clientId
     */
    function GoogleLoginProvider(clientId) {
        var _this = _super.call(this) || this;
        _this.clientId = clientId;
        return _this;
    }
    /**
     * @return {?}
     */
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
                            var /** @type {?} */ user = new SocialUser();
                            var /** @type {?} */ profile = _this.auth2.currentUser.get().getBasicProfile();
                            var /** @type {?} */ authObject = _this.auth2.currentUser.get().getAuthResponse();
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
    /**
     * @return {?}
     */
    GoogleLoginProvider.prototype.signIn = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var /** @type {?} */ promise = _this.auth2.signIn();
            promise.then(function () {
                var /** @type {?} */ user = new SocialUser();
                var /** @type {?} */ profile = _this.auth2.currentUser.get().getBasicProfile();
                var /** @type {?} */ authObject = _this.auth2.currentUser.get().getAuthResponse();
                user.id = profile.getId();
                user.name = profile.getName();
                user.email = profile.getEmail();
                user.photoUrl = profile.getImageUrl();
                user.authToken = authObject;
                resolve(user);
            });
        });
    };
    /**
     * @return {?}
     */
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
}(BaseLoginProvider));
GoogleLoginProvider.PROVIDER_ID = "GOOGLE";

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FacebookLoginProvider = (function (_super) {
    __extends$1(FacebookLoginProvider, _super);
    /**
     * @param {?} clientId
     */
    function FacebookLoginProvider(clientId) {
        var _this = _super.call(this) || this;
        _this.clientId = clientId;
        return _this;
    }
    /**
     * @return {?}
     */
    FacebookLoginProvider.prototype.initialize = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.loadScript(FacebookLoginProvider.PROVIDER_ID, "//connect.facebook.net/en_US/sdk.js", function () {
                FB.init({
                    appId: _this.clientId,
                    autoLogAppEvents: true,
                    cookie: true,
                    xfbml: true,
                    version: 'v2.9'
                });
                // FB.AppEvents.logPageView(); #FIX for #18
                FB.getLoginStatus(function (response) {
                    if (response.status === 'connected') {
                        FB.api('/me?fields=name,email,picture,first_name,last_name', function (response) {
                            var /** @type {?} */ user = new SocialUser();
                            var /** @type {?} */ authObject = FB.getAuthResponse();
                            user.id = response.id;
                            user.name = response.name;
                            user.email = response.email;
                            user.photoUrl = "https://graph.facebook.com/" + response.id + "/picture?type=normal";
                            user.firstName = response.first_name;
                            user.lastName = response.last_name;
                            user.authToken = authObject;
                            resolve(user);
                        });
                    }
                });
            });
        });
    };
    /**
     * @return {?}
     */
    FacebookLoginProvider.prototype.signIn = function () {
        return new Promise(function (resolve, reject) {
            FB.login(function (response) {
                if (response.authResponse) {
                    FB.api('/me?fields=name,email,picture,first_name,last_name', function (response) {
                        var /** @type {?} */ user = new SocialUser();
                        var /** @type {?} */ authObject = FB.getAuthResponse();
                        user.id = response.id;
                        user.name = response.name;
                        user.email = response.email;
                        user.photoUrl = "https://graph.facebook.com/" + response.id + "/picture?type=normal";
                        user.firstName = response.first_name;
                        user.lastName = response.last_name;
                        user.authToken = authObject;
                        resolve(user);
                    });
                }
            }, { scope: 'email,public_profile' });
        });
    };
    /**
     * @return {?}
     */
    FacebookLoginProvider.prototype.signOut = function () {
        return new Promise(function (resolve, reject) {
            FB.logout(function (response) {
                resolve();
            });
        });
    };
    return FacebookLoginProvider;
}(BaseLoginProvider));
FacebookLoginProvider.PROVIDER_ID = "FACEBOOK";

export { SocialLoginModule, AuthService, AuthServiceConfig, SocialUser, FacebookLoginProvider, GoogleLoginProvider };
