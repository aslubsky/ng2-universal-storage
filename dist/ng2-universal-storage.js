"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var UniStorage = (function () {
    function UniStorage() {
        //console.log('UniStorage constructor');
        try {
            window.localStorage.setItem("test", "test");
            window.localStorage.removeItem("test");
            this._localStorageSupported = true;
        }
        catch (e) {
            this._localStorageSupported = false;
        }
    }
    UniStorage._writeCookie = function (name, value) {
        document.cookie = name + "=" + value + "; path=/";
    };
    UniStorage._readCookie = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    };
    UniStorage.prototype.setItem = function (key, value, fallbackType) {
        key = UniStorage.PREFIX + '-' + key;
        if (this._localStorageSupported) {
            window.localStorage.setItem(key, value);
        }
        else if (fallbackType != undefined && fallbackType == UniStorage.FALLBACK_TYPE_COOKIE) {
            UniStorage._writeCookie(key, value);
        }
        else {
            window[key] = value;
        }
    };
    UniStorage.prototype.getItem = function (key, fallbackType) {
        key = UniStorage.PREFIX + '-' + key;
        if (this._localStorageSupported) {
            return window.localStorage.getItem(key) || null;
        }
        else if (fallbackType != undefined && fallbackType == UniStorage.FALLBACK_TYPE_COOKIE) {
            var val = UniStorage._readCookie(key);
            return val ? decodeURIComponent(val) : null;
        }
        else {
            return window[key] || null;
        }
    };
    UniStorage.FALLBACK_TYPE_COOKIE = 'cookie';
    UniStorage.FALLBACK_TYPE_WINDOW = 'window';
    UniStorage.PREFIX = 'ngStorage2';
    UniStorage = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], UniStorage);
    return UniStorage;
}());
exports.UniStorage = UniStorage;
//# sourceMappingURL=ng2-universal-storage.js.map