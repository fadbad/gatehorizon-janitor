import React from 'react'
import { Div, Text, Icon, COLORS } from "../../ui"
import { uuid, darken, lighten, empty } from "../../utils"

export default ({ 
    options,
    value,
    onChange,
    btns, 
    active, 
    activecolor = COLORS.primary, 
    inactivecolor = COLORS.secondary, 
    radius = 8,
    ...rest 
}) => {
    const [index, setIndex] = React.useState(0)

    React.useEffect(() => {
        if(empty(value)) return 
        const i = options.findIndex(k => k.value === value)
        setIndex(i)
    }, [])

    return (
        <Div row {...rest}>
            {options.map( (option, i) => (
                <Div f={1} row center py={8} key={uuid()}
                    bg={ i === index ? activecolor : inactivecolor }
                    br={i === options.length - 1 ? 0 : 2}
                    rl={i === 0 ? radius : 0}
                    rr={i === options.length - 1 ? radius : 0}
                    onPress={() => {
                        onChange && onChange(option.value ?? '')
                        setIndex(i)
                    }}
                >
                    {(i === index) && (
                        <Icon name={'check'} size={16} color={'#fff'} mr={8} />
                    )}
                    <Text center color={'#fff'} size={14} bold>
                        {option.text || '---'}
                    </Text>
                </Div>
            ))}
        </Div>
    )
}
