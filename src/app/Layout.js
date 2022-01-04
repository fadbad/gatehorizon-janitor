import React from 'react'
import Animated from "react-native-reanimated";

export default ({ drawerAnimationStyle, children })  => (
    <Animated.View style={{
        flex: 1,
        overflow: 'hidden',
        ...drawerAnimationStyle
    }}>
        {children}
    </Animated.View>
)
