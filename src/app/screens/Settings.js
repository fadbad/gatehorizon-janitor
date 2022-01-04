import React from 'react'
import { Div, Text, Icon, COLORS, SIZES } from "../../ui";
import { useStore, useNavigation, Config, changeLang, useTranslation, Vars, empty, Platform, lighten, useFocusEffect, useFocused } from "../../utils";
import { Header, LinearBg } from "../components";
import { MotiView } from "moti";

const ListItem = ({icon, title, onPress, subtitle, hideArrow}) =>{
    return (
        <Div bg={'white'} mx={24} mb={12} p={12} r={8} row center onPress={onPress}>
            {!empty(icon) && (
                <Div size={36} r={8} mr={16} center bg={lighten(COLORS.orange, 0.4)}>
                    <Icon name={icon} size={22} color={'orange'} />
                </Div>
            )}

            <Div f={1}>
                <Text>{title}</Text>
				{!empty(subtitle) && (
					<Text size={14}>{subtitle}</Text>
				)}
            </Div>
			{!hideArrow && (
            	<Icon name={'right'} size={16} color={'muted'} />
			)}
        </Div>
    )
}

export default () => {
	const { t } = useTranslation()
    const { user_refetch } = useStore();
    const nav = useNavigation()

    const focused = useFocused()

	const boot = async () => await user_refetch()

	React.useEffect(() => {
		boot()
	}, [])

    const data = [
        {
            title: t('PERSONAL_INFO'), 
            icon: 'user2', 
            onPress: () => nav.navigate('LocalMyAccount', {withBack: true})
        },
        {
            title: Vars.lang == 'ar' ? 'English' : 'العربية', 
            icon: 'language', 
            onPress:() => changeLang(Vars.lang === 'ar' ? 'en' : 'ar'),
            // onPress: () => alert('SOON!')
        },
        {
            title: t('CHANGE_PASSWORD'), 
            icon: 'password', 
            onPress: () => nav.navigate('ChangePassword')
        },
        {
            title: t('ABOUT_GATEHORIZON'), 
            icon: null, 
            onPress: () => nav.navigate('Web', {
                title: t('ABOUT_GATEHORIZON'),
                url: Config.URLS.about,
            })
        },
        {
            title: t('PRIVACY_POLICY'), 
            icon: null, 
            onPress: () => nav.navigate('Web', {
                title: t('PRIVACY_POLICY'),
                url: Config.URLS.privacy,
            })
        },
    ]
    
    return (
        <Div f={1} bg={'secondary'}>
            {focused && <LinearBg />}
            <Header title={t('SETTINGS')} />
            <Div f={1} bg={'light'} rt={24}>
                <Div my={24}>
                    {focused && data.map((x, i) => (
                        <MotiView
                            key={`settings-${i}`}
                            from={{
                                opacity: 0,
                                transform: [
                                    {translateX: -SIZES.width},
                                    {translateY: -i * 30}
                                ]
                            }}
                            animate={{
                                opacity: 1,
                                transform: [
                                    {translateX: 0},
                                    {translateY: 0}
                                ]
                            }}
                            transition={{
                                type: 'spring',
                                delay: i * 120,
                                duration: 400,
                            }}
                        >
                            <ListItem 
                                title={x.title}
                                icon={x.icon}
                                onPress={x.onPress}
                            />
                        </MotiView>
                    ))}
                </Div>

				<Text center size={11} mb={16} color={'muted'} uppercase>
                    {Platform.OS}: {Config.VERSION[Platform.OS]}
                </Text>

            </Div>
        </Div>
    )
}
