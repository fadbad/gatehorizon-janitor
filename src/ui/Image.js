import React, { useState, useEffect, useRef } from 'react'
import { Image as RNImage, Dimensions, StyleSheet, Animated } from 'react-native'
import Animatable from './Animatable'
import FastImage from "react-native-fast-image";
import IMAGES from '../app/assets/images'
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window')

const Image = ({
    src, w, fw, h, fh, size, style, color, cover, contain, fullscreen,
    r, rt, rtl, rtr, rb, rbl, rbr, rl, rr, 
    onSize,
    ...rest
}) => {
    
    if(!src) return null;
    let width = w || size || null
    let height = h || size || null
    const isRemote = typeof src !== 'number'

	const isLocal = isRemote && !(src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:'))

	let resizeMode = 'cover'
	if(contain) resizeMode = 'contain'

	src = isLocal ? IMAGES[src] : src

    if(fullscreen){
        width = SCREEN_WIDTH
        height = SCREEN_HEIGHT
    }

    if(fw) w = width = SCREEN_WIDTH
    if(fh) h = height = SCREEN_HEIGHT

    const [scalableWidth, setScalableWidth] = useState(width);
    const [scalableHeight, setScalableHeight] = useState(height);
    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        }
    }, []);

    useEffect(() => {
        onProps(src);
    });

    const onProps = src => {
        if(typeof src !== 'number'){
            RNImage.getSize(
                src,
                (width, height) => adjustSize(width, height),
                console.err
            );
        }
        else {
            const sourceToUse = RNImage.resolveAssetSource(src);
            adjustSize(sourceToUse.width, sourceToUse.height);
        }
    };

    const adjustSize = (sourceWidth, sourceHeight) => {

        let ratio = 1;

        if (width && height) {
            // ratio = Math.min(width / sourceWidth, height / sourceHeight);
            setScalableWidth(width);
            setScalableHeight(height);
            return; // bail if both dimensions are set
        }
        else if (width) {
            ratio = width / sourceWidth;
        }
        else if (height) {
            ratio = height / sourceHeight;
        }

        if (mounted.current) {
            const computedWidth = sourceWidth * ratio;
            const computedHeight = sourceHeight * ratio;

            setScalableWidth(computedWidth);
            setScalableHeight(computedHeight);

            onSize && onSize({ width: computedWidth, height: computedHeight });
        }
    };

    const _style = {}
    if(color) _style.tintColor = color

    // RADIUS
    if(r) _style.borderRadius = r
    if(rtl) _style.borderTopLeftRadius = rtl
    if(rtr) _style.borderTopRightRadius = rtr
    if(rbl) _style.borderBottomLeftRadius = rbl
    if(rbr) _style.borderBottomRightRadius = rbr
    if(rt){
        _style.borderTopLeftRadius = rt
        _style.borderTopRightRadius = rt
    }
    if(rb){
        _style.borderBottomLeftRadius = rb
        _style.borderBottomRightRadius = rb
    }
    if(rl){
        _style.borderTopLeftRadius = rl
        _style.borderBottomLeftRadius = rl
    }
    if(rr){
        _style.borderTopRightRadius = rr
        _style.borderBottomRightRadius = rr
    }

    const STYLE = StyleSheet.flatten({
        ..._style, ...style
    })

    const [loaded, setLoaded] = React.useState(false)

    return (isRemote && !isLocal) ? (
        <FastImage 
            source={{uri: src}}
            resizeMode={resizeMode}
            style={[STYLE, {width: scalableWidth, height: scalableHeight}]}
            {...rest}
        />
    ) : (
        <RNImage 
            source={src}
            resizeMode={resizeMode}
            style={[STYLE, {width: scalableWidth, height: scalableHeight}]}
            {...rest}
        />
    )
}

Image.displayName = 'Image'

export class ImageComponent extends React.Component {
    constructor(props) { super(props) }
    render() { return <Image {...this.props} /> }
}

export const AnimatedImage = Animated.createAnimatedComponent(ImageComponent)
export const AnimatableImage = Animatable.createAnimatableComponent(ImageComponent)

export default React.memo(Image);
