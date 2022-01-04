import React from "react";
import { Div, Text, Icon, Image, Spinner } from '../../ui'
import { useStore, useApi, useTranslation } from '../../utils'
import { Header } from "../components";
import { Camera, Loader } from "../components";

export default () => {
    const api = useApi()
    const { t } = useTranslation()
    const { user, user_logout } = useStore()

    const [process, setProcess] = React.useState('idle')
    const [code, setCode] = React.useState(null)

    return (
        <Div f={1} bg={'secondary'}>
            <Header logo />
            <Div f={1} bg={'light'} rt={24}>
                {(process === 'idle') && (
                    <Div f={1} bg={'primary'} center rt={24}>
                        <Div 
                            size={160} r={160} center bg={'white'}
                            onPress={() => setProcess('scanning')}
                        >
                            <Text size={36} lh={36} bold color={'secondary'}>
                                SCAN
                            </Text>
                        </Div>
                    </Div>
                )}

                {(process === 'processing') && (
                    <Div f={1}>
                        <Loader />
                    </Div>
                )}
                
                <Camera 
                    show={process === 'scanning'}
                    hide={() => setProcess('idle')}
                    onRead={v => {
                        setCode(v)
                        setProcess('processing')
                    }}
                />
            </Div>

        </Div>
    )
}
