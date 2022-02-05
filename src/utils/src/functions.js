import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Dimensions, Platform, Image, Alert, StyleSheet, KeyboardAvoidingView, I18nManager, Linking, PixelRatio, View, Keyboard, LayoutAnimation, UIManager, Clipboard
} from 'react-native';
import _ from 'lodash';
// import ImagePicker from 'react-native-image-crop-picker'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { default as Fuse } from '../lib/fuse'
import countries_json from '../lib/json/countries.json'

export { Platform, Dimensions }

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export const ltrim = (str, chars) => {
    str = str.toString();
    if (!str) return '';
    if (!chars) return str.replace( /^\s+/, '' );
    chars = chars.toString();

    var i = 0,
        letters = str.split( '' ),
        count = letters.length;

    for ( i; i < count; i ++ ) {
        if ( chars.indexOf( letters[i] ) === -1 ) {
            return str.substring( i );
        }
    }
    return str;
}

export const rtrim = (str, chars) => {
    str = str.toString();
    if(!str) return '';
    if (!chars) return str.replace( /\s+$/, '' );
    chars = chars.toString();
    var letters = str.split( '' ),
        i = letters.length - 1;

    for ( i; i >= 0; i -- ) {
        if ( chars.indexOf( letters[i] ) === -1 ) {
            return str.substring( 0, i + 1 );
        }
    }
    return str;
}

export const toSaudiNumber = num => {
    const regex = /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/
    if( empty(num)) return false;
    num = num.replace(/\s/g, "") // remove all spaces
    if(!regex.test(num)) return false;
    if(_.startsWith(num, '00966')) return num.replace('00966', '966')
    if(_.startsWith(num, '+966')) return num.replace('+966', '966')
    if(_.startsWith(num, '966')) return num
    if(_.startsWith(num, '0')) num = ltrim(num, '0')
    return `966${num}`
}

export const countriesJson = countries_json;

// use as: list = fuse(list, ['name', 'title'], options).search(KEYWORD) 
export const fuse = (list, keys = [], options = {}) => new Fuse(list, {keys: keys, ...options})

export const { width, height } = Dimensions.get('window')

export const isTablet = Math.min(width, height) >= 768;
export const isIphoneX = Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS && ((height === 780 || width === 780) || (height === 812 || width === 812) || (height === 896 || width === 896)|| (height === 926 || width === 926))
export const ifIphoneX = (iphoneXStyle, regularStyle) => isIphoneX ? iphoneXStyle : regularStyle;
export const isIOS = Platform.OS === 'ios'
export const isAndroid = Platform.OS === 'android'
export const ifAndroid = (androidStyle, regularStyle) => isAndroid ? androidStyle : regularStyle;

export const keyboardDismiss = () => Keyboard.dismiss()

export const hairline = StyleSheet.hairlineWidth

const getStatusBarHeight = (skipAndroid) => {
	const STATUSBAR_DEFAULT_HEIGHT = 20;
	const STATUSBAR_X_HEIGHT = 44;
	const STATUSBAR_IP12_HEIGHT = 47;
	const STATUSBAR_IP12MAX_HEIGHT = 47;

	const X_WIDTH = 375;
	const X_HEIGHT = 812;

	const XSMAX_WIDTH = 414;
	const XSMAX_HEIGHT = 896;

	const IP12_WIDTH = 390;
	const IP12_HEIGHT = 844;

	const IP12MAX_WIDTH = 428;
	const IP12MAX_HEIGHT = 926;

	const { height: W_HEIGHT, width: W_WIDTH } = Dimensions.get("window");

	let statusBarHeight = STATUSBAR_DEFAULT_HEIGHT;
	let isIPhoneX_v = false;
	let isIPhoneXMax_v = false;
	let isIPhone12_v = false;
	let isIPhone12Max_v = false;
	let isIPhoneWithMonobrow_v = false;

	if (Platform.OS === "ios" && !Platform.isPad && !Platform.isTVOS) {
		if (W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT) {
			isIPhoneWithMonobrow_v = true;
			isIPhoneX_v = true;
			statusBarHeight = STATUSBAR_X_HEIGHT;
		} else if (W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT) {
			isIPhoneWithMonobrow_v = true;
			isIPhoneXMax_v = true;
			statusBarHeight = STATUSBAR_X_HEIGHT;
		} else if (W_WIDTH === IP12_WIDTH && W_HEIGHT === IP12_HEIGHT) {
			isIPhoneWithMonobrow_v = true;
			isIPhone12_v = true;
			statusBarHeight = STATUSBAR_IP12_HEIGHT;
		} else if (W_WIDTH === IP12MAX_WIDTH && W_HEIGHT === IP12MAX_HEIGHT) {
			isIPhoneWithMonobrow_v = true;
			isIPhone12Max_v = true;
			statusBarHeight = STATUSBAR_IP12MAX_HEIGHT;
		}
	}
	return Platform.select({
		ios: statusBarHeight,
		android: skipAndroid ? 0 : StatusBar.currentHeight,
		default: 0,
	});
}

