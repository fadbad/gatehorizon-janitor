import React from 'react';
import { StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';

import Div from './Div'
import Icon from './Icon'

export default ({
    color = '#6E01EF',
    size = 100,
    icon,
    iconSize = 32,
    iconColor = '#fff',
    scale = 3,
    withReverse = false,
    number = 3,
}) => (
    <Div center>
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
            <Icon name={icon || 'bell'} size={iconSize} color={iconColor} />
        </MotiView>
    </Div>
)
