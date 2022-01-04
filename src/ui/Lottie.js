import React from 'react';
import LottieView from 'lottie-react-native';
import Anims from '../app/assets/Animations'

const ifDefined = (a, def = '') => typeof a !== 'undefined' ? a : def

export default ({w, h, src, style, autoSize, autoPlay, loop, forwardedRef, ...rest}) => {
 
    const _style = {}
    if(w) _style.width = w;
    if(h) _style.height = h;

    return (
        <LottieView 
            ref={forwardedRef}
            source={Anims[src]}
            autoSize={ifDefined(autoSize, true)}
            loop={ifDefined(loop, true)}
            autoPlay={ifDefined(autoPlay, true)}
            {...rest}
            style={[_style, style]} 
        />
    )
}
