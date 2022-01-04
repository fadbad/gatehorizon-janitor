import React from 'react'
import { Div, Text, Icon, Image } from '../../ui'
import { useNavigation, empty } from '../../utils'

export default ({ 
    logo,
    title, 
    subtitle,
    right,
    more,
    back
}) => {
    const nav = useNavigation()
    return (
    <Div z={2}>
        <Div safe barcolor={'light'}>
            <Div h={60} row mx={24} center>
                <Div size={32}>
                    {back ? (
                        <Icon 
                            name={'back'} 
                            size={32} 
                            color={'white'}
                            onPress={() => nav.goBack()} 
                        />
                    ) : (
                        <Icon 
                            name={'menu'} 
                            size={32} 
                            color={'white'}
                            onPress={() => nav.openDrawer()} 
                        />
                    )}
                </Div>
                <Div f={1} center>
                    {logo && (
                        <Image src={'logo'} size={40} contain color={'white'} />
                    )}
                    {!empty(title) && (
                        <Text size={16} lh={16} bold uppercase color={'white'}>
                            {title}
                        </Text>
                    )}
                    {!empty(subtitle) && (
                        <Text size={10} lh={10} mt={3} uppercase color={'white'} o={0.65}>
                            {subtitle}
                        </Text>
                    )}
                </Div>
                <Div size={32}>
                    {right}
                </Div>
            </Div>
            
            <Div mx={24}>
                {more}
            </Div>
        </Div>
    </Div>
    )
}
