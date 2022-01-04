
const BASE = 'http://192.168.1.225:8000'
// const BASE = 'http://127.0.0.1:8000'
// const BASE = 'https://gatehorizon.com'

export default {
    BASE: `${BASE}`,
    API: `${BASE}/api/janitor`,
    ONESIGNAL: '2bae8d7a-d3cd-4960-a943-637d9da57b26',
    // GOOGLE_MAPS: 'AIzaSyADaG_W7_vwxxVJn2xunQkIRQwoA6YQF3g',
	GOOGLE_MAPS: 'AIzaSyDyDmDW0IC74CE6vayHwQDAWXpZgko7YTE',
    APPLE_APPID: '1550195696',
	GooglePackageName: 'com.gatehorizon.janitor',
	VERSION: {
		ios: '1.0.0',
		android: '1.0.0'
	},
    URLS: {
        support: `${BASE}/mobile/support`,
        about: `${BASE}/mobile/about`,
        contact: `${BASE}/mobile/contact`,
        privacy: `https://apps.bitwize.com.lb/assets/privacy/?name=GateHorizon`,
        terms: `https://apps.bitwize.com.lb/assets/terms/?name=GateHorizon`,
    }
}
