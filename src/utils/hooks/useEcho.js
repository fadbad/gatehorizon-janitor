import PusherNative from 'pusher-js/react-native';
import Echo from 'laravel-echo';

import Config from '../../Config'
import Vars from '../../Vars'

export default () => {
    let options = {
        encrypted: false,
        key: Config.PUSHER_KEY,
        wsHost: 'pusher.bitwize.com.lb',
        wsPort: 6001,
        disableStats: true,
        authEndpoint:  Config.BASE +'/broadcasting/auth',
        logToConsole: true,
        auth: {
            headers: {
                Authorization: `Bearer ${Vars.getToken()}`,
            },
        }
    };

    let PusherClient = new PusherNative(options.key, options);

    return new Echo({
        broadcaster: 'pusher',
        client: PusherClient,
        ...options
    });
};
