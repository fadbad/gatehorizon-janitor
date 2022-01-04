import React from 'react'
import { useNavigation } from "../utils";
import Div from './Div'
import Text from './Text'
import Image from './Image'
import Icon from './Icon'
import AnimatedBar from './AnimatedBar'
import {IMAGES, COLORS } from "../app/assets";

export default ({left, right, center, logo, title, bg, back, color, loading, loadingColor}) => {
    const nav = useNavigation()
	loadingColor = loadingColor || COLORS.blue
    color = color ?? 'red'

    return (<>
        <Div bg={bg || 'transparent'} safe>
            <Div row center>
                <Div row start>
                    {(back) && (
						<Div size={56} center bg={'transparent'} onPress={() => nav.goBack()}>
                        	<Icon name={'back'} color={color} />
						</Div>
                    )}
                    {left}
                </Div>
                
                <Div mx={16} row body>
                    {(center) && center}
                    {(logo) && (<Image src={IMAGES.logo} h={24} color={color} />)}
                    {(title) && (<Text color={color} center size={16} bold>{title}</Text>)}
                </Div>
                
                <Div row end>
                    {right}
                </Div>
                
            </Div>
        </Div>
        {(loading) && (
            <AnimatedBar color={loadingColor} />
        )}
    </>)
}
