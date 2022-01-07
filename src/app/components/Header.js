import { t } from 'i18next'
import React from 'react'
import { Div, Text, Icon, Image, Overlay } from '../../ui'
import { empty, useStore, Config, Platform, Vars, changeLang } from '../../utils'

export default ({ onPress }) => {

    const { user, user_logout } = useStore()
    const [showSettings, setShowSettings] = React.useState(false)

    return (
        <Div z={2}>
            <Div safe barcolor={'light'}>
                <Div row px={24} py={12} center>
                    <Div size={40} onPress={onPress}>
                        <Image src={'logo'} size={40} contain color={'white'} />
                    </Div>
                    <Div f={1} align={'end'} onPress={() => setShowSettings(true)}>
                        <Div row align={'center'} justify={'end'}>
                            <Div align={'end'}>
                                <Text color={'white'} size={16}>
                                    {user.name}
                                </Text>
                                <Text color={'white'} size={12} lh={14}>
                                    {user.compoundName}
                                </Text>

                            </Div>
                            <Icon name={'user'} color={'primary'} size={32} ml={12} />
                        </Div>
                    </Div>
                </Div>
            </Div>

            <Overlay
                show={showSettings}
                hide={() => setShowSettings(false)}
                w={'80%'} p={24}
                bg={'primary'}
            >
                <Div>
                    <Div center bb mb={8} pb={8}>
                        <Text color={'secondary'}>{user.name}</Text>
                    </Div>

                    <Div center bb mb={8} pb={8}
                        onPress={() => changeLang(Vars.lang === 'ar' ? 'en' : 'ar')} 
                    >
                        <Text bold color={'secondary'}>
                            {Vars.lang == 'ar' ? 'English' : 'العربية'}
                        </Text>
                    </Div>

                    <Div center bb mb={8} pb={8} onPress={user_logout}>
                        <Text bold color={'secondary'}>
                            {t('LOGOUT')}
                        </Text>
                    </Div>
                    <Div center>
                        <Text color={'muted'}>
                            {Platform.OS}: {Config.VERSION[Platform.OS]}
                        </Text>
                    </Div>

                    <Icon name={'close-filled'} size={24} absolute right={-28} top={-28} color={'secondary'} onPress={() => setShowSettings(false)} />
                </Div>
            </Overlay>
        </Div>
    )
}
