import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { lighten, darken, isRTL } from "../../utils";

const primary = "#39CAA7"
const secondary = "#1F1F39"

export const COLORS = {
    // base colors
    primary: primary,
    secondary: secondary,

    red: '#F44336',
    red2: '#e51c23',
    blue: '#2196F3',
	lightblue: '#03a9f4',
    indigo: '#3f51b5',
    purple: '#9c27b0',
    deeppurple: '#673ab7',
    pink: '#e91e63',
    cyan: '#00bcd4',
    teal: '#009688',
	green: '#4CAF50',
    lighgreen: '#8bc34a',
    lime: '#cddc39',
    yellow: '#ffeb3b',
    amber: '#ffc107',
    // orange: '#ff9800',
    orange: '#EEA86C',
    deeporange: '#ff5722',
    brown: '#795548',
    bluegrey: '#607d8b',
    grey: '#9e9e9e',

	success: '#60d9a0',
	danger: '#D96060',

    // colors
    black: "#1E1F20",
    white: "#FFFFFF",

    light: '#d6e0e8',
    // muted: '#747474',
    muted: '#7A8791',
    mutedlight: '#B0BEC8',

    lightGray: "#F5F5F6",
    lightGray2: "#F6F6F7",
    lightGray3: "#EFEFF1",
    lightGray4: "#F8F8F9",
    transparent: "transparent",
    darkgray: '#898C95',
};

export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 30,
    padding: 10,
    padding2: 12,

    // app dimensions
    width,
    height
};

export const FONTS = isRTL ? {
	regular: "Tajawal-Regular",
    black: "Tajawal-Black",
    bold: "Tajawal-Bold",
    medium: "Tajawal-Medium",
    light: "Tajawal-Light",
    thin: "Tajawal-ExtraLight",
} : {
    regular: "Montserrat-Regular",
    black: "Montserrat-Black",
    bold: "Montserrat-Bold",
    medium: "Montserrat-Medium",
    light: "Montserrat-Light",
    thin: "Montserrat-Thin",
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
