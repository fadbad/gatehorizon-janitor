import * as React from "react";
import Svg, {
  Defs, LinearGradient, Stop, Path,
} from "react-native-svg";
import Animated from "react-native-reanimated";
import { COLORS } from '../app/assets/theme'

import Div from './Div'
import Text from './Text'

const AnimatedPath = Animated.createAnimatedComponent(Path);
const { PI, cos, sin } = Math;

export default ({ 
    progress,
    size = 100,
    bg = 'secondary',
    color = 'primary',
    stroke,
    text,
    textProps,
    rest,
}) => {

    const strokeWidth = stroke || size / 5

    const bgColor = COLORS[bg] || bg || '#000'
    const tintColor = COLORS[color] || color || '#fff';

    const r = (size - strokeWidth) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const A = PI + PI * 0.4;
    const startAngle = PI + PI * 0.2;
    const endAngle = 2 * PI - PI * 0.2;
    // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
    const x1 = cx - r * cos(startAngle);
    const y1 = -r * sin(startAngle) + cy;
    const x2 = cx - r * cos(endAngle);
    const y2 = -r * sin(endAngle) + cy;
    const d = `M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2}`;

    const circumference = r * A;
    const α = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [0, A],
    });
    const strokeDashoffset = Animated.multiply(α, r);
    return (
    <Div size={size} {...rest}>
        <Svg width={size} height={size}>
            <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
                    <Stop offset="0" stopColor={bgColor} />
                    <Stop offset="1" stopColor={bgColor} />
                </LinearGradient>
            </Defs>
            <Path
                stroke={tintColor}
                fill="none"
                strokeDasharray={`${circumference}, ${circumference}`}
                {...{ d, strokeWidth }}
            />
            <AnimatedPath
                stroke="url(#grad)"
                fill="none"
                strokeDasharray={`${circumference}, ${circumference}`}
                {...{ d, strokeDashoffset, strokeWidth }}
            />
        </Svg>
        <Div absoluteFill center>
            <Text {...textProps}>{text}</Text>
        </Div>
    </Div>
    );
};
