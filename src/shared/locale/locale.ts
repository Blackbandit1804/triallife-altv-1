import { LocaleFormat } from '../interfaces/local-format';
import en from './languages/en';
import fr from './languages/fr';
import de from './languages/de';
export const placeholder = `_%_`;

let defaultLanguage = 'de';

const locales: LocaleFormat = { en, fr, de };

export class LocaleController {
    static setLanguage(iso639: string = 'de') {
        defaultLanguage = iso639;
    }

    static get(key: string, ...args: any[]): string {
        if (!locales[defaultLanguage][key]) {
            console.log(`Translation for ${key} was not found`);
            return key;
        }
        let message = locales[defaultLanguage][key];
        for (let i = 0; i < args.length; i++) {
            message = message.replace(placeholder, args[i]);
        }
        return message;
    }

    static getWebviewLocale(key: string): Object {
        if (!locales[defaultLanguage][key]) {
            console.log(`Translation for ${key} was not found`);
            return {};
        }
        return locales[defaultLanguage][key];
    }
}
