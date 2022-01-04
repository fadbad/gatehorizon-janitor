import React from "react";
import { Animated, StyleSheet } from "react-native";
import { getContrastingColor } from "../utils/src/colors";

const defaultSize = 20;
const defaultBG = "#f50057";
const white = "#fff";
const black = "#000";

export default ({
    value,
    size = defaultSize,
    style,
    visible = true,
    ...rest
}) => {
    const { current: opacity } = React.useRef(
        new Animated.Value(visible ? 1 : 0)
    );
    const isFirstRendering = React.useRef(true);

    React.useEffect(() => {
        // Do not run animation on very first rendering
        if (isFirstRendering.current) {
            isFirstRendering.current = false;
            return;
        }

        Animated.timing(opacity, {
            toValue: visible ? 1 : 0,
            duration: 150,
            useNativeDriver: true,
        }).start();
    }, [visible, opacity]);

    const { backgroundColor = defaultBG, ...restStyle } =
        StyleSheet.flatten(style) || {};

    const textColor = getContrastingColor(backgroundColor, white, black);

    const borderRadius = size / 2;

    return (
        <Animated.Text
            numberOfLines={1}
            style={[
                {
                    opacity,
                    backgroundColor,
                    color: textColor,
                    fontSize: size * 0.5,
                    lineHeight: size,
                    height: size,
                    minWidth: size,
                    borderRadius,
                },
                {
                    alignSelf: "flex-end",
                    textAlign: "center",
                    textAlignVertical: "center",
                    paddingHorizontal: 4,
                    overflow: "hidden",
                },
                restStyle,
            ]}
            {...rest}
        >
            {value}
        </Animated.Text>
    );
};
