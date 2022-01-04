import Sound from 'react-native-sound';

export default {
    success: new Sound(require('./sounds/success-jingle.wav')),
    popup: new Sound(require('./sounds/popup.mp3')),
    error: new Sound(require('./sounds/error.wav')),
}
