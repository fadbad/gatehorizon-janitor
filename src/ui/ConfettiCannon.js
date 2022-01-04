// https://github.com/VincentCATILLON/react-native-confetti-cannon

import * as React from "react";
import { Animated, Dimensions, Easing } from "react-native";
import PropTypes from "prop-types";

const randomValue = (min, max) => Math.random() * (max - min) + min;
const randomColor = (colors) =>
    colors[Math.round(randomValue(0, colors.length - 1))];

const TOP_MIN = 0.7;
const DEFAULT_COLORS = [
    "#e67e22",
    "#2ecc71",
    "#3498db",
    "#84AAC2",
    "#E6D68D",
    "#F67933",
    "#42A858",
    "#4F50A2",
    "#A86BB7",
    "#e74c3c",
    "#1abc9c",
];

class Confetti extends React.PureComponent {
    constructor(props) {
        super(props);
        this.width = randomValue(8, 16);
        this.height = randomValue(6, 12);
        this.isRounded = Math.round(randomValue(0, 1)) === 1;
    }

    render() {
        const { containerTransform, transform, opacity, color } = this.props;
        const { width, height, isRounded } = this;
        const containerStyle = { transform: containerTransform };
        const style = {
            width,
            height,
            backgroundColor: color,
            transform,
            opacity,
        };

        return (
            <Animated.View
                style={[
                    { position: "absolute", left: 0, bottom: 0 },
                    containerStyle,
                ]}
            >
                <Animated.View
                    style={[isRounded && { borderRadius: 100 }, style]}
                />
            </Animated.View>
        );
    }
}

class ConfettiCannon extends React.PureComponent {
    constructor(props) {
        super(props);

        const { colors = DEFAULT_COLORS } = props;

        this.start = this.start.bind(this);
        this.resume = this.resume.bind(this);
        this.stop = this.stop.bind(this);

        this.sequence = null;
        this.items = [];
        this.animation = new Animated.Value(0);

        this.state = {
            items: [],
        };
        this.state.items = this.getItems(colors);
    }

    componentDidMount = () => {
        const { autoStart, autoStartDelay } = this.props;

        if (autoStart) {
            setTimeout(this.start, autoStartDelay);
        }
    };

    componentDidUpdate = ({
        count: prevCount,
        colors: prevColors = DEFAULT_COLORS,
    }) => {
        const { count, colors = DEFAULT_COLORS } = this.props;

        if (count !== prevCount || colors !== prevColors) {
            this.setState({
                items: this.getItems(prevColors),
            });
        }
    };

    getItems = (prevColors) => {
        const { count, colors = DEFAULT_COLORS } = this.props;
        const { items } = this.state;

        const difference = items.length < count ? count - items.length : 0;

        const newItems = Array(difference)
            .fill()
            .map(() => ({
                leftDelta: randomValue(0, 1),
                topDelta: randomValue(TOP_MIN, 1),
                swingDelta: randomValue(0.2, 1),
                speedDelta: {
                    rotateX: randomValue(0.3, 1),
                    rotateY: randomValue(0.3, 1),
                    rotateZ: randomValue(0.3, 1),
                },
                color: randomColor(colors),
            }));

        return items
            .slice(0, count)
            .concat(newItems)
            .map((item) => ({
                ...item,
                color: prevColors !== colors ? randomColor(colors) : item.color,
            }));
    };

    start = (resume) => {
        const {
            explosionSpeed,
            fallSpeed,
            onAnimationStart,
            onAnimationResume,
            onAnimationEnd,
        } = this.props;

        if (resume) {
            onAnimationResume && onAnimationResume();
        } else {
            this.sequence = Animated.sequence([
                Animated.timing(this.animation, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
                Animated.timing(this.animation, {
                    toValue: 1,
                    duration: explosionSpeed,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(this.animation, {
                    toValue: 2,
                    duration: fallSpeed,
                    easing: Easing.quad,
                    useNativeDriver: true,
                }),
            ]);

            onAnimationStart && onAnimationStart();
        }

        this.sequence && this.sequence.start(({ finished }) => {
			if (finished) {
				onAnimationEnd && onAnimationEnd();
			}
		});
    };

    resume = () => this.start(true);

    stop = () => {
        const { onAnimationStop } = this.props;
        onAnimationStop && onAnimationStop();
        this.sequence && this.sequence.stop();
    };

    render() {
        const { origin, fadeOut } = this.props;
        const { items } = this.state;
        const { height, width } = Dimensions.get("window");

        return (
            <React.Fragment>
                {items.map((item, index) => {
                    const left = this.animation.interpolate({
                        inputRange: [0, 1, 2],
                        outputRange: [
                            origin.x,
                            item.leftDelta * width,
                            item.leftDelta * width,
                        ],
                    });
                    const top = this.animation.interpolate({
                        inputRange: [0, 1, 1 + item.topDelta, 2],
                        outputRange: [-origin.y, -item.topDelta * height, 0, 0],
                    });
                    const rotateX = this.animation.interpolate({
                        inputRange: [0, 2],
                        outputRange: [
                            "0deg",
                            `${item.speedDelta.rotateX * 360 * 10}deg`,
                        ],
                    });
                    const rotateY = this.animation.interpolate({
                        inputRange: [0, 2],
                        outputRange: [
                            "0deg",
                            `${item.speedDelta.rotateY * 360 * 5}deg`,
                        ],
                    });
                    const rotateZ = this.animation.interpolate({
                        inputRange: [0, 2],
                        outputRange: [
                            "0deg",
                            `${item.speedDelta.rotateZ * 360 * 2}deg`,
                        ],
                    });
                    const translateX = this.animation.interpolate({
                        inputRange: [0, 0.4, 1.2, 2],
                        outputRange: [
                            0,
                            -(item.swingDelta * 30),
                            item.swingDelta * 30,
                            0,
                        ],
                    });
                    const opacity = this.animation.interpolate({
                        inputRange: [0, 1, 1.8, 2],
                        outputRange: [1, 1, 1, fadeOut ? 0 : 1],
                    });
                    const containerTransform = [
                        { translateX: left },
                        { translateY: top },
                    ];
                    const transform = [
                        { rotateX },
                        { rotateY },
                        { rotate: rotateZ },
                        { translateX },
                    ];

                    return (
                        <Confetti
                            color={item.color}
                            containerTransform={containerTransform}
                            transform={transform}
                            opacity={opacity}
                            key={index}
                        />
                    );
                })}
            </React.Fragment>
        );
    }
}

ConfettiCannon.propTypes = {
    count: PropTypes.number,
    origin: PropTypes.any,
    explosionSpeed: PropTypes.number,
    fallSpeed: PropTypes.number,
    colors: PropTypes.array,
    fadeOut: PropTypes.bool,
    autoStart: PropTypes.bool,
    autoStartDelay: PropTypes.number,
    onAnimationStart: PropTypes.func,
    onAnimationResume: PropTypes.func,
    onAnimationStop: PropTypes.func,
    onAnimationEnd: PropTypes.func,
};

ConfettiCannon.defaultProps = {
    count: 200,
    origin: { x: -10, y: -10 },
    explosionSpeed: 350,
    fallSpeed: 3000,
    colors: DEFAULT_COLORS,
    fadeOut: true,
    autoStart: false,
    autoStartDelay: 0,
    onAnimationStart: () => {},
    onAnimationResume: () => {},
    onAnimationStop: () => {},
    onAnimationEnd: () => {},
};

export default ConfettiCannon;
