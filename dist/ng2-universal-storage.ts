import {Injectable}     from 'angular2/core';
import {LZString} from 'lz-string/typings/lz-string.d'

@Injectable()
export class UniStorage {
    private _localStorageSupported:boolean;

    static FALLBACK_TYPE_COOKIE = 'cookie';
    static FALLBACK_TYPE_WINDOW = 'window';
    static PREFIX = 'ngStorage';

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

    private static _writeCookie(name, value, days?:number) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
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
            UniStorage._writeCookie(key, LZString.compressToEncodedURIComponent(value));
        } else {
            window['UniStorage' + key] = value;
        }
    }

    public getItem(key:string, fallbackType?:string) {
        key = UniStorage.PREFIX + '-' + key;
        if (this._localStorageSupported) {
            return window.localStorage.getItem(key) || null;
        } else if (fallbackType != undefined && fallbackType == UniStorage.FALLBACK_TYPE_COOKIE) {
            var val = UniStorage._readCookie(key);
            return val ? LZString.decompressFromEncodedURIComponent(val) : null;
        } else {
            return window['UniStorage' + key] || null;
        }
    }
}