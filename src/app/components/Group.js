import React from "react";
import { Div, Text, Icon } from '../../ui'
import { uuid, empty } from '../../utils'


const Group = ({ options, value, onChange}) => {
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
                    row center mb={8} px={12} py={8} bg={'white'} r={8} 
                    onPress={() => {
                        onChange && onChange(option.value)
                        setIndex(i)
                    }}
                    shadow={2}
                >
                    <Div 
                        size={24} r={24} b={2} center mr={8}
                        bcolor={i === index ? 'primary' : 'mutedlight'}
                    >
                        <Div size={14} r={18} bg={i === index ? 'primary' : 'mutedlight'} />
                    </Div>

                    <Div f={1}>
                        <Text size={13} lh={15}>{option.text}</Text>
                    </Div>
                    {/* <Icon name={'right'} size={18} color={'muted'} /> */}
                </Div>
            ))}
        </Div>
    )
}

export default React.memo(Group)
