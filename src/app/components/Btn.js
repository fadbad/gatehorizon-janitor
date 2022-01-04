import React from "react";
import { Div, Text, Spinner } from '../../ui'

export default React.memo(({ 
    bg = 'primary', color='white',
    text, onPress, loading, disabled, ...rest 
}) => (
    <Div 
        center bg={bg} r={8} py={12} 
        my={24}
        onPress={onPress} {...rest}
        disabled={disabled || loading}
        o={disabled ? 0.5 : 1}
    >
        {loading ? (
            <Spinner color={color} />
        ) : (
            <Text color={color} size={18} bold>{text}</Text>
        )}
    </Div>
))
