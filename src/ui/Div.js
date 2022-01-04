import React from "react";
import { 
    View, 
    StyleSheet, 
    TouchableOpacity, 
    Pressable,
    Platform, 
    Dimensions, 
    ScrollView,
    StatusBar,
    Animated, 
    Keyboard, 
    RefreshControl as RNRefreshControl
} from "react-native";
import _ from "lodash";
// import { ScrollView } from "react-native-gesture-handler";
import Animatable from './Animatable'

import { COLORS } from "../app/assets";
const hairline = StyleSheet.hairlineWidth;
const defaultBorderColor = 'rgba(0,0,0,0.2)';

const { width, height } = Dimensions.get('window');

const getStatusBarHeight = (skipAndroid) => {
	const STATUSBAR_DEFAULT_HEIGHT = 20;
	const STATUSBAR_X_HEIGHT = 44;
	const STATUSBAR_IP12_HEIGHT = 47;
	const STATUSBAR_IP12MAX_HEIGHT = 47;

	const X_WIDTH = 375;
	const X_HEIGHT = 812;

	const XSMAX_WIDTH = 414;
	const XSMAX_HEIGHT = 896;

	const IP12_WIDTH = 390;
	const IP12_HEIGHT = 844;

	const IP12MAX_WIDTH = 428;
	const IP12MAX_HEIGHT = 926;

	const { height: W_HEIGHT, width: W_WIDTH } = Dimensions.get("window");

	let statusBarHeight = STATUSBAR_DEFAULT_HEIGHT;
	let isIPhoneX_v = false;
	let isIPhoneXMax_v = false;
	let isIPhone12_v = false;
	let isIPhone12Max_v = false;
	let isIPhoneWithMonobrow_v = false;

	if (Platform.OS === "ios" && !Platform.isPad && !Platform.isTVOS) {
		if (W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT) {
			isIPhoneWithMonobrow_v = true;
			isIPhoneX_v = true;
			statusBarHeight = STATUSBAR_X_HEIGHT;
		} else if (W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT) {
			isIPhoneWithMonobrow_v = true;
			isIPhoneXMax_v = true;
			statusBarHeight = STATUSBAR_X_HEIGHT;
		} else if (W_WIDTH === IP12_WIDTH && W_HEIGHT === IP12_HEIGHT) {
			isIPhoneWithMonobrow_v = true;
			isIPhone12_v = true;
			statusBarHeight = STATUSBAR_IP12_HEIGHT;
		} else if (W_WIDTH === IP12MAX_WIDTH && W_HEIGHT === IP12MAX_HEIGHT) {
			isIPhoneWithMonobrow_v = true;
			isIPhone12Max_v = true;
			statusBarHeight = STATUSBAR_IP12MAX_HEIGHT;
		}
	}
	return Platform.select({
		ios: statusBarHeight,
		android: skipAndroid ? 0 : StatusBar.currentHeight,
		default: 0,
	});
}

const statusBarHeight = getStatusBarHeight(true)

const empty = (str) => {
    if(typeof str === undefined) return true;
    if(str === 0) return false
    str = str ? str.toString() : ''
    return _.isEmpty(str)
}

const RefreshControl = ({ callback, style, children, ...params }) => {
    const [refreshing, setRefreshing] = React.useState(false);

    const handleOnRefresh = React.useCallback(async () => {
        setRefreshing(true);
        if (callback) {
            try {
                await callback()
            } catch (e) {
                console.log(e)
            }
        }
        setRefreshing(false)
    }, [callback]);

    return (
        <RNRefreshControl
            children={children}
            style={style}
            refreshing={refreshing}
            onRefresh={handleOnRefresh}
            {...params}
        />
    );
}

const SHADOWS = [
    {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.00,
        shadowRadius: 0.00,
        elevation: 0,
    },
    {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
    },
]

