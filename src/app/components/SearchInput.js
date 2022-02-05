import React from "react";
import { TextInput } from "react-native";
import { Div, Text, Icon, COLORS, Spinner } from '../../ui'
import { empty, fade, useTranslation, isRTL } from "../../utils";

export default React.memo(({
    onChange, forwardedRef, color = 'secondary', style, type, loading,
    ...rest
}) => {
    const { t } = useTranslation()
    const [value, setValue] = React.useState('')
    const __color = COLORS[color] || color
    const plColor = fade(__color, 0.64)

    const _props = {}
    if(type === 'password') _props.secureTextEntry = true
    if(type === 'number') _props.keyboardType = 'number-pad'
    if(type === 'numeric') _props.keyboardType = 'numeric'
    if(type === 'decimal') _props.keyboardType = 'decimal'
    if(type === 'email') {
        _props.keyboardType = 'email-address'
        _props.autoCorrect = false;
        _props.autoCapitalize = 'none'
    }
    if(type === 'phone') _props.keyboardType = 'phone-pad'
    
    return (
        <Div row center>
            {loading ? <Spinner color={color} size={16} /> : <Icon name={'search'} color={color} size={16} />}
            <Div f={1} ml={8}>
                <TextInput 
                    ref={forwardedRef}
                    autoCapitalize="none"
                    autoCorrect={false}
                    underlineColorAndroid="transparent"
                    placeholder={t('SEARCH')}
                    placeholderTextColor={plColor}
                    onChangeText={v => {
                        setValue(v)
                        onChange && onChange(v)
                    }}
                    value={value}
                    style={[{
                        height: 50,
                        color: __color,
                        fontSize: 18,
                        textAlign: isRTL ? 'right' : 'left',
                        writingDirection: (isRTL) ? 'rtl' : 'ltr',
                    }, style]}
                    {..._props}
                    {...rest}
                />
            </Div>
            {value.length > 0 && (
                <Icon name={'close-circle'} size={16} ml={8} color={color} onPress={() => {
                    setValue('')
                    onChange && onChange('')
                }} />
            )}
            
        </Div>
    )
})
