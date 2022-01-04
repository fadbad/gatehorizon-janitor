import React from "react";
import { Div, Text, Icon, COLORS, TextField, Sheet } from '../../ui'
import { empty, useTranslation, fade, Vars } from "../../utils";

export default React.memo(({
    label, title, onChange, value, dateValue, error, password, type, forwardedRef,
    left, right, color, 
    select, options = [],
    ...rest
}) => {
    const { t } = useTranslation()
    const _props = {}
    if(password) _props.secureTextEntry = true
    if(type === 'number') _props.keyboardType = 'number-pad'
    if(type === 'numeric') _props.keyboardType = 'numeric'
    if(type === 'decimal') _props.keyboardType = 'decimal'
    if(type === 'email') {
        _props.keyboardType = 'email-address'
        _props.autoCorrect = false;
        _props.autoCapitalize = 'none'
    }
    if(type === 'phone') _props.keyboardType = 'phone-pad'

    const [selectOpen, setSelectOpen] = React.useState(false)

    const getSelectValue = (v) => {
        if(empty(options)) return ''
        const i = options.findIndex(x => x.value === v)
        return i > -1 ? i.text : ''
    }

    const DEFAULTREF = React.useRef()
    const REF = forwardedRef || DEFAULTREF

    return (
        <Div>
            <TextField 
                ref={REF}
                tintColor={color || COLORS.secondary}
                textColor={color || COLORS.black}
                baseColor={fade(color || COLORS.black, 0.38)}

                label={label}
                title={title}
                onChangeText={v => onChange && onChange(v)}
                value={select ? getSelectValue(value) : value}
                error={error}
                errorColor={COLORS.red}
                renderLeftAccessory={left}
                renderRightAccessory={select ? () => (
                    <Icon name={'down'} size={16} color={'muted'} />
                ) : right}
                {..._props}
                {...rest}
            />
            {select && (
                <>
                    <Div absoluteFill onPress={() => setSelectOpen(true)} />
                    <Sheet
                        show={selectOpen}
                        hide={() => setSelectOpen(false)}
                        radius={24}
                    >
                        {options.map((option, index) => (
                            <Div row center bb px={24} py={12} key={`seleectOpt-${index}`}
                                onPress={() => {
                                    onChange && onChange(option)
                                    REF.current?.setValue(option.text)
                                    setSelectOpen(false)
                                }}
                            >
                                <Div f={1}>
                                    <Text size={16}>{option.text}</Text>
                                </Div>
                                <Icon name={'right'} size={16} color={'muted'} /> 
                            </Div>
                        ))}
                    </Sheet>
                </>
            )}
        </Div>
    )
})
