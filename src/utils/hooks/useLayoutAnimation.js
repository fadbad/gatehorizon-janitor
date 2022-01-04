import { useEffect } from "react";
import { LayoutAnimation, UIManager, Platform } from "react-native";

export default (dep, duration = 300, property = 'opacity', type = 'easeOut') => {
    // dep must be an array to animate when the dependency change
    if(!dep) return null;

    // property: opacity, scaleX, scaleY, scaleXY
    // type: spring, linear, easeInEaseOut, easeIn, easeOut, keyboard

    useEffect(() => {
        if (
            Platform.OS === "android" &&
            UIManager.setLayoutAnimationEnabledExperimental
        ) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        LayoutAnimation.configureNext(
            LayoutAnimation.create(duration, type, property)
        );
    }, dep)
}
