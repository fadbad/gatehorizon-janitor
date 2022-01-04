import React from 'react'
import Div from './Div'

export default ({checked, onPress, type = 'checkbox', color = 'red'}) => {
    const [isChecked, setIsChecked] = React.useState(checked)

    React.useEffect(() => {
        setIsChecked(checked)
    }, [checked])

    return (
        <Div size={20} r={type === 'radio' ? 10 : 0} b={2} bcolor={color} center
            onPress={onPress}
        >
            {(isChecked) && (
                <Div size={10} r={type === 'radio' ? 5 : 0} bg={color} />
            )}
        </Div>
    )
}
