import React from 'react'
import { Alert, Platform, Linking } from 'react-native';
import useStorage from './useStorage'
import Config from '../../Config'

export default ({
    reviewKey, delay, days, title, subtitle, sure, later
}) => {

    const storage = useStorage()
	
	reviewKey = reviewKey || '@Session:AppStoreReview_';
	delay = delay || 5000;
	days = days || 7;
	title = title || 'Are you enjoying this app?';
	subtitle = subtitle || 'Give us 5 stars!';
	sure = sure || 'Sure!';
    later = later || 'Maybe later';
    
    const STORE_LINK = Platform.select({
        ios: `itms-apps://itunes.apple.com/app/id${Config.APPLE_APPID}?action=write-review`,
        android: `market://details?id=${Config.GooglePackageName}`
    });
    
    const daysBetween = (date1, date2) => {
        const one_day = 1000 * 60 * 60 * 24;
        const date1_ms = date1.getTime();
        const date2_ms = date2.getTime();
        const difference_ms = date2_ms - date1_ms;
        return Math.round(difference_ms / one_day);
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
		const data = await storage.get(reviewKey) || '{}';
		const { last = new Date().getTime(), done = false } = data;
		const lastDate = new Date(last);

		if (daysBetween(lastDate, new Date()) >= days && !done) {
			await __delay(delay)
			Alert.alert( title, subtitle, [
				{
					text: later, 
					onPress: async () => {
						await storage.save(reviewKey, { last: new Date().getTime() })
					} 
				},
				{
					text: sure,
					onPress: async () => {
						await storage.save(reviewKey, { done: true })
						LaunchURL(STORE_LINK)
					}
				},
				{
					cancelable: true,
					onDismiss: async () => {
						await storage.save(reviewKey, { last: new Date().getTime() })
					}
				}
			]);
		} else {
			await storage.save(reviewKey, { last })
		}
	};

	React.useEffect(() => { boot() }, []);
}
