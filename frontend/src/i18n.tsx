import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import {DEBUG} from "./pages/root.tsx";

/*
TESTING: 
    1) change browser preferred language
    2*) clear local storage
    3*) reload page

    *) extension: https://chromewebstore.google.com/detail/clear-cache-and-cookies/jkmpbdjckkgdaopigpfkahgomgcojlpg
*/

await i18n
    // load translation using http -> see /public/locales
    // learn more: https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        debug: DEBUG,
        lng: localStorage.getItem('language') || 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });

export default i18n;