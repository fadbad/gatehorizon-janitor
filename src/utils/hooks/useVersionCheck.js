import React from 'react'
import { Alert, Platform, Linking } from 'react-native';
import useApi from './useApi'
import Config from '../../Config'

export default (props = {}) => {
	const {
		endpoint = '/version',
		delay = 5000
	} = props
	
	const api = useApi()

	const [hasUpdate, setHasUpdate] = React.useState(false)
	const [newVersion, setNewVersion] = React.useState(null)

	const currentVersion = Platform.select({
		ios: Config.VERSION.ios,
		android: Config.VERSION.android
	})
    
    const STORE_LINK = Platform.select({
        ios: `https://itunes.apple.com/app/id${Config.APPLE_APPID}`,
        android: `https://play.google.com/store/apps/details?id=${Config.GooglePackageName}`
	});
	
	const version_compare = (a, b) => {
		const prep = (t) => {
			return ("" + t)
			  .replace(/[^0-9\.]+/g, (c) => {
				  return "." + ((c = c.replace(/[\W_]+/, "")) ? c.toLowerCase().charCodeAt(0) - 65536 : "") + "."
			  })
			  .replace(/(?:\.0+)*(\.-[0-9]+)(\.[0-9]+)?\.*$/g, "$1$2")
			  .split('.');
		}
		a = prep(a);
		b = prep(b);
		for (var i = 0; i < Math.max(a.length, b.length); i++){
			a[i] = ~~a[i];
			b[i] = ~~b[i];
			if (a[i] > b[i]) return 1;
			else if (a[i] < b[i]) return -1;
		}
		return 0;
	}
	
	const __delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

	const LaunchURL = (url) => {
		Linking.canOpenURL(url).then(supported => {
			if(!supported) {
				alert(`Can't handle url: ${url}`);
			} else {
				Linking.openURL(url).catch(err => console.log(`openURL error ${err}`) );
			}
		}).catch(err => console.log(`An unexpected error happened ${err}`));
	};
	
	const boot = async () => {
		await __delay(delay) // allow 15 seconds for the app to boot
		const res = await api.post(endpoint)
		if(res.result == 'success'){
			const __hasUpdate = Platform.select({
				ios: version_compare(res.ios, Config.VERSION.ios) > 0 ? true : false,
				android: version_compare(res.android, Config.VERSION.android) > 0 ? true : false,
			});

			const __newVersion = Platform.select({
				ios: res.ios,
				android: res.android
			});

			setHasUpdate(__hasUpdate)
			setNewVersion(__newVersion)
		}
	};

	React.useEffect(() => { 
		boot()
	}, []);

	return {
		hasUpdate,
		currentVersion,
		newVersion,
		update_link: STORE_LINK,
		update_cb: () => LaunchURL(STORE_LINK)
	}
}
