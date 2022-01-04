/**
 * React Native Map Link
 */

import { Platform } from 'react-native'

export const isIOS = Platform.OS === 'ios'

export function generatePrefixes(options) {
  options = options || {}
  return {
    'apple-maps': isIOS ? 'http://maps.apple.com/' : 'applemaps://',
    'google-maps': prefixForGoogleMaps(options.alwaysIncludeGoogle || true),
    citymapper: 'citymapper://',
    uber: 'uber://',
    lyft: 'lyft://',
    transit: 'transit://',
    waze: 'waze://',
    yandex: 'yandexnavi://',
    moovit: 'moovit://',
    'yandex-maps': 'yandexmaps://maps.yandex.ru/',
  }
}

export function prefixForGoogleMaps(alwaysIncludeGoogle) {
  return isIOS && !alwaysIncludeGoogle
    ? 'comgooglemaps://'
    : 'https://maps.google.com/'
}

export const titles = {
  'apple-maps': 'Apple Maps',
  'google-maps': 'Google Maps',
  'citymapper': 'Citymapper',
  'uber': 'Uber',
  'lyft': 'Lyft',
  'transit': 'The Transit App',
  'waze': 'Waze',
  'yandex': 'Yandex.Navi',
  'moovit': 'Moovit',
  'yandex-maps': 'Yandex Maps'
}
