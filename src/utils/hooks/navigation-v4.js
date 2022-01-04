import React from 'react'
import { NavigationContext } from "react-navigation";

export const useNav = () => React.useContext(NavigationContext);

export const useNavParam = (paramName, fb = null) => useNav().getParam(paramName, fb);

export const useNavState = () => useNav().state;

export const useNavKey = () => useNav().state.key;

export const useNavFocus = (callback) => {
    const navigation = useNav();
    React.useLayoutEffect(() => {
        const ev = navigation.addListener('willFocus', callback)
        return () => { ev.remove() }
    }, [navigation.state.key])
}

export const useNavBlur = (callback) => {
    const navigation = useNav();
    React.useLayoutEffect(() => {
        const ev = navigation.addListener('willBlur', callback)
        return () => { ev.remove() }
    }, [navigation.state.key])
}

export const useGetter = (value) => {
    const ref = React.useRef(value);
    React.useLayoutEffect(() => {
        ref.current = value;
    });
    return React.useCallback(() => ref.current, [ref]);
}
