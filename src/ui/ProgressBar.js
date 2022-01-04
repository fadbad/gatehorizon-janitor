import React from "react";
import { Animated, Platform, View, I18nManager } from "react-native";
import setColor from "../utils/lib/color";
import { COLORS } from '../app/assets/theme'

const INDETERMINATE_MAX_WIDTH = 0.6;
const { isRTL } = I18nManager;

export default ({
    color,
    indeterminate,
    speed = 2000,
    style,
    progress = 0,
    visible = true,
    h = 4,
    r = 4,
    ...rest
}) => {
    const { current: timer } = React.useRef(new Animated.Value(0));
    const { current: fade } = React.useRef(new Animated.Value(0));
    const [width, setWidth] = React.useState(0);
    const [prevWidth, setPrevWidth] = React.useState(0);

    const indeterminateAnimation = React.useRef(null);

    const startAnimation = React.useCallback(() => {
        // Show progress bar
        Animated.timing(fade, {
            duration: 200,
            toValue: 1,
            useNativeDriver: true,
            isInteraction: false,
        }).start();

        // Animate progress bar
        if (indeterminate) {
            if (!indeterminateAnimation.current) {
                indeterminateAnimation.current = Animated.timing(timer, {
                    duration: speed,
                    toValue: 1,
                    // Animated.loop does not work if useNativeDriver is true on web
                    useNativeDriver: Platform.OS !== "web",
                    isInteraction: false,
                });
            }

            // Reset timer to the beginning
            timer.setValue(0);

            Animated.loop(indeterminateAnimation.current).start();
        } else {
            Animated.timing(timer, {
                duration: 200,
                toValue: progress ? progress : 0,
                useNativeDriver: true,
                isInteraction: false,
            }).start();
        }
    }, [timer, progress, indeterminate, fade]);

    const stopAnimation = React.useCallback(() => {
        // Stop indeterminate animation
        if (indeterminateAnimation.current) {
            indeterminateAnimation.current.stop();
        }

        Animated.timing(fade, {
            duration: 200,
            toValue: 0,
            useNativeDriver: true,
            isInteraction: false,
        }).start();
    }, [fade]);

    React.useEffect(() => {
        if (visible) startAnimation();
        else stopAnimation();
    }, [visible, startAnimation, stopAnimation]);

    React.useEffect(() => {
        // Start animation the very first time when previously the width was unclear
        if (visible && prevWidth === 0) {
            startAnimation();
        }
    }, [prevWidth, startAnimation, visible]);

    const onLayout = (event) => {
        setPrevWidth(width);
        setWidth(event.nativeEvent.layout.width);
    };

    const tintColor = COLORS[color] || color || '#000';
    const trackTintColor = setColor(tintColor).alpha(0.48).rgb().string();

    return (
        <View
            onLayout={onLayout}
            {...rest}
            accessible
            accessibilityRole="progressbar"
            accessibilityState={{ busy: visible }}
            accessibilityValue={
                indeterminate ? {} : { min: 0, max: 100, now: progress * 100 }
            }
        >
            <Animated.View
                style={[
                    { height: h, borderRadius: r, overflow: "hidden" },
                    { backgroundColor: trackTintColor, opacity: fade },
                    style,
                ]}
            >
                {width ? (
                    <Animated.View
                        style={[
                            { flex: 1, borderRadius: r },
                            {
                                width,
                                backgroundColor: tintColor,
                                transform: [
                                    {
                                        translateX: timer.interpolate(
                                            indeterminate
                                                ? {
                                                      inputRange: [0, 0.5, 1],
                                                      outputRange: [
                                                          (isRTL ? 1 : -1) *
                                                              0.5 *
                                                              width,
                                                          (isRTL ? 1 : -1) *
                                                              0.5 *
                                                              INDETERMINATE_MAX_WIDTH *
                                                              width,
                                                          (isRTL ? -1 : 1) *
                                                              0.7 *
                                                              width,
                                                      ],
                                                  }
                                                : {
                                                      inputRange: [0, 1],
                                                      outputRange: [
                                                          (isRTL ? 1 : -1) *
                                                              0.5 *
                                                              width,
                                                          0,
                                                      ],
                                                  }
                                        ),
                                    },
                                    {
                                        // Workaround for workaround for https://github.com/facebook/react-native/issues/6278
                                        scaleX: timer.interpolate(
                                            indeterminate
                                                ? {
                                                      inputRange: [0, 0.5, 1],
                                                      outputRange: [
                                                          0.0001,
                                                          INDETERMINATE_MAX_WIDTH,
                                                          0.0001,
                                                      ],
                                                  }
                                                : {
                                                      inputRange: [0, 1],
                                                      outputRange: [0.0001, 1],
                                                  }
                                        ),
                                    },
                                ],
                            },
                        ]}
                    />
                ) : null}
            </Animated.View>
        </View>
    );
};
