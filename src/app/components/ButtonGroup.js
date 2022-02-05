import React from 'react'
import { Div, Text, Icon, COLORS } from "../../ui"
import { uuid, darken, lighten, empty } from "../../utils"

export default ({ 
    options,
    value,
    onChange,
    btns, 
    active, 
    activeColor = COLORS.white, 
    inactiveColor = COLORS.mutedlight, 
    activeTextColor = '#000',
    inactiveTextColor = '#000',
    radius = 4,
    ...rest 
}) => {
    const [index, setIndex] = React.useState(0)

    React.useEffect(() => {
        // if(empty(value)) return 
        const i = options.findIndex(k => k.value === value)
        setIndex(i)
    }, [value])

    return (
        <Div row {...rest}>
            {options.map( (option, i) => (
                <Div f={1} row center py={4} key={uuid()}
                    bg={ i === index ? activeColor : inactiveColor }
                    br={i === options.length - 1 ? 0 : true}
                    rl={i === 0 ? radius : 0}
                    rr={i === options.length - 1 ? radius : 0}
                    onPress={() => {
                        onChange && onChange(option.value ?? '')
                        setIndex(i)
                    }}
                >
                    
                    <Text center color={i === index ? activeTextColor : inactiveTextColor} size={12}>
                        {option.text || '---'}
                    </Text>

                    {!empty(option?.badge) && (
                        <Div 
                            size={16} r={32} center bg={'red'}
                            absolute right={4} top={-8}
                        >
                            <Text color={'white'} size={9} lh={9} bold>
                                {option.badge}
                            </Text>
                        </Div>
                    )}
                </Div>
            ))}
        </Div>
    )
}
