import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export default (value, stiffness = 50, damping = null, mass = null) => {
    const animatedValue = useRef(new Animated.Value(value)).current;
    useEffect(() => {
        const animation = Animated.spring(animatedValue, {
            toValue: value,
            stiffness,
            damping,
            mass,
            useNativeDriver: true,
        });
        animation.start();
        return () => animation.stop();
    }, [value]);
    return animatedValue;
}

// const animation = useSpring(active ? 1 : 0, 50);
// const labelTranslate = animation.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });
