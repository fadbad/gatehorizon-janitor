import _ from 'lodash';

export const debounce = (func, wait, immediate) => {
	let timeout;
	function _debounce(...args) {
		const context = this;
		const later = function __debounce() {
			timeout = null;
			if (!immediate) { func.apply(context, args); }
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) { func.apply(context, args); }
	}
	_debounce.stop = () => clearTimeout(timeout);
	return _debounce;
}

export const asyncDebounce = ( func, wait = 0, { leading = false, cancelObj = 'canceled' } = {} ) => {
    let timerId, latestResolve, shouldCancel
  
    return function ( ...args ) {
        if ( !latestResolve ) { // The first call since last invocation.
            return new Promise( ( resolve, reject ) => {
                latestResolve = resolve
                if ( leading ) {
                    invokeAtLeading.apply( this, [ args, resolve, reject ] );
                } else {
                    timerId = setTimeout( invokeAtTrailing.bind( this, args, resolve, reject ), wait )
                }
            })
        }
  
        shouldCancel = true
        return new Promise( ( resolve, reject ) => {
            latestResolve = resolve
            timerId = setTimeout( invokeAtTrailing.bind( this, args, resolve, reject ), wait )
        })
    }
  
    function invokeAtLeading( args, resolve, reject ) {
        func.apply( this, args ).then( resolve ).catch( reject )
        shouldCancel = false
    }
  
    function invokeAtTrailing( args, resolve, reject ) {
        if ( shouldCancel && resolve !== latestResolve ) {
            reject( cancelObj )
        } else {
            func.apply( this, args ).then( resolve ).catch( reject )
            shouldCancel = false
            clearTimeout( timerId )
            timerId = latestResolve = null
        }
    }
}

export const throttle = (fn, threshhold = 250, scope) => {
	let last;
	let deferTimer;

	const _throttle = (...args) => {
		const context = scope || this;

		const now = +new Date();

		if (last && now < last + threshhold) {
			// hold on to it
			clearTimeout(deferTimer);
			deferTimer = setTimeout(() => {
				last = now;
				fn.apply(context, args);
			}, threshhold);
		} else {
			last = now;
			fn.apply(context, args);
		}
	};

	_throttle.stop = () => clearTimeout(deferTimer);

	return _throttle;
}

export const detect_mention = _.debounce((val, cb = null, hide = null, trigger = '@') => {
    const lastChar = val.substr(val.length - 1);
    const words = val.split(' ');
    const lastWord = words[words.length - 1] || '';
    let start = true
    if (lastChar === trigger) {
        start = true
    } else if ( lastChar === " " || val === "" || !lastWord.startsWith(trigger)) {
        start = false
        hide && hide()
    }
    if(start){
        const pattern = new RegExp(`\\B${trigger}[a-z0-9_-]+|\\B${trigger}`, `gi`);
        const keywordArray = val.match(pattern);
        if (keywordArray && !!keywordArray.length) {
            const lastKeyword = keywordArray[keywordArray.length - 1];
            cb && cb(lastKeyword.replace(trigger, ''));
        }
    }
}, 10)
