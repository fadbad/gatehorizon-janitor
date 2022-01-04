import React from "react";
import { Text as RnText, StyleSheet, Animated, I18nManager } from "react-native";
import Animatable from './Animatable'
import _ from "lodash";
import { FONTS, COLORS } from '../app/assets'

const isRTL = I18nManager.isRTL

const empty = (str) => {
    if(typeof str === undefined) return true;
    if(str === 0) return false
    str = str ? str.toString() : ''
    return _.isEmpty(str)
}

const Text = ({
    lines,
    lineThrough,
    b, bt, br, bb, bl, bcolor,
    color, bg,

    m, mb, mt, mr, ml, my, mx,
    p, pb, pt, pr, pl, px, py,

    ls,

    lowercase, uppercase, capitalize,

    font,

    lineH,
    lh,
    size,

    bold, medium, normal, black, light, thin, weight,
    left, right, center,

    o,

    italic,
    deco,
    style: customStyle,
    children,
    header,
    h1, h2, h3, h4,
    fw, w,
    align,
    wrap,
    fit,
    ...rest
}) => {

    const _customStyle = StyleSheet.flatten(customStyle);

	const _style = {};
	
	if(uppercase) _style.textTransform = 'uppercase'
	if(lowercase) _style.textTransform = 'lowercase'
	if(capitalize) _style.textTransform = 'capitalize'

    _style.fontFamily = FONTS.regular;
    _style.fontSize = 14;
    _style.lineHeight = isRTL ? 18 : 22;

    if(!empty(o)) _style.opacity = o;

    // MARGIN
    if (m) _style.margin = m;
    if (mt) _style.marginTop = mt;
    if (mr) _style.marginRight = mr;
    if (mb) _style.marginBottom = mb;
    if (ml) _style.marginLeft = ml;
    if (mx) _style.marginHorizontal = mx;
    if (my) _style.marginVertical = my;
    // PADDING
    if (p) _style.padding = p;
    if (pt) _style.paddingTop = pt;
    if (pr) _style.paddingRight = pr;
    if (pb) _style.paddingBottom = pb;
    if (pl) _style.paddingLeft = pl;
    if (px) _style.paddingHorizontal = px;
    if (py) _style.paddingVertical = py;

    if(font) _style.fontFamily = font || FONTS.regular;
    if(size) _style.fontSize = size;
    if (italic) _style.fontStyle = 'italic';
    if (ls) _style.letterSpacing = ls;
    if (lh) _style.lineHeight = lh;

    if(color) _style.color = COLORS[color] || color;
    if(bg) _style.backgroundColor = COLORS[bg] || bg;

    // DECO
    if (typeof deco === 'string') {
        if (deco === 'none') {
            _style.textDecorationLine = 'none';
        } else if (deco === 'underline') {
            _style.textDecorationLine = 'underline';
        } else if (deco === 'through') {
            _style.textDecorationLine = 'line-through';
        } else if (deco === 'underline-through') {
            _style.textDecorationLine = 'underline line-through';
        }
    }

    if(black){
        _style.fontFamily = FONTS.black;
        _style.fontWeight = "bold";
    }

    if(bold){
        _style.fontFamily = FONTS.bold;
        // _style.fontWeight = "bold";
    }

    if(medium){
        _style.fontFamily = FONTS.medium;
        // _style.fontWeight = "bold";
    }

    if(light){
        _style.fontFamily = FONTS.light;
        _style.fontWeight = "200";
    }

    if(thin){
        _style.fontFamily = FONTS.thin;
        _style.fontWeight = "100";
    }

    if (header) {
        // _style.fontWeight = "bold";
        _style.fontSize = 18;
        _style.letterSpacing = 0.2
    }

    if (h1) {
        _style.fontFamily = FONTS.black;
        _style.fontWeight = "bold";
        _style.fontSize = 30;
        _style.lineHeight = 36;
    }

    if (h2) {
        _style.fontFamily = FONTS.bold;
        _style.fontWeight = "bold";
        _style.fontSize = 22;
        _style.lineHeight = 30;
    }

    if (h3) {
        _style.fontFamily = FONTS.bold;
        _style.fontWeight = "bold";
        _style.fontSize = 20;
        _style.lineHeight = 22;
    }

    if (h4) {
        _style.fontFamily = FONTS.bold;
        _style.fontWeight = "bold";
        _style.fontSize = 18;
        _style.lineHeight = 22;
    }


    if (w) _style.width = w;
    if (fw) _style.width = '100%';

    if (center) _style.textAlign = 'center';
    if (left) _style.textAlign = 'left';
    if (right) _style.textAlign = 'right';
      
    if(align) _style.textAlign = align;

    if(!align && !_style.textAlign) _style.textAlign = 'left'; // default to left for RTL support

    if(wrap){
        _style.flexWrap = 'wrap'
    }

    if(lineThrough){
        _style.textDecorationLine = 'line-through'
        _style.textDecorationStyle = 'solid'
    }

	if(isRTL){
		_style.fontSize = _style.fontSize
		// _style.lineHeight = _style.fontSize
		_style.letterSpacing = 0
	}

    const style = StyleSheet.create({
        text: StyleSheet.flatten({
            ..._style,
            ..._customStyle
        })
    });

    const [currentFont, setCurrentFont] = React.useState(style.text.fontSize || 14);

    return fit ? (
        <RnText 
            numberOfLines={fit} 
            adjustsFontSizeToFit 
            {...rest} 
            style={[style.text, {fontSize: currentFont}]}
            onTextLayout={ (e) => {
                const { lines } = e.nativeEvent;
                if (lines.length > fit) {
                    setCurrentFont(currentFont - 1);
                }
            } }
        >
            {children}
        </RnText>
    ) : (
        // @ts-ignore
        <RnText numberOfLines={lines} {...rest} style={style.text}>
            {children}
        </RnText>
    );
};

Text.displayName = "Text";

export class TextComponent extends React.Component {
    constructor(props) { super(props) }
    render() { return <Text {...this.props} /> }
}

export const AnimatedText = Animated.createAnimatedComponent(TextComponent)
export const AnimatableText = Animatable.createAnimatableComponent(TextComponent)

export default React.memo(Text);
