import React from 'react'
import { Animated, Platform } from 'react-native'
import _ from 'lodash'

export default (headerHeight = 120, diff = false) => {
    const scrollY = new Animated.Value(0)
    const diffClamp = Animated.diffClamp(scrollY, 0, headerHeight)
    
    // const onListScroll = _.throttle((v) => scrollY.setValue(v), 16)
    const onListScroll = (v) => scrollY.setValue(v)

    // const onListScroll = Platform.select({
    //     ios: (v) => scrollY.setValue(v),
    //     android: _.debounce((v) => scrollY.setValue(v), 4)
    // })

    const TOSCROLL = diff ? diffClamp : scrollY
    
    const animListScroll = (from, to) => TOSCROLL.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [from, to],
        extrapolate: 'clamp' 
    })

    return { onListScroll, animListScroll }
}
