var lz_string_d_1 = require('lz-string/libs/lz-string');
//import {LZString} from 'lz-string/libs/lz-string'
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
    UniStorage._writeCookie = function (name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
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
        if (this._localStorageSupported) {
            window.localStorage[key] = value;
        }
        else if (fallbackType != undefined && fallbackType == 'cookie') {
            UniStorage._writeCookie(key, lz_string_d_1.LZString.compressToEncodedURIComponent(JSON.stringify(value)));
        }
        else {
            window['UniStorage' + key] = value;
        }
    };
    UniStorage.prototype.getItem = function (key, fallbackType) {
        if (this._localStorageSupported) {
            return window.localStorage[key] || null;
        }
        else if (fallbackType != undefined && fallbackType == 'cookie') {
            var val = UniStorage._readCookie(key);
            return val ? JSON.parse(lz_string_d_1.LZString.decompressFromEncodedURIComponent(val)) : null;
        }
        else {
            return window['UniStorage' + key] || null;
        }
    };
    return UniStorage;
})();
exports.UniStorage = UniStorage;
