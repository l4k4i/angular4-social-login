"use strict";
exports.__esModule = true;
var BaseLoginProvider = (function () {
    function BaseLoginProvider() {
    }
    BaseLoginProvider.prototype.loadScript = function (id, src, onload) {
        if (document.getElementById(id)) {
            return;
        }
        var signInJS = document.createElement("script");
        signInJS.async = true;
        signInJS.src = src;
        signInJS.onload = onload;
        document.head.appendChild(signInJS);
    };
    return BaseLoginProvider;
}());
exports.BaseLoginProvider = BaseLoginProvider;
