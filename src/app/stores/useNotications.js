import { useState } from "react";
import { Platform } from 'react-native'
import PushNotificationIOS from "@react-native-community/push-notification-ios";

export default () => {
    const [notificationsCount, setNotificationCount] = useState(0)

    const set = count => {
        count = parseInt(count) || 0
        if(count < 0) count = 0
        setNotificationCount(count)
        if(Platform.OS === 'ios'){
            PushNotificationIOS.setApplicationIconBadgeNumber(count)
        }
    }

    const notifications_increment = (by = 1) => {
        set(notificationsCount + by)
    }

    const notifications_decrement = (by = 1) => {
        set(notificationsCount - by)
    }

    const notifications_set = (count) => {
        set(count)
    }

    const notifications_onReceived = (notification) => {
        console.log(notification)
        notifications_increment()
    }

    return {
        notificationsCount,
        notifications_increment,
        notifications_decrement,
        notifications_set,
        notifications_onReceived,
    }
}
