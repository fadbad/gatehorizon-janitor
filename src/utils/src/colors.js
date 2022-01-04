
import __Color from '../lib/color'

// https://github.com/Qix-/color
export const Color = hex => new __Color(hex)
export const darken = (color, num) => Color(color).darken(num).string()
export const lighten = (color, num) => Color(color).lighten(num).string()
export const fade = (color, num) => Color(color).fade(num).string()

export const getContrastingColor = (input, light, dark) => {
    if (typeof input === 'string') {
        return Color(input).isLight() ? dark : light;
    }
    
    return light;
}

// https://css-tricks.com/snippets/javascript/lighten-darken-color/
export const lightenDarken = (col, amt) => {

    // Lighten
    // var NewColor = lightenDarkenColor("#F06D06", 20); 
    // Darken
    // var NewColor = lightenDarkenColor("#F06D06", -20); 
  
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
}

export const hexToRGBA = (hex, opacity = 1) => {
    return Color(hex).fade(opacity).string()
}

export const randomColor = () => {
    return '#' +  Math.random().toString(16).substr(-6);
}

export const shadeColor = (color, percent) => {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100, 0); // eslint-disable-line
    G = parseInt(G * (100 + percent) / 100, 0); // eslint-disable-line
    B = parseInt(B * (100 + percent) / 100, 0); // eslint-disable-line

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    const RR = ((R.toString(16).length === 1) ? `0${R.toString(16)}` : R.toString(16));
    const GG = ((G.toString(16).length === 1) ? `0${G.toString(16)}` : G.toString(16));
    const BB = ((B.toString(16).length === 1) ? `0${B.toString(16)}` : B.toString(16));

    return `#${RR}${GG}${BB}`;
}

const hash = (string) => {
    let h = 0;
    for (let char of string) {
        h = char.codePointAt(0) + ((h << 5) - h);
    }
    return h;
}
const intToRgb = (int) => {
    return (int >> 24 & 255).toString(16)
        + (int >> 16 & 255).toString(16)
        + (int >> 8 & 255).toString(16)
        + (int & 255).toString(16);
}
const doShading = (color, prc) => {
    let num = parseInt(color, 16),
        amt = Math.round(2.55 * prc),
        R = (num >> 16) + amt,
        G = (num >> 8 & 255) + amt,
        B = (num & 255) + amt;

    return (16777216
        + (R < 255 ? R < 1 ? 0 : R : 255) * 65536
        + (G < 255 ? G < 1 ? 0 : G : 255) * 256
        + (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
}

export const strToColor = (str) => doShading(intToRgb(hash(str)), -10);

export const rgb2hex = color => {
    if(typeof color !== 'string') {
        throw new Error('color has to be type of `string`');
    } else if (color.substr(0, 1) === '#') {
        return {
            hex: color,
            alpha: 1
        };
    }

    /**
     * strip spaces
     */
    var strippedColor = color.replace(/\s+/g,'');

    /**
     * parse input
     */
    var digits = /(.*?)rgb(a)??\((\d{1,3}),(\d{1,3}),(\d{1,3})(,([01]|1.0*|0??\.([0-9]{0,})))??\)/.exec(strippedColor);

    if(!digits) {
        // or throw error if input isn't a valid rgb(a) color
        throw new Error('given color (' + color + ') isn\'t a valid rgb or rgba color');
    }

    var red = parseInt(digits[3], 10);
    var green = parseInt(digits[4], 10);
    var blue = parseInt(digits[5], 10);
    var alpha = digits[6] ? /([0-9\.]+)/.exec(digits[6])[0] : '1';
    var rgb = ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1);

    // parse alpha value into float
    if(alpha.substr(0,1) === '.') {
        alpha = parseFloat('0' + alpha);
    }

    // cut alpha value after 2 digits after comma
    alpha = parseFloat(Math.round(alpha * 100)) / 100;

    return {
        hex: '#' + rgb.toString(16),
        alpha: alpha
    };
}
