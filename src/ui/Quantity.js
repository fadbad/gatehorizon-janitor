import React from 'react'
import Div from './Div'
import Text from './Text'

export default ({onChange, value = 1, min = 1, max = 999999, ...rest}) => {
    const [v, setV] = React.useState(parseInt(value || 1))

    React.useEffect(() => {
        onChange && onChange(v)
    }, [v])

    return (
        <Div row {...rest}>
            <Div row center h={30} bg={'white'} r={15} b>
                <Div center size={30} onPress={() => {
                    if(v > min) setV(v - 1)
                }}>
                    <Text center color={'red'}>-</Text>
                </Div>
                <Div center px={16}>
                    <Text center>{v}</Text>
                </Div>
                <Div center size={30} onPress={() => {
                    if(v < max) setV(v + 1)
                }}>
                    <Text center color={'red'}>+</Text>
                </Div>
            </Div>
        </Div>
    )
}
