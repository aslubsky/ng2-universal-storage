import {Injector, Binding, Provider} from 'angular2/core'
import {LZString} from 'lz-string/typings/lz-string.d'

export class UniStorage {
    private _localStorageSupported:boolean;

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

    public setItem(key:string, value:string, fallbackType:string) {
        if (this._localStorageSupported) {
            window.localStorage[key] = value;
        } else if (fallbackType != undefined && fallbackType == 'cookie') {
            UniStorage._writeCookie(key, LZString.compressToEncodedURIComponent(JSON.stringify(value)));
        } else {
            window['UniStorage' + key] = value;
        }
    }

    public getItem(key:string, fallbackType:string) {
        if (this._localStorageSupported) {
            return window.localStorage[key] || null;
        } else if (fallbackType != undefined && fallbackType == 'cookie') {
            var val = UniStorage._readCookie(key);
            return val ? JSON.parse(LZString.decompressFromEncodedURIComponent(val)) : null;
        } else {
            return window['UniStorage' + key] || null;
        }
    }
}