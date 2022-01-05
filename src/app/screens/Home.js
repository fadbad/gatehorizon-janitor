import React from "react";
import { Div, Text, Icon, Image, SIZES, CallWave, Modal, Gallery } from '../../ui'
import { useStore, useApi, useTranslation, isEmpty } from '../../utils'
import { Header, Camera, Loader, Permanent, Permit } from "../components";

const Result = ({item, type, code, setProcess}) => {
    return (type === 'permit') ? 
            <Permit item={item} code={code} setProcess={setProcess} /> : 
        (type === 'permanent') ? 
            <Permanent item={item} code={code} setProcess={setProcess} /> : 
        null
}

export default () => {
    const api = useApi()
    const { t } = useTranslation()
    const { user, user_logout } = useStore()

    const [loading, setLoading] = React.useState(false)
    const [process, setProcess] = React.useState('idle')
    const [code, setCode] = React.useState(null)
    const [result, setResult] = React.useState(null)

    const onCodeChange = async () => {
        setLoading(true)
        setProcess('processing')
        const res = await api.post('/scan', { code })
        if(res.result === 'success'){
            setResult(res)
        } else {
            alert(res.message ?? 'Unable to reach server')
            setResult(null)
            setProcess('idle')
        }
        console.log(res)
        setLoading(false)
    }

    React.useEffect(() => {
        !isEmpty(code) && onCodeChange()
    }, [code])

    return (
        <Div f={1} bg={'secondary'}>
            <Header logo />
            <Div f={1} bg={'light'} rt={24}>
                {(process === 'idle') && (
                    <Div f={1} bg={'primary'} center rt={24}>
                        <CallWave 
                            size={160} color={'white'}
                            onPress={() => setProcess('scanning')}
                        >
                            <Text size={36} lh={36} bold color={'secondary'}>
                                SCAN
                            </Text>
                        </CallWave>
                    </Div>
                )}

                {(process === 'processing') && (
                    <Div f={1}>
                        {
                            loading ? <Loader /> : 
                            result?.type === 'permit' ? (
                                <Permit 
                                    item={item} 
                                    code={code} 
                                />
                            ) : result?.type === 'permanent' ? (
                                <Permanent 
                                    item={item} 
                                    code={code} 
                                />
                            ) : null
                        }
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
