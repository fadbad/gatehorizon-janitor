import Pusher from 'pusher-js/react-native';
import Config from 'src/Config'


export default (log = false) => {

    Pusher.logToConsole = log;

    return new Pusher(Config.PUSHER_KEY, {
        cluster: Config.PUSHER_CLUSTER,
    });
}
