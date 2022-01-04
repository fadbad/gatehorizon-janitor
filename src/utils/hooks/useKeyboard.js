import { useEffect, useState } from "react";
import { Keyboard, LayoutAnimation } from "react-native";

export default () => {
    const [keyboardShown, setKeyboardShown] = useState(false);
    const [coordinates, setCoordinates] = useState({
        start: { screenX: 0, screenY: 0, width: 0, height: 0 },
        end: { screenX: 0, screenY: 0, width: 0, height: 0 },
    });
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const handleKeyboardWillShow = (e) => {
        setKeyboardShown(true);
        setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
    };
    const handleKeyboardDidShow = (e) => {
        setKeyboardShown(true);
        setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
        setKeyboardHeight(e.endCoordinates.height);
    };
    const handleKeyboardWillHide = (e) => {
        setKeyboardShown(false);
        setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
    };
    const handleKeyboardDidHide = (e) => {
        setKeyboardShown(false);
        setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
        setKeyboardHeight(0);
    };

    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            "keyboardWillShow",
            handleKeyboardWillShow
        );
        const keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow",
            handleKeyboardDidShow
        );
        const keyboardWillHideListener = Keyboard.addListener(
            "keyboardWillHide",
            handleKeyboardWillHide
        );
        const keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            handleKeyboardDidHide
        );

        return () => {
            keyboardWillShowListener.remove();
            keyboardDidShowListener.remove();
            keyboardWillHideListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

	useEffect(() => {
		if(!keyboardHeight) return;
		LayoutAnimation.configureNext({
			duration: 500,
			create: {
				duration: 300,
				type: LayoutAnimation.Types.easeInEaseOut,
				property: LayoutAnimation.Properties.opacity,
			},
			update: {
				type: LayoutAnimation.Types.spring,
				springDamping: 200,
			},
		});
	}, [keyboardHeight])

    return { keyboardShown, keyboardHeight, coordinates };
};
