import React from "react";
import { Switch, Platform } from "react-native";
import Div from "./Div";
import Text from './Text'
import { COLORS } from "../app/assets";
import { isRTL } from "../utils";

export default ({
    value, onChange, activeColor = 'primary', inActiveColor = 'muted',
    activeText = 'On', inActiveText = 'Off', withText, textSize=12, textColor='muted'
}) => {

    return withText ? (
        <Div row center>
            <Text size={textSize} color={textColor}>
                {isRTL ? activeText : inActiveText}
            </Text>
            <Div mx={6}>
                <Switch 
                    value={value}
                    onValueChange={v => onChange && onChange(v)}
                    thumbColor={Platform.OS === 'ios' ? null : 'white'}
                    trackColor={{
                        false: COLORS[inActiveColor] || inActiveColor,
                        true: COLORS[activeColor] || activeColor
                    }}
                />
            </Div>
            <Text size={textSize} color={textColor}>
                {isRTL ? inActiveText : activeText}
            </Text>
        </Div>
    ) : (
        <Switch 
            value={value}
            onValueChange={v => onChange && onChange(v)}
            thumbColor={Platform.OS === 'ios' ? null : 'white'}
            trackColor={{
                false: COLORS[inActiveColor] || inActiveColor,
                true: COLORS[activeColor] || activeColor
            }}
        />
    )
}
