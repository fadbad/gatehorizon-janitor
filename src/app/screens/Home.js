import React from "react";
import { Div, Text, Icon, Spinner, CallWave } from '../../ui'
import { useStore, useApi, useTranslation, isEmpty } from '../../utils'
import { Header, Camera, Loader } from "../components";
import { Permanent, Permit, PermitGroup, Employee, Search } from "../lib";

export default () => {
    const api = useApi()
    const { t } = useTranslation()

    const [loading, setLoading] = React.useState(false)
    const [process, setProcess] = React.useState('idle')
    const [code, setCode] = React.useState(null)
    const [result, setResult] = React.useState(null)

    const [loadingIn, setLoadingIn] = React.useState(false)
    const [loadingOut, setLoadingOut] = React.useState(false)
    const [showList, setShowList] = React.useState(false)

    const onReset = () => {
        setResult(null)
        setCode(null)
        setProcess('idle')
    }

    const onCheckIn = async () => {
        setLoadingIn(true)
        const res = await api.post('/check-in-out', {
            mode: 'in',
            id: result?.permit_id,
            type: result?.type
        })
        setLoadingIn(false)
        if(res.result === 'success'){
            onReset()
        } else {
            alert(res.message || 'Unable to communicate with server')
        }
    }

    const onCheckOut = async () => {
        setLoadingOut(true)
        const res = await api.post('/check-in-out', {
            mode: 'out',
            id: result?.permit_id,
            type: result?.type
        })
        setLoadingOut(false)
        if(res.result === 'success'){
            onReset()
        } else {
            alert(res.message || 'Unable to communicate with server')
        }
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
                                {t('SCAN')}
                            </Text>
                        </CallWave>

                        <Div
                            size={64} r={64} bg={'secondary'} center
                            absolute bottom={30} right={10}
                            onPress={() => setShowList(true)}
                        >
                            <Icon name={'privacy'} color={'white'} />
                        </Div>
                    </Div>
                ) : (process === 'processing') ? (
                    <Div f={1}>
                        {
                            loading ? <Loader /> : 
                            result?.type === 'permit' ? (
                                <Permit 
                                    item={result?.item} 
                                    code={result?.code}
                                    onReset={onReset}
                                />
                            ) : result?.type === 'grouppermit' ? (
                                <PermitGroup
                                    item={result?.item} 
                                    code={result?.code}
                                    onReset={onReset}
                                />
                            ) : result?.type === 'permanent' ? (
                                <Permanent 
                                    item={result?.item} 
                                    code={result?.code} 
                                    onReset={onReset}
                                />
                            ) : result?.type === 'staff' ? (
                                <Employee 
                                    item={result?.item} 
                                    code={result?.code} 
                                    onReset={onReset}
                                />
                            ) : (
                                <Div f={1} center onPress={() => setProcess('idle')}>
                                    <Text>{t('BACK')}</Text>
                                </Div>
                            )
                        }
                    </Div>
                ) : null}

                <Search 
                    show={showList}
                    hide={() => setShowList(false)}
                    onCheckOut={onCheckOut}
                    loadingOut={loadingOut}
                />
                
                <Camera 
                    show={process === 'scanning'}
                    hide={onReset}
                    onRead={v => setCode(v) }
                />
            </Div>
            
        </Div>
    )
}
