import React from "react";
import { Div, Text, Icon, Image, CallWave } from '../../ui'
import { useStore, useApi, useTranslation, isEmpty } from '../../utils'
import { Header, Camera, Loader, Permanent, Permit } from "../components";

export default () => {
    const api = useApi()
    const { t } = useTranslation()

    const [loading, setLoading] = React.useState(false)
    const [process, setProcess] = React.useState('idle')
    const [code, setCode] = React.useState(null)
    const [result, setResult] = React.useState(null)

    const onReset = () => {
        setResult(null)
        setCode(null)
        setProcess('idle')
    }

    const onCodeChange = async () => {
        setLoading(true)
        setProcess('processing')
        const res = await api.post('/scan', { code })
        console.log(res)
        if(res?.result === 'success'){
            res.code = code
            setResult(res)
            setCode(null)
        } else {
            alert(res.message ?? 'Unable to reach server')
            onReset()
        }
        setLoading(false)
    }

    React.useEffect(() => {
        !isEmpty(code) && onCodeChange()
    }, [code])

    return (
        <Div f={1} bg={'secondary'}>
            <Header onPress={onReset}  />
            <Div f={1} bg={'light'} rt={24}>
                {(process === 'idle') ? (
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
                ) : (process === 'processing') ? (
                    <Div f={1}>
                        {
                            loading ? <Loader /> : 
                            result?.type === 'permit' ? (
                                <Permit 
                                    item={result?.item} 
                                    code={result?.code} 
                                    onAccept={() => {
                                        setResult(null)
                                        setProcess('idle')
                                    }}
                                    onReject={() => {
                                        setResult(null)
                                        setProcess('idle')
                                    }}
                                />
                            ) : result?.type === 'permanent' ? (
                                <Permanent 
                                    item={result?.item} 
                                    code={result?.code} 
                                    onAccept={() => {
                                        setResult(null)
                                        setProcess('idle')
                                    }}
                                    onReject={() => {
                                        setResult(null)
                                        setProcess('idle')
                                    }}
                                />
                            ) : (
                                <Div f={1} center onPress={() => setProcess('idle')}>
                                    <Text>Back</Text>
                                </Div>
                            )
                        }
                    </Div>
                ) : null}
                
                <Camera 
                    show={process === 'scanning'}
                    hide={onReset}
                    onRead={v => setCode(v) }
                />
            </Div>

        </Div>
    )
}
