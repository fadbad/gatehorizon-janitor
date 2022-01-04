if (!__DEV__) console.log = console.warn = console.error = () => {};
import 'react-native-gesture-handler';
import 'react-native-reanimated'

import React, {Suspense} from 'react'
import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()
import SplashScreen from 'react-native-splash-screen'
import { withTranslation, StoreProvider } from "./utils";

import App from './App'

const AppProvider = () => {
    React.useEffect(() => {
        SplashScreen.hide()
    }, [])

    return (
        <StoreProvider>
            <App /> 
        </StoreProvider>
    )
}

// export default AppProvider

export default withTranslation()(AppProvider);
