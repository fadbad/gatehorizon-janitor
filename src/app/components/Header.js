import { t } from 'i18next'
import React from 'react'
import { Div, Text, Icon, Image, Overlay } from '../../ui'
import { empty, useStore, Config, Platform } from '../../utils'

export default ({ onPress }) => {

    const { user, user_logout } = useStore()
    const [showSettings, setShowSettings] = React.useState(false)

    return (
        <Div z={2}>
            <Div safe barcolor={'light'}>
                <Div h={80} row mx={24} center>
                    <Div size={40} onPress={onPress}>
                        <Image src={'logo'} size={40} contain color={'white'} />
                    </Div>
                    <Div f={1} align={'end'} onPress={() => setShowSettings(true)}>
                        <Div row align={'center'} justify={'end'}>
                            <Div align={'end'}>
                                <Text color={'white'} size={18}>
                                    {user.name}
                                </Text>
                                <Text color={'white'} size={14} lh={14}>
                                    {user.compoundName}
                                </Text>

                            </Div>
                            <Icon name={'user'} color={'primary'} size={40} ml={12} />
                        </Div>
                    </Div>
                </Div>
            </Div>

            <Overlay
                isVisible={showSettings}
                onBackdropPress={() => setShowSettings(false)}
                w={'80%'}
            >
                <Div center>
                    <Text bold>{user.name}</Text>
                    <Div onPress={user_logout} my={8}>
                        <Text bold color={'red'}>{t('LOGOUT')}</Text>
                    </Div>
                    <Text color={'muted'}>
                        {Platform.OS}: {Config.VERSION[Platform.OS]}
                    </Text>
                </Div>
            </Overlay>
        </Div>
    )
}
