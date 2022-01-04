import React from 'react'
import { Animated } from 'react-native'

const useAnimation = ({ doAnimation, duration, useNativeDriver, callback }) => {
    const [animation, setAnimation] = React.useState(new Animated.Value(0));
    
    React.useEffect(() => {
        Animated.timing(animation, {
            toValue: doAnimation ? 1 : 0,
            duration,
            useNativeDriver: useNativeDriver || false,
        }).start( () => callback && callback() );
    }, [doAnimation]);
  
    return animation;
}

useAnimation.defaultProps = {
    duration: 900,
    useNativeDriver: false,
    callback: () => {}
}

export default useAnimation
