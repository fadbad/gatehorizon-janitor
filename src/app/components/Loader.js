import React from "react";
import { Div, Text, Spinner } from '../../ui'

export default ({ color = 'secondary', size='large', text='Fetching code information...' }) => {
    return (
        <Div f={1} center>
            <Spinner color={color} size={size} />
            <Div mt={24}>
                <Text size={16} lh={20} color={color}>
                    {text}
                </Text>
            </Div>
        </Div>
    )
}