export const statusBarHeight = getStatusBarHeight(true)

export const getBottomSpace = Platform.select({
	ios: statusBarHeight - 10,
	android: 0,
	default: 0
});

// const getStatusBarHeight = (safe = true) => {
//     return Platform.select({
//         ios: isIphoneX ? safe ? 44 : 30 : 20,
//         // android: StatusBar.currentHeight,
//         android: 0,
//         default: 0
//     });
// }

// export const statusBarHeight = getStatusBarHeight(true);
// export const getBottomSpace = isIphoneX ? 34 : 0;

export const HEADER_HEIGHT = Platform.select({
    android: 56,
    default: 44,
}) + statusBarHeight;

export const FOOTER_HEIGHT = Platform.select({
    android: 63,
    default: 48,
}) + getBottomSpace;

export const AVAIL_HEIGHT = height - FOOTER_HEIGHT;

export const widthPerc = (percentage) => {
    const value = (percentage * width) / 100;
    return Math.round(value);
}

export const heightPerc = (percentage) => {
    const value = (percentage * height) / 100;
    return Math.round(value);
}


export const country_name_by_iso = (code) => {
    if(isEmpty(code)) return ''
    const i = countries_json.findIndex(i => i.code.toLowerCase() == code.toLowerCase())
    return i > -1 ? countries_json[i]?.name : ''
}

export const country_code_by_iso = (code) => {
    if(isEmpty(code)) return ''
    const i = countries_json.findIndex(i => i.code.toLowerCase() == code.toLowerCase())
    return i > -1 ? countries_json[i]?.dialCode : ''
}

export const formatPhone = (num, country = 'LB') => {
    // https://www.npmjs.com/package/libphonenumber-js
    const n = parsePhoneNumberFromString(num, country.toUpperCase());
    console.log('phone num', n);
    if(n) return n.number.replace('+', '')
    return '';
}

export const blank_image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

export const openSettings = Platform.select({
    ios: () => Linking.openURL('app-settings:'),
    android: () => Linking.openSettings()
});

export const maskCreditCard = n => {
    if(typeof n === 'string' && n.length > 12){
        return n.substr(0, 4)+' **** **** '+n.substr(-4)
    }
    return n
}

