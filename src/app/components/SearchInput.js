import React from "react";
import { TextInput } from "react-native";
import { Div, Text, Icon, COLORS } from '../../ui'
import { empty, fade, useTranslation, isRTL } from "../../utils";

export default React.memo(({
    onChange, forwardedRef, color = 'secondary', style,
    ...rest
}) => {
    const { t } = useTranslation()
    const [value, setValue] = React.useState('')
    const __color = COLORS[color] || color
    const plColor = fade(__color, 0.64)
    return (
        <Div row center>
            <Icon name={'search'} color={color} size={16} mr={8} />
            <Div f={1}>
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
