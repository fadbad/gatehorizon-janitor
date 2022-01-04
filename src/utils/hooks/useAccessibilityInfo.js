import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

const useAccessibilityStateListener = (eventName, initializerName) => {
	const [isEnabled, setIsEnabled] = useState(undefined);

	useEffect(() => {
		if (!AccessibilityInfo[initializerName]) {
			return;
		}

		AccessibilityInfo[initializerName]().then(setIsEnabled);
		AccessibilityInfo.addEventListener(eventName, setIsEnabled);

		return () => AccessibilityInfo.removeEventListener(eventName, setIsEnabled);
	}, [eventName, initializerName]);

	return isEnabled;
};

export default () => {
	const boldTextEnabled = useAccessibilityStateListener(
		'boldTextChanged',
		'isBoldTextEnabled',
	);
	const grayscaleEnabled = useAccessibilityStateListener(
		'grayscaleChanged',
		'isGrayscaleEnabled',
	);
	const invertColorsEnabled = useAccessibilityStateListener(
		'invertColorsChanged',
		'isInvertColorsEnabled',
	);
	const reduceMotionEnabled = useAccessibilityStateListener(
		'reduceMotionChanged',
		'isReduceMotionEnabled',
	);
	const reduceTransparencyEnabled = useAccessibilityStateListener(
		'reduceTransparencyChanged',
		'isReduceTransparencyEnabled',
	);
	const screenReaderEnabled = useAccessibilityStateListener(
		'screenReaderChanged',
		'isScreenReaderEnabled',
	);

	return {
		screenReaderEnabled,
		grayscaleEnabled,
		invertColorsEnabled,
		reduceMotionEnabled,
		reduceTransparencyEnabled,
		boldTextEnabled,
	};
};
