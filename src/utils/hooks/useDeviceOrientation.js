import {useEffect, useState, useCallback} from 'react';
import {Dimensions, ScaledSize} from 'react-native';

const screen = Dimensions.get('screen');

export default function() {
	const isOrientationPortrait = ({width, height}) => height >= width;
	const isOrientationLandscape = ({width, height}) => width >= height;

	const [orientation, setOrientation] = useState({
		portrait: isOrientationPortrait(screen),
		landscape: isOrientationLandscape(screen),
	});

	const onChange = useCallback(({screen}) => {
		setOrientation({
		portrait: isOrientationPortrait(screen),
		landscape: isOrientationLandscape(screen),
		});
	}, []);

	let SUB = null

	useEffect(() => {
		SUB = Dimensions.addEventListener('change', onChange);

		return () => {
			SUB && SUB.remove();
			// Dimensions.removeEventListener('change', onChange);
		};
	}, [orientation.portrait, orientation.landscape, onChange]);

	return orientation;
}
