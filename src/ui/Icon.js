import React from 'react';
import { I18nManager, Animated } from 'react-native'
import Animatable from './Animatable'
import Div from './Div'
import Image from './Image';

import { COLORS, ICONS } from '../app/assets'

const Icon = ({name, color, size = 24, onPress, noflip, style, ...rest}) => {

    const _color = color ? COLORS[color] || color : null
    
    return (
        <Div size={size} bg={'transparent'} center onPress={onPress} {...rest}>
            <Image 
                src={ICONS[name]} 
                size={size} 
                color={_color} 
                style={{
                    transform: [{scaleX: (I18nManager.isRTL && !noflip) ? -1 : 1}],
                    ...style
                }}
            />
        </Div>
    )
}
Icon.displayName = 'Icon'

export class IconComponent extends React.Component {
    constructor(props) { super(props) }
    render() { return <Icon {...this.props} /> }
}

export const AnimatedIcon = Animated.createAnimatedComponent(IconComponent)
export const AnimatableIcon = Animatable.createAnimatableComponent(IconComponent)

export default React.memo(Icon);
