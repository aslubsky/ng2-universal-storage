export declare class UniStorage {
    private _localStorageSupported;
    static FALLBACK_TYPE_COOKIE: string;
    static FALLBACK_TYPE_WINDOW: string;
    static PREFIX: string;
    constructor();
    private static _writeCookie(name, value);
    private static _readCookie(name);
    setItem(key: string, value: string, fallbackType?: string): void;
    getItem(key: string, fallbackType?: string): any;
}
