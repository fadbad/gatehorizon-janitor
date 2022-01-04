import { useEffect, useState } from "react";
import { Dimensions, ScaledSize } from "react-native";

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export default function useDimensions() {
    const [dimensions, setDimensions] = useState({
        window,
        screen,
		width: window.width,
		height: window.height
    });

    const onChange = ({ window, screen }) => {
        setDimensions({ 
			window, 
			screen, 
			width: window.width,
			height: window.height
		});
    };

    let SUB = null
    useEffect(() => {
        SUB = Dimensions.addEventListener("change", onChange);
        return () => {
            SUB && SUB.remove()
        }
    }, []);

    return dimensions;
}