const Div = ({
    forwardedRef,
    m,
    mb,
    mt,
    mr,
    ml,
    my,
    mx,
    p,
    pb,
    py,
    pt,
    pr,
    pl,
    px,

    r, rt, rtl, rtr, rb, rbl, rbr, rl, rr,
    avatar,
    circle,

    center,
    b, bt, br, bb, bl, bcolor, btype,
    shadow, shadowColor,

    f,
    h,
    w,
    size,
    fw,
    fs,
    fh,

    align,
    justify,
    self,
    dir,
    flexWrap,
    row,

    o,

    bg,

    rows,
    children,

    position,

    style: customStyle,
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    onDoubleTab,
    activeOpacity,
    z,
    start,
    body,
    end,
    absoluteFill,
    absolute, top, right, bottom, left,
    safe,
    scroll, refreshParams, onRefresh,
    keyboardscroll,
    keyboarddismiss,
    wrap,
    minH, maxH, minW, maxW,
    barcolor,
	flip,
	ovh,
    ...rest
}) => {

    if(barcolor){
        let statusbarcolor
        if(barcolor == 'light') {
            statusbarcolor = 'light-content'
        } else if(barcolor == 'dark') {
            statusbarcolor = 'dark-content'
        } else {
            statusbarcolor = 'default'
        }
        StatusBar.setBarStyle(statusbarcolor)
    }

	const _style = {};
	if(ovh) _style.overflow = 'hidden'
    // FLEX
    if (f) _style.flex = (typeof f === 'number') ? f : 1;

    if (row) _style.flexDirection = 'row';

    if (flexWrap) _style.flexWrap = flexWrap;
    if (wrap) _style.flexWrap = 'wrap'

    if (dir) {
        if (dir === 'row') {
            _style.flexDirection = 'row';
        } else if (dir === 'row-reverse') {
            _style.flexDirection = 'row-reverse';
        } else if (dir === 'col') {
            _style.flexDirection = 'column';
        } else if (dir === 'col-reverse') {
            _style.flexDirection = 'column-reverse';
        }
    }

    if (align) {
        if (align === 'center') {
            _style.alignItems = 'center';
        } else if (align === 'start') {
            _style.alignItems = 'flex-start';
        } else if (align === 'end') {
            _style.alignItems = 'flex-end';
        } else if (align === 'stretch') {
            _style.alignItems = 'stretch';
        } else if (align === 'baseline') {
            _style.alignItems = 'baseline';
        }
    }

    if (justify) {
        if (justify === 'center') {
            _style.justifyContent = 'center';
        } else if (justify === 'start') {
            _style.justifyContent = 'flex-start';
        } else if (justify === 'end') {
            _style.justifyContent = 'flex-end';
        } else if (justify === 'between') {
            _style.justifyContent = 'space-between';
        } else if (justify === 'around') {
            _style.justifyContent = 'space-around';
        } else if (justify === 'evenly') {
            _style.justifyContent = 'space-evenly';
        }
    }

    if (self) {
        if (self === 'center') {
            _style.alignSelf = 'center';
        } else if (self === 'start') {
            _style.alignSelf = 'flex-start';
        } else if (self === 'end') {
            _style.alignSelf = 'flex-end';
        } else if (self === 'stretch') {
            _style.alignSelf = 'stretch';
        } else if (self === 'auto') {
            _style.alignSelf = 'auto';
        } else if (self === 'baseline') {
            _style.alignSelf = 'baseline';
        }
    }

    if(center){
        _style.justifyContent = 'center';
        _style.alignItems = 'center';
    }

    if (start) {
        _style.flex = 1;
        _style.alignSelf = "center";
        _style.alignItems = "flex-start";
        _style.justifyContent = "flex-start"
    }

    if (body) {
        _style.flex = 3;
        _style.alignSelf = "center";
        _style.alignItems = "center";
        _style.justifyContent = "center"
    }

    if (end) {
        _style.flex = 1;
        _style.alignSelf = "center";
        _style.alignItems = "flex-end";
        _style.justifyContent = "flex-end"
    }

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
    // POSITION
    if (position) _style.position = position;
    // OPACITY
    if(!empty(o)) _style.opacity = o;

    if(size){
        _style.width = size 
        _style.height = size
    } else {
        if(h){
            if (typeof h === 'number' && h < 1) {
                // _style.height = `${h * 100}%`;
                _style.height = height * h;
            } else {
                _style.height = h;
            }
        }

        if(w){
            if (typeof w === 'number' && w < 1) {
                // _style.width = `${w * 100}%`;
                _style.width = width * h;
            } else {
                _style.width = w;
            }
        }
    }

    if (z) {
        _style.zIndex = z;
        // _style.elevation = z;
    }

    if(fw) _style.width = '100%';

    if(fs){
        _style.width = width;
        _style.height = height;
    }

    if (fh) _style.height = height;

    if (minH) _style.minHeight = minH;
    if (maxH) _style.maxHeight = maxH;
    if (minW) _style.minWidth = minW;
    if (maxW) _style.maxWidth = maxW;

    if (absoluteFill) {
        _style.position = 'absolute'; 
        _style.top = 0;
        _style.bottom = 0;
        _style.left = 0;
        _style.right = 0;
    }

    if(absolute) _style.position= 'absolute'
    if(!empty(top)) _style.top = top
    if(!empty(right)) _style.right = right
    if(!empty(bottom)) _style.bottom = bottom
    if(!empty(left)) _style.left = left

    // SHADOW
    let _shadow = null
    if(!empty(shadow)) _shadow = SHADOWS[shadow]
    if(shadowColor) _style.shadowColor = COLORS[shadowColor] || shadowColor

    // RADIUS
    if(r) _style.borderRadius = r
    if(rtl) _style.borderTopLeftRadius = rtl
    if(rtr) _style.borderTopRightRadius = rtr
    if(rbl) _style.borderBottomLeftRadius = rbl
    if(rbr) _style.borderBottomRightRadius = rbr
    if(rt){
        _style.borderTopLeftRadius = rt
        _style.borderTopRightRadius = rt
    }
    if(rb){
        _style.borderBottomLeftRadius = rb
        _style.borderBottomRightRadius = rb
    }
    if(rl){
        _style.borderTopLeftRadius = rl
        _style.borderBottomLeftRadius = rl
    }
    if(rr){
        _style.borderTopRightRadius = rr
        _style.borderBottomRightRadius = rr
    }

    // BORDER
    if(b) _style.borderWidth = (typeof b === 'number') ? b : hairline
    if(bt) _style.borderTopWidth = (typeof bt === 'number') ? bt : hairline
    if(br) _style.borderRightWidth = (typeof br === 'number') ? br : hairline
    if(bb) _style.borderBottomWidth = (typeof bb === 'number') ? bb : hairline
    if(bl) _style.borderLeftWidth = (typeof bl === 'number') ? bl : hairline
    if(bcolor){
        _style.borderColor = COLORS[bcolor] || bcolor || defaultBorderColor
    } else {
        if(b || bt || br || bb || bl){
            _style.borderColor = defaultBorderColor
        }
    }
    if(btype){ // solid, dotted, dashed
        _style.borderStyle = btype || 'solid'
    }
    // BACKGROUND
    if(bg) _style.backgroundColor = COLORS[bg] || bg;

    if (safe) _style.paddingTop = statusBarHeight;
    if(flip) _style.transform = [{rotateY: '180deg'}];

    const _customStyle = StyleSheet.flatten(customStyle);

    const style = StyleSheet.create({
        box: StyleSheet.flatten({
            ..._shadow,
            ..._style,
            ..._customStyle
        })
    });

    let timer = false
    const [firstPress, setFirstPress] = React.useState(true)
    const [lastTime, setLastTime] = React.useState(new Date())

    const _onDoubleTab = () => {
        let now = new Date().getTime();
    
        if (firstPress) {
            setFirstPress(false)
            timer = setTimeout(() => {
                onPress && onPress()
                setFirstPress(true)
                timer = false
            }, 300);
            setLastTime(now)
        } else {
            if (now - lastTime < 300) {
                timer && clearTimeout(timer);
                onDoubleTab && onDoubleTab()
                setFirstPress(true)
            }
        }
    };

    React.useEffect(() => () => {
        timer && clearTimeout(timer)
    }, [])

	const isCloseToBottom = ({ nativeEvent }) => {
		const {layoutMeasurement, contentOffset, contentSize} = nativeEvent
		return layoutMeasurement.height + contentOffset.y > contentSize.height;
	};

    return (onPress || onDoubleTab || onLongPress || onPressIn || onPressOut) ? (
        <TouchableOpacity
            ref={forwardedRef}
            activeOpacity={activeOpacity || 0.9}
            {...rest}
            onPress={onDoubleTab ? _onDoubleTab : onPress ? onPress : null }
            onLongPress={onLongPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={style.box}
        >
            {children}
        </TouchableOpacity>
    ) : keyboarddismiss ? (
        <Pressable
            ref={forwardedRef}
            activeOpacity={1}
            {...rest}
            onPress={() => Keyboard.dismiss()}
            accessible={false}
            style={style.box}
        >
            {children}
        </Pressable>
    ) : scroll ? (
        <ScrollView 
            ref={forwardedRef}
            keyboardShouldPersistTaps={'handled'}
            showsHorizontalScrollIndicator={false} 
            showsVerticalScrollIndicator={false} 
            // decelerationRate={0.99}
            keyboardDismissMode='interactive'
            refreshControl={onRefresh && (<RefreshControl callback={onRefresh} {...refreshParams} />) }
            {...rest} 
            contentContainerStyle={style.box}
        >
            {children}
        </ScrollView>
    ) : (
        <View {...rest} style={style.box} ref={forwardedRef}>
            {children}
        </View>
    );
};

Div.displayName = "Div";

export class DivComponent extends React.Component {
    constructor(props) { super(props) }
    render() { return <Div {...this.props} /> }
}

export const AnimatedDiv = Animated.createAnimatedComponent(DivComponent)
export const AnimatableDiv = Animatable.createAnimatableComponent(DivComponent)

export default React.memo(Div);
