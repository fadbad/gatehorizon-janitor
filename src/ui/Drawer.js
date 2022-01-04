// https://software-mansion.github.io/react-native-gesture-handler/docs/component-drawer-layout.html

import React from 'react'
import { Dimensions, Keyboard } from 'react-native'
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';

const responsiveWidth = w => {
    const { width } = Dimensions.get("window");
    return width * (w / 100);
}

export default class Drawer extends React.Component {
    static defaultProps = {
        renderDrawer: v => null, 
        width: responsiveWidth(75), 
        edgeWidth: 0, 
        position: 'right', 
        type: 'slide', // front, back, slide
        bg: '#F7F7FA', 
        overlay: 'rgba(255, 255, 255, 0.3)',
        onOpen: () => null,
        onClose: () => null,
    }

    constructor(props){
        super(props)
    }

    open = () => this.DRAWER.openDrawer()

    close = () => this.DRAWER.closeDrawer()

    render(){
        const { 
            onClose, onOpen,
            renderDrawer, width, edgeWidth, position, type, bg, overlay, children 
        } = this.props
        return (
            <DrawerLayout 
                ref={ref => this.DRAWER = ref}
                drawerWidth={width}
                edgeWidth={edgeWidth}
                keyboardDismissMode="on-drag"
                drawerPosition={position || 'right'}
                drawerType={type || 'slide'} // front, back, slide
                drawerBackgroundColor={bg}
                overlayColor={overlay}
                renderNavigationView={renderDrawer}
                onDrawerOpen={onOpen}
                onDrawerClose={() => {
                    Keyboard.dismiss()
                    onClose && onClose()
                }}
                // contentContainerStyle={{
                //     shadowColor: '#000',
                //     shadowOpacity: 0.3,
                //     shadowOffset: { width: 0, height: 0 },
                //     shadowRadius: 6,
                //     elevation: 4
                // }}
            >
                {children}
            </DrawerLayout>
        )
    }
}

// const renderDrawer = progressValue => {
//     const animate = output => progressValue.interpolate({
//         inputRange: [0, 1],
//         outputRange: output,
//     });

//     return (
//         <Animated.View style={{
//             flex: 1, 
//             transform: [{ translateX: animate([-50, 0]) }],
//             opacity: animate([0, 1])
//         }}>
//             <Box safe px={20}>
//                 <Text>I am in the drawer!</Text>
//                 <Text>
//                     Watch parallax animation while you pull the drawer!
//                 </Text>
//             </Box>
//         </Animated.View>
//     );
// };
