import React from 'react';
import { StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';

import Div from './Div'
import Icon from './Icon'

export default ({
    color = '#6E01EF',
    size = 100,
    scale = 3,
    withReverse = false,
    number = 3,
    children,
    onPress,
}) => (
    <Div center onPress={onPress}>
        <MotiView style={{
            width: size, height: size, borderRadius: size, backgroundColor: color,
            alignItems: 'center', justifyContent: 'center'
        }}>
            {[...Array(number).keys()].map(i => (
                <MotiView
                    key={`CallWave-${i}`}
                    from={{scale: 1, opacity: .3,}}
                    animate={{scale: scale, opacity: 0}}
                    transition={{
                        loop: true,
                        repeatReverse: withReverse,
                        duration: 2000,
                        delay: i * 400,
                        type: 'timing',
                        easing: Easing.out(Easing.ease)
                    }}
                    style={[
                        StyleSheet.absoluteFillObject, 
                        { width: size, height: size, borderRadius: size, backgroundColor: color }
                    ]}
                />
            ))}

            {children}

        </MotiView>
    </Div>
)
