import React from "react";
import { StyleSheet } from 'react-native'
import { Div, Text, Icon } from '../../ui'
import { isEmpty, Vibration } from "../../utils";

import { Camera, useCameraDevices } from "react-native-vision-camera";
import { useScanBarcodes, BarcodeFormat } from "vision-camera-code-scanner";

export default ({ show, hide, onRead }) => {
    const [hasPermission, setHasPermission] = React.useState(false);
    const devices = useCameraDevices();
    const device = devices.back;

    const [type, setType] = React.useState('back')

    const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE]);

    React.useEffect(() => {
        if(isEmpty(barcodes)) return;
        const v = barcodes[0]?.displayValue
        Vibration.vibrate();
        onRead && onRead(v)
        hide && hide()
    }, [barcodes])

    React.useEffect(() => {
        (async () => {
          const status = await Camera.requestCameraPermission();
          setHasPermission(status === 'authorized');
        })();
    }, []);

    return !show ? null : (
        <Div f={1} bg={'black'} center absoluteFill>
            {(device != null && hasPermission) && (<Camera
                style={StyleSheet.absoluteFill}
                device={devices[type]}
                isActive={true}
                frameProcessor={frameProcessor}
                frameProcessorFps={5}
            />)}
            <Div absolute top={24} left={24} right={24}>
                <Div row align={'center'} justify={'between'}>
                    <Icon name={'reload'} color={'white'} size={36} onPress={() => setType(t => t === 'back' ? 'front' : 'back')} />
                    <Icon name={'close-circle'} color={'white'} size={36} onPress={hide} />
                </Div>
            </Div>
            <Icon name={'plus'} size={64} color={'red'} />
            {barcodes.map((barcode, idx) => (
                <Text key={idx} size={20} color={'white'} bold>
                    {barcode.displayValue}
                </Text>
            ))}
        </Div>
    );
}
