import React, { Component } from "react";
import { StyleSheet, Animated, Easing } from "react-native";
import NativeLinearGradient from "react-native-linear-gradient";
import { rgb2hex } from "../utils/src/colors";

class LinearGradient extends Component {
    render() {
        const { color0, color1, children, points } = this.props;
        return (
            <NativeLinearGradient
                colors={[color0, color1].map((c) => rgb2hex(c).hex)}
                start={points.start}
                end={points.end}
                style={[styles.linearGradient]}
            >
                {children}
            </NativeLinearGradient>
        );
    }
}
Animated.LinearGradient = Animated.createAnimatedComponent(LinearGradient);
Animated.useNativeDriver = true;

export const presetColors = {
    instagram: ["#6a39ab", "#9734a0", "#c5395c", "#e7a549", "#b5465c"],
    firefox: ["#ecbf37", "#d76f33", "#b53e31", "#c0472d"],
    sunrise: ["#5ca0ba", "#6aa6ba","#8ebfba","#acd3ba","#efebba","#d4dece","#bbd8c8","#98c5be","#64adba"],
    test: ["#1F1F39", '#361f39', '#248069', "#39CAA7", "#009688"],
};

export default ({
    colors = presetColors.test,
    speed = 4000,
    points = {
        start: { x:0, y: 0.4 },
        end: {x: 1, y: 0.6 }
    },
    style,
    children
}) => {
    const color0 = React.useRef( new Animated.Value(0) ).current
    const color1 = React.useRef( new Animated.Value(0) ).current

    const __start = () => {
        [color0, color1].forEach(c => c.setValue(0));

        Animated.parallel(
            [color0, color1].map((animatedColor) => {
                return Animated.timing(animatedColor, {
                    toValue: colors.length,
                    duration: colors.length * speed,
                    easing: Easing.linear,
                    useNativeDriver: false,
                });
            })
        ).start(__start);
    }

    React.useEffect(() => { __start() }, [])

    const preferColors = [];
    // while (preferColors.length < colors.length) {
    while (preferColors.length < 2) {
        preferColors.push(
            colors
                .slice(preferColors.length)
                .concat(colors.slice(0, preferColors.length + 1))
        );
    }
    const interpolatedColors = [color0, color1].map((animatedColor, index) => {
            return animatedColor.interpolate({
                inputRange: Array.from(
                    { length: colors.length + 1 },
                    (v, k) => k
                ),
                outputRange: preferColors[index],
            });
        }
    );

    return (
        <Animated.LinearGradient
            style={[styles.linearGradient, style]}
            points={points}
            color0={interpolatedColors[0]}
            color1={interpolatedColors[1]}
        >
            {children}
        </Animated.LinearGradient>
    );
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        flexDirection: "column",
        alignItems: "stretch",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
});
