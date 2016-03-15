import {Injectable}     from 'angular2/core';

@Injectable()
export class UniStorage {
    private _localStorageSupported:boolean;

    static FALLBACK_TYPE_COOKIE = 'cookie';
    static FALLBACK_TYPE_WINDOW = 'window';
    static PREFIX = 'ngStorage2';

    constructor() {
        //console.log('UniStorage constructor');
        try {
            window.localStorage.setItem("test", "test");
            window.localStorage.removeItem("test");
            this._localStorageSupported = true;
        } catch (e) {
            this._localStorageSupported = false;
        }
    }

    private static _writeCookie(name, value) {
        document.cookie = name + "=" + value + "; path=/";
    }


    private static _readCookie(name) {
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
    }

    public setItem(key:string, value:string, fallbackType?:string) {
        key = UniStorage.PREFIX + '-' + key;
        if (this._localStorageSupported) {
            window.localStorage.setItem(key, value);
        } else if (fallbackType != undefined && fallbackType == UniStorage.FALLBACK_TYPE_COOKIE) {
            UniStorage._writeCookie(key, LZString.compressToBase64(value));
        } else {
            window[key] = value;
        }
    }

    public getItem(key:string, fallbackType?:string) {
        key = UniStorage.PREFIX + '-' + key;
        if (this._localStorageSupported) {
            return window.localStorage.getItem(key) || null;
        } else if (fallbackType != undefined && fallbackType == UniStorage.FALLBACK_TYPE_COOKIE) {
            var val = UniStorage._readCookie(key);
            return val ? LZString.decompressFromBase64(decodeURIComponent(val)) : null;
        } else {
            return window[key] || null;
        }
    }
}
