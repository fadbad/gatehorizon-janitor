import React from 'react'
import { TextInput, Platform } from "react-native";
import { isRTL, lightenDarken, a2e } from "../utils";

export default ({
    password, number, numeric, decimal, email, phone,
    forwardedRef, color, placeholderColor, size, value, onChange, style, ...rest
}) => {
    const defaultColor = '#1E1F20'
    const _props = {}
    if(password) _props.secureTextEntry = true
    if(number) _props.keyboardType = 'number-pad'
    if(numeric) _props.keyboardType = 'numeric'
    if(decimal) _props.keyboardType = 'decimal'
    if(email) _props.keyboardType = 'email-address'
    if(phone) _props.keyboardType = 'phone-pad'

    const placeholderTextColor = placeholderColor || lightenDarken(color || defaultColor, 75)
	const isNumeric = number || numeric || phone || decimal
    return (
        <TextInput 
            ref={forwardedRef}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={placeholderTextColor}
            onChangeText={onChange}
            value={value}
            {...rest}
            {..._props}
            style={[{
                color: color || defaultColor,
                fontSize: size || 15,
                flex: 1,
                minHeight: 30,
                padding: 0,
                textAlign: isRTL ? 'right' : 'left',
				writingDirection: (isRTL && !isNumeric) ? 'rtl' : 'ltr',
            }, style]}
        />
    )
}
