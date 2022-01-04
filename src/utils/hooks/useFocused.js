import { useState, useCallback } from 'react'
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

export default () => {
    
    const [focused, setFocused] = useState(false)

    useFocusEffect(
        useCallback(() => {
            setFocused(true)
            return () => setTimeout(() => setFocused(false), 350)
        }, [])
    );

    return focused
}
