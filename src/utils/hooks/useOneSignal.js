import { useEffect } from 'react'
import { Platform } from "react-native";
import OneSignal from 'react-native-onesignal';
import useStorage from './useStorage'
import useEvents from "./useEvents";
import Config from '../../Config'

export default ({ ids, received, opened, reboot = false }) => {
    const events = useEvents()
    const boot = async () => {
        OneSignal.setAppId(Config.ONESIGNAL);
        OneSignal.setLogLevel(6, 0);
		if(Platform.OS === 'ios'){
			setTimeout(() => {
				OneSignal.promptForPushNotificationsWithUserResponse(response => {
					console.log("Prompt response:", response);
				});
			}, 6000);
		}

        OneSignal.setNotificationWillShowInForegroundHandler(event => {
            console.log("notification will show in foreground:", event);
            let notification = event.getNotification();
            events.publish('notificationReceived', notification)
            //notification, complete, cancel
            received && received(notification, event.complete(notification), event.complete())
        });
        
        OneSignal.setNotificationOpenedHandler(notification => {
            opened && opened(
                notification.payload.additionalData, 
                notification, 
                notification.payload.body
            )
        });

        const deviceState = await OneSignal.getDeviceState();
        console.log('OneSignal Device State', deviceState)
        const storage = useStorage()
		if(deviceState.userId) {
			await storage.save('PLAYER_ID', deviceState.userId);
			ids && ids(deviceState.userId)
		}
    }

    useEffect( () => {
        boot()
    }, [])

    useEffect( () => {
        reboot && boot()
    }, [reboot])

}
