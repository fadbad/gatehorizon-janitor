import RNRestart from 'react-native-restart';
import { I18nManager } from 'react-native'
import i18n from 'i18next'
import { initReactI18next, useTranslation, withTranslation, Trans } from 'react-i18next'
import useStorage from '../hooks/useStorage'
import Vars from '../../Vars'
const storage = useStorage()
const STORAGE_KEY = '@APP:languageCode'

import moment from 'moment'
import 'moment/min/locales';

import en from '../../app/locales/en.json';
import ar from '../../app/locales/ar.json';

const resources = { 
    en: { translation: en }, 
    ar: { translation: ar },  
}
const supportedLangs = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
];
const defaultLang = 'en';
const currentLang = async () => {
    const lng = await storage.get(STORAGE_KEY)
    return lng || defaultLang
}

const changeLang = lng => i18n.changeLanguage(lng)

const languageDetector = {
    type: 'languageDetector',
    async: true,
    detect: async (callback) => {
        const lng = await currentLang()
        Vars.setLang(lng)
        moment.locale(lng)
        callback(lng)
    },
    init: () => {},
    cacheUserLanguage: () => {}
};

i18n
.use(languageDetector)
.use(initReactI18next)
.init({
	react:{
		useSuspense: false,
		wait: false
	},
    fallbackLng: defaultLang,
    resources: resources,
    debug: false,
    interpolation: {
        escapeValue: false,
        format: (value, format, lng) => {
            if (format === 'uppercase') return value.toUpperCase();
            if(value instanceof Date) return moment(value).format(format);
            return value;
        }
    },
});

i18n.on('languageChanged', async (lng) => {
    let curr = await currentLang();
    if(lng !== curr){
        storage.save(STORAGE_KEY, lng);
        Vars.setLang(lng)
        moment.locale(lng)
        await I18nManager.forceRTL( lng === 'ar' )
        RNRestart.Restart()
    }
});

const isRTL = () => i18n.dir(i18n.language || 'en') === 'rtl'

export {
    i18n,
    withTranslation,
    useTranslation,
    supportedLangs,
    currentLang,
    changeLang,
    Trans,
    isRTL
}

export default i18n
