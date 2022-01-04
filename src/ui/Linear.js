import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

export default ({
    horizontal, from, to, colors, style,
    r, rt, rtl, rtr, rb, rbl, rbr, rl, rr,
    h, w, fw, full, top, right, bottom, left
}) => {
    const _style = {}

    _style.position = 'absolute'; 
    if(full) {
        _style.top = 0;
        _style.bottom = 0;
        _style.left = 0;
        _style.right = 0;
    }

    if(top) {
        _style.top = 0;
        _style.width = '100%'
    }
    if(bottom) {
        _style.bottom = 0;
        _style.width = '100%'
    }
    if(right) _style.right = 0;
    if(left) _style.left = 0;

    if(fw) _style.width = '100%'

    if(w) _style.width = w
    if(h) _style.height = h
    
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

    const _props = {}

    if(horizontal) {
        _props.start = {x: 0, y: 0}
        _props.end = {x: 1, y: 0}
    }

    if(colors){
        _props.colors = colors
    } else {
        _props.colors = [from, to]
    }

    return (
        <LinearGradient 
            {..._props}
            style={[_style, style]}
        />
    )
}
