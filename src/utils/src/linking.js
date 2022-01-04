import { Linking, Platform, Alert } from 'react-native';

const validURL = (url) => {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return reg.test(url);
}

const validEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const alert = (txt) => Alert.alert(txt)

const LaunchURL = function(url) {
	Linking.canOpenURL(url).then(supported => {
		if(!supported) {
			alert(`Can't handle url: ${url}`);
		} else {
			Linking.openURL(url).catch(err => {
				if(!url.includes('telprompt')) {
                    console.log(`openURL error ${err}`) 
                }
			});
		}
	}).catch(err => console.log(`An unexpected error happened ${err}`));
};

export default linking = {
    call: (num, prompt = false) => {
        let url = 'tel:';
        if(Platform.OS == 'ios') {
            url = prompt ? 'telprompt:' : 'tel:';
        }
        url += num.toString();
        LaunchURL(url);
    },
    email: (to, subject = null, body = null) => {
        let url = 'mailto:';
        let valueAdded = false;
        if(to){
            if(!validEmail(to)){
                Alert.alert(`Invalid Email Format`);
                return;
            }
            url += encodeURIComponent(to);
        }
        url += '?';
        if(subject){
            if(valueAdded) url += '&';
            valueAdded = true;
            url += 'subject=' + encodeURIComponent(subject);
        }
        if(body){
            if(valueAdded) url += '&';
            valueAdded = true;
            url += 'body=' + encodeURIComponent(body);
        }
        LaunchURL(url);
    },
    sms: (num, body = null) => {
        let url = 'sms:';
        url += num.toString();
        if(body){
            url += Platform.OS === 'ios' ? `&body=${body}` : `?body=${body}`;
        }
        LaunchURL(url);
    },
    web: (url) => {
        if(!validURL(url)){
            Alert.alert(`Invalid URL Format`)
            return;
        }
        LaunchURL(url);
    },
    whatsapp: (num) => {
        LaunchURL(`https://api.whatsapp.com/send?phone=${num}`)
    },
    settings: () => Platform.select({
        ios: LaunchURL('app-settings:'),
        android: Linking.openSettings()
    }),
    open: (url) => {
        LaunchURL(url);
    }
}
