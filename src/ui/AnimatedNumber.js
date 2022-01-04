import React from 'react';
import { MotiText, AnimatePresence } from 'moti';
import Div from './Div'
import { COLORS } from "../app/assets/theme";
import { Text } from 'react-native';

export default ({ 
    number = '00', 
    color = '#fff',
    prepend = '',
    append = '',
    rest,
}) => {

    const textStyle = {
        fontWeight: '800',
        fontSize: 20,
        color: COLORS[color] || color
    }

    return (
            <Div row justify={'center'} {...rest}>
                <Text style={textStyle}>{prepend}</Text>
                {number.split('').map((t, i) => {
                    return (
                        <Div key={i} h={20} w={14} justify={'center'} overflow={'hidden'}>
                            <AnimatePresence>
                                <MotiText
                                    from={{ translateY: 20 }}
                                    animate={{ translateY: 0 }}
                                    exit={{ translateY: -20 }}
                                    transition={{
                                        duration: 500,
                                        type: 'timing',
                                        delay: 800 + i * 50,
                                    }}
                                    key={`percentage-${t}-${i}`}
                                    // transition={{duration: 350, type: 'timing'}}
                                    style={{
                                        position: 'absolute',
                                        ...textStyle
                                    }}
                                >
                                    {t}
                                </MotiText>
                            </AnimatePresence>
                        </Div>
                    );
                })}
                <Text style={textStyle}>{append}</Text>
            </Div>
    );
};
