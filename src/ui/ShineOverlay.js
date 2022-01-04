import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native'
import { fade } from '../utils/src/colors';
import Linear from './Linear';

export default ({
	duration = 750, 
	isInteraction = false, 
	width = 30, 
	bg="#F8F6F6",
}) => {
	const FADED = fade(bg, 100);

	const animation = useRef(new Animated.Value(0));

	const start = () => {
		animation.current.setValue(0);

		Animated.timing(animation.current, {
			duration: duration,
			isInteraction: isInteraction,
			toValue: 1,
			useNativeDriver: false,
		}).start((e) => {
			if (e.finished) start();
		});
	};

	const left = animation.current.interpolate({
		inputRange: [0, 1],
		outputRange: ["0%", "100%"],
	});

	useEffect(() => {
		start()
	}, [])

	return (
		<Animated.View style={{
			height: "100%",
			position: "absolute",
			width,
			left,
		}}>
			<Linear 
				horizontal
				w={width}
				h={'100%'}
				colors={[FADED, bg, FADED]}
			/>
		</Animated.View>
	)
}
