import React from "react";
import { DefaultTheme } from "@react-navigation/native";
import { COLORS } from '../assets'

export const navigationRef = React.createRef();

export const navigate = (name, params) => navigationRef.current?.navigate(name, params);

export const navigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: COLORS.primary,
        background: COLORS.light,
        border: 'transparent',
        card: 'transparent',
    },
};
