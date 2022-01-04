import { Vibration, Animated, Alert } from 'react-native'
import _ from 'lodash';
import moment from 'moment'
import Config from '../Config';

export { _, moment, Config, Vibration, Animated, Alert }

export { default as Vars } from '../Vars'

export {
    i18n, withTranslation, useTranslation, supportedLangs, currentLang, changeLang, Trans
} from './app/i18n'

export * from './hooks'

export { default as helper } from './lib/helper'
export { default as linking } from './src/linking'
// export { default as GooglePlaces } from './src/googlePlaces'

// export * from './src/auth'
export * from './src/colors'
export * from './src/date'
export * from './src/debounce'
export * from './src/maps'
export * from './src/rand'
export * from './src/functions'

// export * from './src/upload'
