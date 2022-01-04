import React from 'react'
import { Dimensions } from 'react-native'

const responsiveHeight = h => {
    const { height } = Dimensions.get("window");
    return height * (h / 100);
};
  
const responsiveWidth = w => {
    const { width } = Dimensions.get("window");
    return width * (w / 100);
};
  
const responsiveFontSize = f => {
    const { width } = Dimensions.get("window");
    const tempHeight = (16 / 9) * width;
    return Math.sqrt(Math.pow(tempHeight, 2) + Math.pow(width, 2)) * (f / 100);
};
  
const useResponsiveHeight = h => {
    const [calculatedHeight, setCalculatedHeight] = React.useState(responsiveHeight(h));

    let SUB = null
  
    React.useEffect(() => {
        function handleDimensionChange() {
            setCalculatedHeight(responsiveHeight(h));
        }
  
        SUB = Dimensions.addEventListener("change", handleDimensionChange);
        return () => {
            SUB && SUB.remove()
        };
    });
  
    return calculatedHeight;
};
  
const useResponsiveWidth = w => {
    const [calculatedWidth, setCalculatedWidth] = React.useState(responsiveWidth(w));
    let SUB = null
    React.useEffect(() => {
        function handleDimensionChange() {
            setCalculatedWidth(responsiveWidth(w));
        }
        SUB = Dimensions.addEventListener("change", handleDimensionChange);
        return () => {
            SUB && SUB.remove()
        };
    });
    return calculatedWidth;
};
  
const useResponsiveFontSize = f => {
    const [calculatedFontSize, setCalculatedFontSize] = React.useState(
        responsiveFontSize(f)
    );

    let SUB = null

    React.useEffect(() => {
        function handleDimensionChange() {
            setCalculatedFontSize(responsiveFontSize(f));
        }
  
        SUB = Dimensions.addEventListener("change", handleDimensionChange);
        return () => {
            SUB && SUB.remove()
        };
    });
  
    return calculatedFontSize;
};

export {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
    useResponsiveHeight,
    useResponsiveWidth,
    useResponsiveFontSize,
}
