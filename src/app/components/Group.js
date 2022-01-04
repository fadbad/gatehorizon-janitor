import React from "react";
import { Div, Text, Icon } from '../../ui'
import { uuid, empty } from '../../utils'


export default React.memo(({ options, value, onChange}) => {
    const [index, setIndex] = React.useState(null)

    React.useEffect(() => {
        if(empty(value)) return 
        const i = options.findIndex(k => k.value === value)
        setIndex(i)
    }, [])

    return (
        <Div>
            {options.map((option, i) => (
                <Div key={uuid()} 
                    row center mb={12} p={12} bg={'white'} r={8} 
                    onPress={() => {
                        onChange && onChange(option.value)
                        setIndex(i)
                    }}
                    shadow={2}
                >
                    <Div 
                        size={24} r={24} b={2} center mr={12}
                        bcolor={i === index ? 'primary' : 'mutedlight'}
                    >
                        <Div size={14} r={18} bg={i === index ? 'primary' : 'mutedlight'} />
                    </Div>

                    <Div f={1}>
                        <Text size={15}>{option.text}</Text>
                    </Div>
                    <Icon name={'right'} size={18} color={'muted'} />
                </Div>
            ))}
        </Div>
    )
})
