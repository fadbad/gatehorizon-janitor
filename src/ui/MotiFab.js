import React from "react";
import { MotiView, AnimatePresence } from "moti";
import Div from './Div'
import Icon from './Icon'

export default ({
    icons = [
        {name: 'bell', onPress: () => {}},
        {name: 'camera', onPress: () => {}},
        {name: 'gallery', onPress: () => {}},
    ],
    size = 64,
    spacing = 12,
}) => {

    const [active, setActive] = React.useState(false);

    return (
        <Div align={'center'}>
            <AnimatePresence>
            {!!active && (
                <MotiView
                    from={{ opacity: 0, translateY: 0, paddingBottom: 0 }}
                    animate={{ opacity: 1, translateY: 0, paddingBottom: size }}
                    exit={{ opacity: 0, translateY: spacing, paddingBottom: 0 }}
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: size / 2,
                        width: size - spacing,
                        alignItems: 'center',
                        paddingBottom: size,
                        paddingTop: spacing,
                        position: 'absolute',
                        bottom: 0,
                    }}
                >
                    {icons.map((icon, i) => (
                        <Icon key={`MotiFabIcon-${i}`} name={icon.name} onPress={() => {
                            icon?.onPress && icon?.onPress()
                            setActive(false)
                        }} size={size / 2} mb={spacing} />
                    ))}
                </MotiView>
            )}
            </AnimatePresence>
            <Div onPress={() => setActive((active) => !active)} activeOpacity={1}>
                <MotiView
                    animate={{
                        backgroundColor: !active ? '#FCD259' : '#dfdfdf',
                        rotate: active ? '-45deg' : '0deg',
                    }}
                    style={{
                        width: size,
                        height: size,
                        borderRadius: size,
                        // backgroundColor: '#FCD259',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon name='plus' size={24} color='black' />
                </MotiView>
            </Div>
        </Div>
    )
}
