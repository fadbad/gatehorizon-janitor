import React from 'react';
import { COLORS } from '../app/assets'
import Div, { AnimatedDiv } from './Div'
import { darken, lighten, useAnimation, width, hairline } from '../utils'

export default ({ color, h }) => {
    h = h || 2
    const clr = color || COLORS.blue
    const [doAnimation, setDoAnimation] = React.useState(true)

    const animation = useAnimation({
        doAnimation, 
        duration: 750,
        callback: () => setDoAnimation(!doAnimation)
    })

    const AW = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width],
        extrapolate: "clamp"
    })

    return (
        <Div center bg={clr} style={{ width: '100%', height: h }}>
            <AnimatedDiv style={{ 
				height: h, 
				width: AW,
				backgroundColor: lighten(clr, 0.45),
				// borderRadius: 15
			}} />
        </Div>
    )
}
