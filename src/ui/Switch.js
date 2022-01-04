import React from 'react';
import { Pressable, View } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { COLORS } from "../app/assets/theme";

export default ({ 
    size = 30, 
    activeColor = '#39CAA7',
    inactiveColor = '#e51c23',
    value = false, 
    onChange 
}) => {
    activeColor = COLORS[activeColor] || activeColor
    inactiveColor = COLORS[inactiveColor] || inactiveColor

    const SIZE = size;
    const TRACK_SIZE = size * 1.5;
    const TRACK_HEIGHT = size * 0.4;
    const transition = {
        type: 'timing',
        duration: 300,
        easing: Easing.inOut(Easing.ease),
    };

    const [isActive, setIsActive] = React.useState(value);

    React.useEffect(() => {
        setIsActive(value)
    }, [value])

    return (
        <Pressable onPress={() => {
            onChange && onChange(!isActive)
            setIsActive((isActive) => !isActive)
        }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <MotiView
                    from={{ backgroundColor: isActive ? activeColor : inactiveColor }}
                    animate={{ backgroundColor: isActive ? activeColor : inactiveColor }}
                    transition={transition}
                    style={{
                        position: 'absolute',
                        width: TRACK_SIZE,
                        height: TRACK_HEIGHT,
                        borderRadius: TRACK_HEIGHT,
                        backgroundColor: isActive ? activeColor : inactiveColor
                    }}
                />
                <MotiView
                    transition={transition}
                    from={{
                        translateX: isActive ? TRACK_SIZE / 4 : -TRACK_SIZE / 4,
                    }}
                    animate={{
                        translateX: isActive ? TRACK_SIZE / 4 : -TRACK_SIZE / 4,
                    }}
                    style={{
                        width: SIZE,
                        height: SIZE,
                        borderRadius: SIZE,
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',

                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.20,
                        shadowRadius: 1.41,
                        elevation: 2,
                    }}
                >
                    <MotiView
                        transition={transition}
                        from={{
                            width: isActive ? 0 : SIZE * 0.6,
                            borderColor: isActive ? activeColor : inactiveColor,
                        }}
                        animate={{
                            width: isActive ? 0 : SIZE * 0.6,
                            borderColor: isActive ? activeColor : inactiveColor,
                        }}
                        style={{
                            width: SIZE * 0.6,
                            height: SIZE * 0.6,
                            borderRadius: SIZE * 0.6,
                            borderWidth: SIZE * 0.1,
                            borderColor: isActive ? activeColor : inactiveColor,
                        }}
                    />
                </MotiView>
            </View>
        </Pressable>
    );
};
