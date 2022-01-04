import React, { Component } from "react";
import { Animated } from "react-native";

import { statusBarHeight, getBottomSpace, width, height } from '../utils'
import Gesture from './Gesture'
import Div from './Div'
import Text from './Text'

class Toast extends Component {
    state = {
        isVisible: false,
        text: "",
        ANIM: new Animated.Value(0.0),
        position: "top",
        bg: '#111',
        color: '#fff',
        onPress: null,
    };

    componentWillUnmount() {
        this._resetTimer();
    }

    show = (text, duration = 5000, position = "top", bg = '#111', color = '#fff', onPress = null) => {
        this.setState({
            isVisible: true,
            text,
            position,
            bg,
            color,
            onPress,
        });

        Animated.timing(this.state.ANIM, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true
        }).start(() => {
            duration && this.close(duration);
        });
    };

    close = (delay = 3000) => {
        if (!this.state.isVisible) {
            return;
        }

        this._resetTimer();

        this.timer = setTimeout(() => {
            Animated.timing(this.state.ANIM, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true
            }).start(() => {
                this.setState({ isVisible: false });
            });
        }, delay);
    };

    animate = (output) => {
        return this.state.ANIM.interpolate({
            inputRange: [0, 1],
            outputRange: output
        })
    }

    _resetTimer = () => {
        this.timer && clearTimeout(this.timer);
    };

    _getTop = () => {
        const offset  = 20;
        const { position } = this.state;

        if (position === "top") {
            return offset + statusBarHeight;
        }

        if (position === "center") {
            return height / 2;
        }

        return height - (offset + getBottomSpace);
    };

    render() {
        const { isVisible, text, bg, color, onPress } = this.state;
        const {
            style,
            textStyle,
            children,
            ...rest
        } = this.props;

        return isVisible ? (
            
			<Div absolute left={0} right={0} z={999} align={'center'} pointerEvents={'box-none'} style={{ top: this._getTop() }}>
                <Animated.View
                    style={{ 
                        opacity: this.animate([0, 1]), 
                        transform: [{translateY: this.animate([-100, 0])}],
                    }}
                    {...rest}
                >
                    <Gesture up down callback={() => this.close(1)}>
                        <Div 
							maxW={width * 0.85}
                            bg={bg} r={4} px={20} py={15} 
                            style={style} shadow={3} 
                            onPress={onPress}
                        >
                            <Text 
                                color={color} lines={1} 
                                size={14} lh={14} medium 
                                style={textStyle}
                            >{text}</Text>
                        </Div> 
                    </Gesture>
                </Animated.View>
			</Div>
        ) : null;
    }
}

export default Toast;
