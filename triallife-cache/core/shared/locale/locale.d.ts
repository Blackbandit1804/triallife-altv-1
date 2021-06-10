export declare const placeholder = "_%_";
export declare class LocaleController {
    static setLanguage(iso639?: string): void;
    static get(key: string, ...args: any[]): string;
    static getWebviewLocale(key: string): Object;
}
