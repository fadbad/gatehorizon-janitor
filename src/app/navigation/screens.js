import React from 'react'
import { width } from "../../utils";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

import CustomDrawer from './CustomDrawer';

import { 
    Onboarding,
    Login,
    SOS,
    Web,
    ChangePassword,
    Permits,
    Guests,
    PermanentAccess,
    Support,
    Settings,
    MyAccount,
 } from "../screens";

const PAGES = [
    {name: 'Main', component: CustomDrawer},
    {name: 'SOS', component: SOS},
    {name: 'Web', component: Web},
    {name: 'ChangePassword', component: ChangePassword},

    {name: 'LocalPermits', component: Permits},
    {name: 'LocalGuests', component: Guests},
    {name: 'LocalPermanentAccess', component: PermanentAccess},
    {name: 'LocalSupport', component: Support},
    {name: 'LocalSettings', component: Settings},
    {name: 'LocalMyAccount', component: MyAccount},
]

const screenOptions = {
    headerShown: false,
    cardShadowEnabled: false,
    gestureEnabled: true,
    gestureResponseDistance: width / 2 + 50,
}

const BoardingNavigator = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="Onboarding" component={Onboarding} />
    </Stack.Navigator>
)

const AuthNavigator = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
)

const AppNavigator = () => (
    <Stack.Navigator screenOptions={screenOptions} initialRouteName={'Main'}>
        {PAGES.map((item, index) => (
            <Stack.Screen 
                key={`SCREEN-${index}`}
                name={item.name} 
                component={item.component}
            />
        ))}
    </Stack.Navigator>
)

export {
    BoardingNavigator,
    AuthNavigator,
    AppNavigator,
}
