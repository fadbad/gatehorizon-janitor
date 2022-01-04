import React from "react";
import { Div, Text, Icon, Image, Spinner } from '../../ui'
import { useStore, useApi, useTranslation } from '../../utils'
import { Header } from "../components";
import { Camera, Btn } from "../components";

export default () => {
    const api = useApi()
    const { t } = useTranslation()
    const { user, user_logout } = useStore()

    const [showCamera, setShowCamera] = React.useState(false)

    return (
        <Div f={1} bg={'secondary'}>
            <Header logo />
            <Div f={1} bg={'light'} rt={24}>
                <Btn text={'Show Camera'} onPress={() => setShowCamera(true)} />
                <Camera 
                    show={showCamera}
                    hide={() => setShowCamera(false)}
                    onRead={v => console.log(v)}
                />

            </Div>
        </Div>
    )
}
