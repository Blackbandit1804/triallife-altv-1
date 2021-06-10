import en from './languages/en';
import de from './languages/de';
import fr from './languages/fr';
export const placeholder = `_%_`;
let defaultLanguage = 'en';
const locales = { en, de, fr };
export class LocaleController {
    static setLanguage(iso639 = 'en') {
        defaultLanguage = iso639;
    }
    static get(key, ...args) {
        if (!locales[defaultLanguage][key]) {
            console.log(`Translation for ${key} was not found`);
            return key;
        }
        let message = locales[defaultLanguage][key];
        for (let i = 0; i < args.length; i++)
            message = message.replace(placeholder, args[i]);
        return message;
    }
    static getWebviewLocale(key) {
        if (!locales[defaultLanguage][key]) {
            console.log(`Translation for ${key} was not found`);
            return {};
        }
        return locales[defaultLanguage][key];
    }
}