export const version_compare = (a, b) => {
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

export const price = (
    amount, currency = 'USD', position = 'left', decimalCount = 2, decimal = ".", thousands = ","
) => {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
    const negativeSign = amount < 0 ? "-" : "";
  
    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;
  
    const num = negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    
    return position === 'right' ? num+' '+currency : currency+' '+num
}

export const priceFormat = amount => {
    const rtl = I18nManager.isRTL
    const currency = rtl ? 'ريال' : 'SAR'
    const position = rtl ? 'right' : 'left'
    return price(amount, currency, position)
}

export const flag_url = (cn, size=128) => {
    if(typeof cn !== 'string') return null;
    if(cn.length != 2) return null;
    cn = cn.toLowerCase();
    return {uri: `https://raw.githubusercontent.com/fadbad/flags/master/${size}/${cn}.png`}
}

export const withRef = (WrappedComponent) => {
    class WithRef extends React.Component {
        render() {
            const {forwardedRef, ...props} = this.props;
            return(<WrappedComponent ref={forwardedRef} {...props} />);
        }
    }
    return React.forwardRef((props, ref) => {
        return <WithRef {...props} forwardedRef={ref} />;
    });
}

export const getYoutubeId = url => {
    const result = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    const videoIdWithParams = result[2];
    if (videoIdWithParams !== undefined) {
        const cleanVideoId = videoIdWithParams.split(/[^0-9a-z_-]/i)[0];
        return cleanVideoId;
    }
    return null;
}

export const getYoutubeThumb = url => {
    const id = getYoutubeId(url)
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`; // hqdefault, maxresdefault
}

export const pad = n => {
    n = parseInt(n) || 0
    return n < 10 ? `0${n}` : n
}

export const uuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        let r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export const trim = (string, length = 70) => _.truncate(string, { length: length })
export const empty = (str, includeZero = true) => {
    if( includeZero & (str === 0 || str === '0') ) return true
    str = str ? str.toString() : ''
    return _.isEmpty(str)
}

export const ifDefined = (a, def = '') => typeof a !== 'undefined' ? a : def

export const cors = (url) => {
    const base = 'https://cors.bitwize.com.lb/'
    url = url.replace(base, '')
    return base + url
}

export const KeyboardView = ({ style, children, ...rest }) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            pointerEvents="box-none"
            style={style}
            {...rest}
        >
            {children}
        </KeyboardAvoidingView>
    )
}

export class KeyboardSpacer extends Component {
	static propTypes = {
		topInsets: PropTypes.number,
	};

	static defaultProps = {
		topInsets: 0,
	};

	constructor(props) {
		super(props);
		this.showListener = null;
		this.hideListener = null;
		this.state = {
			keyboardHeight: 0,
		};
	}

	componentDidMount() {
		if (!this.showListener) {
			let name = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
			this.showListener = Keyboard.addListener(name, e =>
				this.onKeyboardShow(e),
			);
		}
		if (!this.hideListener) {
			let name = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
			this.hideListener = Keyboard.addListener(name, () =>
				this.onKeyboardHide(),
			);
		}
	}

  	componentWillUnmount() {
		if (this.showListener) {
			this.showListener.remove();
			this.showListener = null;
		}
		if (this.hideListener) {
			this.hideListener.remove();
			this.hideListener = null;
		}
  	}

  	componentDidUpdate(prevProps, prevState) {
    	if (prevState.keyboardHeight !== this.state.keyboardHeight) {
            LayoutAnimation.configureNext({
                duration: 500,
                create: {
                    duration: 300,
                    type: LayoutAnimation.Types.easeInEaseOut,
                    property: LayoutAnimation.Properties.opacity,
                },
                update: {
                    type: LayoutAnimation.Types.spring,
                    springDamping: 200,
                },
            });
    	}
  	}

  	onKeyboardShow(e) {
    	if (!e || !e.endCoordinates || !e.endCoordinates.height) return;
    	let height = e.endCoordinates.height + (this.props.topInsets ? this.props.topInsets : 0);
    	this.setState({keyboardHeight: height});
  	}

  	onKeyboardHide() {
    	this.setState({keyboardHeight: 0});
  	}

  	render() {
    	return (
      		<View
        		style={{
					backgroundColor: 'rgba(0, 0, 0, 0)',
					left: 0, right: 0, bottom: 0,
					height: this.state.keyboardHeight
				}}
      		/>
    	);
  	}
}

export const array_last = (array, n) => {
    if (array == null) return void 0;
    if (n == null) return array[array.length - 1];
    return array.slice(Math.max(array.length - n, 0));  
};

export const array_remove = (array, el) => {
    const index = array.indexOf(el);
    if (index > -1) array.splice(index, 1)
    return array
}

export const empty_array = (num = 3) => new Array(num).fill({})

export const isFunction = input => typeof input === 'function';
export const renderIf = (predicate) => {
    return function(elemOrThunk) {
        return predicate ? (isFunction(elemOrThunk) ? elemOrThunk() : elemOrThunk) : null;
    }
} 

export const modalizeHeight = x => ifIphoneX(height - x - statusBarHeight, height - x)

export const initials = (name) => name.split(" ").map((n,i,a) => i === 0 || i+1 === a.length ? n[0] : null).join("").toUpperCase()

export const confirm = (text, action = null) => {
    return Alert.alert(
        'Are you sure?', text, [
            {text: 'No', style: 'cancel'},
            {text: 'Yes, Sure!', onPress: () => action && action()}
        ]
    )
}

export const alert = (title, subtitle = null, action = null) => {
    if(action){
        return Alert.alert(
            title, subtitle, [
                {text: 'OK', onPress: () => action && action()}
            ]
        )
    } else {
        return Alert.alert( title, subtitle )
    }
}

export const isRTL = I18nManager.isRTL
export const isRTLString = (s) => {           
    var ltrChars    = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF'+'\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
        rtlChars    = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
        rtlDirCheck = new RegExp('^[^'+ltrChars+']*['+rtlChars+']');

    return rtlDirCheck.test(s);
};

export const validArray = obj => !Array.isArray ? Object.prototype.toString.call(obj) === '[object Array]' : Array.isArray(obj)

export const validURL = (url) => {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return reg.test(url);
}

export const validEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export const validPhone = (num, country = 'LB') => {
    if(!num) return false;
    if(typeof num === 'undefined') return false;
    const n = parsePhoneNumberFromString(num, country.toUpperCase());
    return n && n.isValid() ? true : false;
}

export const validSaudiPhone = (num) => {
    const re = /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/
    return re.test(num)
}

export const deepValue = (obj, path, list = []) => {
    if (!path) {
        // If there's no path left, we've gotten to the object we care about.
        list.push(obj)
    } else {
        const dotIndex = path.indexOf('.')
        let firstSegment = path
        let remaining = null
  
        if (dotIndex !== -1) {
            firstSegment = path.slice(0, dotIndex)
            remaining = path.slice(dotIndex + 1)
        }
        const value = obj[firstSegment]
        if (value !== null && value !== undefined) {
            if (!remaining && (typeof value === 'string' || typeof value === 'number')) {
                list.push(value.toString())
            } else if (validArray(value)) {
                // Search each item in the array.
                for (let i = 0, len = value.length; i < len; i += 1) {
                    deepValue(value[i], remaining, list)
                }
            } else if (remaining) {
                // An object. Recurse further.
                deepValue(value, remaining, list)
            }
        }
    }
    return list
}

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const isEmpty = (value) => {
    return (
        typeof value === 'undefined' ||
        value === undefined || 
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) || 
        (typeof value === "string" && value.trim().length === 0)
    );
}

export const __empty = (value, def = '') => !isEmpty(value) ? value : def;

export const get_avatar = (avatar) => avatar.encoded || avatar || null;

export const pretty_number = (num, minValue = 0, hideMin = false) => {

    if(!num || !+num || typeof +num !== 'number') {
        num = parseInt(num, 10) || 0
    }

    var num = +num;
    var digits = 2;

    var si = [
        { value: 1E18, symbol: "E" },
        { value: 1E15, symbol: "P" },
        { value: 1E12, symbol: "T" },
        { value: 1E9,  symbol: "G" },
        { value: 1E6,  symbol: "M" },
        { value: 1E3,  symbol: "k" }
    ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;

    if( num === minValue ){
        if(hideMin) return null
    }

    if(typeof num === 'number' && num >= minValue) {
        for (i = 0; i < si.length; i++) {
            if (num >= si[i].value) {
                return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
                // return num / si[i].value + si[i].symbol
            }
        }
    }
    return num
};

export const copy = (text) => Clipboard.setString(text);
export const paste = () => Clipboard.getString();

export const blacklist = (src, ...args) => {
    var copy = {};
    var ignore = Array.from(args);
    for (var key in src) {
        if (ignore.indexOf(key) === -1) {
            copy[key] = src[key];
        }
    }
    return copy;
};

export const numberFormat = (number) => {
    if(!number) return '0.00'
    var str = '';
    number.toString().split('').reverse().map((e, index) => {
        str += e.toString();
        if ((index + 1) % 3 === 0) {
            str += ',';
        }
    });
    return str.split('').reverse().join('').replace(/^,/, '');
};

export const parseTimes = (num) => {
    var minutes = 0;
    var seconds = 0;
    num = Math.floor(num / 1000);
    minutes = ('0' + Math.floor(num / 60)).slice(-2);
    seconds = ('0' + num % 60).slice(-2);
    return { minutes, seconds };
};

export const loadLocalImages = (images) => {
    return Promise.all(Object.keys(images).map((i) => {
        let img = {
            ...Image.resolveAssetSource(images[i]),
            cache: 'force-cache'
        };
        return Image.prefetch(img);
    }));
}

export const arrayUnique = (array) => {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j]) {
                a.splice(j--, 1);
            }
        }
    }
    return a;
}

export const tap = (output, callback) => {
    callback(output)
    return output
}

export const isNumeric = (num) => !isNaN(num)

export const add_query_args = (uri, params, nocache = false) => {
    params = params || {};
    if(nocache) params._ = Date.now();
    var separator = uri.indexOf('?') !== -1 ? '&' : '?';
    for (var key in params) {
        if(params.hasOwnProperty(key)){
            uri += separator + key + '=' + encodeURIComponent(params[key]);
            separator = '&';
        }
    }
    return uri;
}

export const toQueryParams = (object) => {
    return Object.keys(object)
        .filter(key => !!object[key])
        .map(key => key + "=" + encodeURIComponent(object[key]))
        .join("&")
}

export const shadow = (elevation = 1, color='#000', opacity = 0.24) => {
    if (elevation === 0) return {};

    let height, radius;
    switch (elevation) {
        case 1: height = 0.5; radius = 0.75; break;
        case 2: height = 0.75; radius = 1.5; break;
        default: height = elevation - 1; radius = elevation;
    }

    return { 
        shadowColor: color,
        shadowOffset: { width: 0, height },
        shadowOpacity: opacity,
        shadowRadius: radius,
    };
}


export const pixelRatio = PixelRatio.get()
export const pixelSize = (pixelRatio >= 3) ? 0.333 : (pixelRatio >= 2) ? 0.5 : 1

export const normalizeTextSize = size => {
    if (pixelRatio >= 2 && pixelRatio < 3) {
        if (width < 360) return size * 0.95;
        if (height < 667) return size;
        if (height >= 667 && height <= 735) return size * 1.15;
        return size * 1.25;
    }
    if (pixelRatio >= 3 && pixelRatio < 3.5) {
        if (width <= 360) return size;
        if (height < 667) return size * 1.15;
        if (height >= 667 && height <= 735) return size * 1.2;
        return size * 1.27;
    }
    if (pixelRatio >= 3.5) {
        if (width <= 360) return size;
        if (height < 667) return size * 1.2;
        if (height >= 667 && height <= 735) return size * 1.25;
        return size * 1.4;
    }
    return size;
};

export const basename = (path) => path.replace(/.*\//, '');
export const dirname = (path) => path.match(/.*\//);
export const hostname = (url) => {
    let hostname;
    (url.indexOf('//') > -1) ? [,, hostname] = url.split('/') : [hostname] = url.split('/');
	[hostname] = hostname.split(':');
	[hostname] = hostname.split('?');
	return hostname;
}

export const uploadedFile = (file, base64 = true, formatted = false) => {
    if(base64) {
        return `data:${file.mime};base64,${file.data}`
    } else {
        if(formatted){
            return {
                uri:  file.path,
                type: file.mime,
                name: basename(file.path)
            }
        }
        return file
    }
}
/*
export const upload = (args = {}, cb = null ) => {

    if(typeof args === 'function'){
        cb = args
        args = {}
    }

    args.type = args.type || 'library' // library, camera
    args.includeBase64 = typeof args.base64 !== 'undefined' ? args.base64 : true
    args.mediaType = args.mediaType || 'photo' // photo, video, any

    if(args.mediaType === 'photo'){
        args.compressImageMaxWidth = args.maxwidth || 800
        args.compressImageQuality = args.quality || 0.6
    }

    if(args.type == 'camera'){
        args.multiple = false
    }

    const component = args.type == 'camera' ? ImagePicker.openCamera : ImagePicker.openPicker
    component(args).then(i => {
        if(args.multiple){
            const arr = []
            _.forEach( i, (image, index) => {
                arr.push(  uploadedFile(image, args.includeBase64) )
            })
            cb && cb(arr)
        } else {
            cb && cb( uploadedFile(i, args.includeBase64, false) )
        }
    }).catch(e => {
        console.log(e)
    });
}
*/
// convert arabic numbers to english
export const englishNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
export const arabicNumbers  = ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "٠"];
export const a2e = s => s.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
export const e2a = value => {
	if (!value) return;
	value=value.toString();
	for (var i = 0; i < arabicNumbers.length; i++) {
		value = value.replace(new RegExp(englishNumbers[i], "g"), arabicNumbers[i]);
	}
	return value;
}

export const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export const removeNonNumber = (string = "") => string.replace(/[^\d]/g, "");

export const removeLeadingSpaces = (string = "") => string.replace(/^\s+/g, "");

export const limitLength = (string = "", maxLength) => string.substr(0, maxLength);

export const addGaps = (string = "", gaps) => {
  	const offsets = [0].concat(gaps).concat([string.length]);

  	return offsets.map((end, index) => {
    	if (index === 0) return "";
    	const start = offsets[index - 1];
    	return string.substr(start, end - start);
  	}).filter(part => part !== "").join(" ");
}

export const formatCCNumber = (number) => {
    const numberSanitized = removeNonNumber(number);
    const lengthSanitized = limitLength(numberSanitized, 16);
    const formatted = addGaps(lengthSanitized, [4, 8, 12]);
    return formatted;
};

export const formatCCExpiry = (expiry) => {
    const sanitized = limitLength(removeNonNumber(expiry), 4);
    if (sanitized.match(/^[2-9]$/)) { 
		return `0${sanitized}`; 
	}
    if (sanitized.length > 2) { 
		return `${sanitized.substr(0, 2)}/${sanitized.substr(2, sanitized.length)}`; 
	}
    return sanitized;
};

export const formatCVV = (cvv) => limitLength(removeNonNumber(cvv), 3)
