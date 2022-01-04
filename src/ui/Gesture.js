import React from 'react'
import PropTypes from 'prop-types'
import { FlingGestureHandler, Directions, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { DivComponent } from './Div'

const AnimatedDiv = Animated.createAnimatedComponent(DivComponent)

const Gesture = ({
    callback, children, up, down, left, right, ...rest
}) => {
    let d = 0;

    if(!(up || down || left || right)) {
        d = Directions.UP | Directions.DOWN | Directions.LEFT | Directions.RIGHT
    } else {
        if(up) d += Directions.UP
        if(down) d += Directions.DOWN
        if(left) d += Directions.LEFT
        if(right) d += Directions.RIGHT
    }

    return (
        <FlingGestureHandler
            direction={d}
            onHandlerStateChange={({ nativeEvent }) => {
                if (nativeEvent.state === State.END) {
                    callback && callback()
                }
            }}
        >
            <AnimatedDiv pointerEvents={'box-none'} {...rest}>
                { children }
            </AnimatedDiv>
        </FlingGestureHandler>
    )
}

Gesture.propTypes = {
    callback: PropTypes.func.isRequired,
}

Gesture.defaultProps = {
    callback: () => {},
}

export default Gesture
