import React from 'react'
import { createDrawerNavigator, DrawerContentScrollView, useDrawerProgress } from "@react-navigation/drawer";
import Animated from "react-native-reanimated";
import { Div, Text, Icon, Image, Alert } from '../../ui'
import { useStore, useTranslation, width } from '../../utils'
import { LinearBg } from "../components";

import Layout from '../Layout';

import { 
    Home,
    Permits,
    PermanentAccess,
    Guests,
    Notifications,
    Support,
    Settings, 
    MyAccount
 } from "../screens";

const PAGES = [
    {name: 'HOME', Component: Home, icon: 'home'},
    {name: 'GUESTS', Component: Guests, icon: 'users'},
    {name: 'PERMITS', Component: Permits, icon: 'privacy'},
    {name: 'PERMANENT_GUESTS', Component: PermanentAccess, icon: 'user'},
    {name: 'NOTIFICATIONS', Component: Notifications, icon: 'bell'},
    {name: 'divider'},
    {name: 'SUPPORT', Component: Support, icon: 'phone'},
    {name: 'SETTINGS', Component: Settings, icon: 'settings'},
    {name: 'MY_ACCOUNT', Component: MyAccount},
]

const Drawer = createDrawerNavigator()

const CustomDrawerItem = ({ label, icon, isFocused, onPress }) => (
    <Div 
        row h={40} mb={12} align={'center'} r={8} pl={12}
        // bg={isFocused ? 'rgba(0, 0, 0, 0.1)' : null}
        bg={isFocused ? 'white' : null}
        onPress={onPress}
    >
        <Icon name={icon || 'bell'} size={20} color={isFocused ? 'secondary' : 'white'} />

        <Text ml={10} color={isFocused ? 'secondary' : 'white'} size={16}>
            {label}
        </Text>
    </Div>
)

const CustomDrawerContent = ({ navigation }) => {

    const { t } = useTranslation()
    const { selectedTab, setSelectedTab, user_logout, user } = useStore()
    const [logoutAlert, setLogoutAlert] = React.useState(false)


    return (
        <DrawerContentScrollView
            scrollEnabled={true}
            contentContainerStyle={{ flex: 1 }}
        >
            <Div f={1} px={15}>
                {/* close */}
                <Div align={'start'} justify={'center'}>
                    <Div center onPress={() => navigation.closeDrawer()}>
                        <Icon name={'close-circle'} size={18} color={'#ffffff64'} />
                    </Div>
                </Div>

                {/* profile */}
                <Div row align={'center'} mt={18} onPress={() => {
                    navigation.closeDrawer()
                    navigation.navigate('MY_ACCOUNT')
                }}>
                    <Image src={user.avatar} size={50} r={12} />
                    <Div ml={12}>
                        <Text color={'white'} size={16} lh={16} mb={5} lines={1} w={130}>
                            {user.name}
                        </Text>
                        <Text color={'white'} o={0.64} size={11} lh={11}>
                            {user.mobile}
                        </Text>
                        {/* <Text color={'white'} o={0.5} size={11} lh={11}>
                            Manage your profile
                        </Text> */}
                    </Div>
                </Div>

                {/* Drawer Items */}
                <Div f={1} mt={36}>
                    {PAGES.map(({ name, icon }, index) => {
                        if(name === 'divider') {
                            return (
                                <Div key={index *5000} h={1} my={24} ml={12} bg={'#fff'} o={0.1} />
                            )
                        } else if (name === 'MY_ACCOUNT') {
                            return null
                        } else {
                            return (
                                <CustomDrawerItem key={index * 5000}
                                    label={t(name)} 
                                    isFocused={selectedTab === name}
                                    icon={icon}
                                    onPress={() => {
                                        setSelectedTab(name)
                                        navigation.closeDrawer()
                                        navigation.navigate(name)
                                    }} 
                                />
                            )
                        }
                    })}
                </Div>

                {/* logout */}
                <Div mb={24}>
                    <CustomDrawerItem label={t('LOGOUT')} icon={'logout'} onPress={() => setLogoutAlert(true)} />
                </Div>
            </Div>

            <Alert 
                theme={'warning'}
                cancel={true}
				cancelText={t('CANCEL')}
                show={logoutAlert}
                hide={() => setLogoutAlert(false)}
				title={t('ARE_YOU_SURE')}
                subtitle={t('THIS_ACTION_WILL_LOG_YOU_OUT')}
                btn={t('YES_SURE')}
                onPress={async () => await user_logout() }
            />
        </DrawerContentScrollView>
    )
}

const getAnimatedStyle = () => {
    const progress = useDrawerProgress();

    const scale = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [1, 0.75]
    })

    const borderRadius = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [0, 60]
    })

    const rotateZ = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: ['0deg', '-10deg']
    })

    const animatedStyle = { borderRadius, transform: [{ scale, rotateZ }] }
    return animatedStyle
}

const CustomDrawer = () => {
    return (
        <Div f={1} bg={'secondary'}>

            <LinearBg type='drawer' speed={5000} />

            <Drawer.Navigator
                drawerType="slide"
                screenOptions={{
                    
                    swipeEnabled: true,
                    swipeEdgeWidth: width / 2 + 50,

                    headerShown: false,
                    overlayColor: 'transparent',
                    sceneContainerStyle: {
                        backgroundColor: 'transparent'
                    },
                    drawerStyle: {
                        flex: 1,
                        width: '64%',
                        paddingRight: 20,
                        backgroundColor: 'transparent'
                    }
                }}
                drawerContent={props => (
                        <CustomDrawerContent
                            navigation={props.navigation}
                        />
                    )
                }
                initialRouteName="Home"
            >
                
                {PAGES.map(({ name, Component, icon }, i) => (
                    <Drawer.Screen key={i * 999} name={name}>
                        {props => {
                            const animatedStyle = getAnimatedStyle()
                            return (
                                <Layout drawerAnimationStyle={animatedStyle}>
                                    <Component navigation={props.navigation} />
                                </Layout>
                            )
                        }}
                    </Drawer.Screen>
                ))}
            </Drawer.Navigator>
        </Div>
    )
}

export default CustomDrawer;
