import {Injectable}     from 'angular2/core';

require('lz-string/libs/lz-string');
declare module LZString {
    function compressToBase64(input: string): string;
    function decompressFromBase64(input: string): string;

    function compressToUTF16(input: string): string;
    function decompressFromUTF16(compressed: string): string;

    function compressToUint8Array(uncompressed: string): Uint8Array;
    function decompressFromUint8Array(compressed: Uint8Array): string;

    function compressToEncodedURIComponent(input: string): string;
    function decompressFromEncodedURIComponent(compressed: string): string;

    function compress(input: string): string;
    function decompress(compressed: string): string;
}


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
            UniStorage._writeCookie(key, LZString.compressToEncodedURIComponent(value));
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
            return val ? LZString.decompressFromEncodedURIComponent(decodeURIComponent(val)) : null;
        } else {
            return window[key] || null;
        }
    }
}