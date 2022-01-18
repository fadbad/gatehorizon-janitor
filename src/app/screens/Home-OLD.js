import React from "react";
import { Div, Text, Icon, Spinner, CallWave, Overlay } from '../../ui'
import { useStore, useApi, useTranslation, isEmpty, KeyboardSpacer } from '../../utils'
import { Header, Camera, Loader, Group, Input } from "../components";
import { Permanent, Permit } from '../lib'

export default () => {
    const api = useApi()
    const { t } = useTranslation()

    const [loading, setLoading] = React.useState(false)
    const [process, setProcess] = React.useState('idle')
    const [code, setCode] = React.useState(null)
    const [result, setResult] = React.useState(null)

    const [showReject, setShowReject] = React.useState(false)
    const [loadingReject, setLoadingReject] = React.useState(false)
    const [rejection, setRejection] = React.useState('')
    const [rejectionText, setRejectionText] = React.useState('')

    const [loadingAccept, setLoadingAccept] = React.useState(false)

    const clearReject = () => {
        setLoadingReject(false)
        setShowReject(false)
        setRejection('')
        setRejectionText('')
    }

    const onReset = () => {
        setResult(null)
        setCode(null)
        setProcess('idle')
    }

    const getRejectionText = () => {
        return rejection === 'OTHER' ? rejectionText || rejection : rejection
    }

    const onReject = async () => {
        setLoadingReject(true)
        const res = await api.post('/accept-reject', {
            accept: false,
            reason: getRejectionText(),
            id: result?.permit_id,
            type: result?.type
        })
        if(res.result === 'success'){
            clearReject()
            onReset()
        } else {
            setLoadingReject(false)
            alert(res.message || 'Unable to communicate with server')
        }
    }

    const onAccept = async () => {
        setLoadingAccept(true)
        const res = await api.post('/accept-reject', {
            accept: true,
            id: result?.permit_id,
            type: result?.type
        })
        setLoadingAccept(false)
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
                    </Div>
                ) : (process === 'processing') ? (
                    <Div f={1}>
                        {
                            loading ? <Loader /> : 
                            result?.type === 'permit' ? (
                                <Permit 
                                    item={result?.item} 
                                    code={result?.code} 
                                    onAccept={onAccept}
                                    loadingAccept={loadingAccept}
                                    onReject={() => setShowReject(true)}
                                />
                            ) : result?.type === 'permanent' ? (
                                <Permanent 
                                    item={result?.item} 
                                    code={result?.code} 
                                    onAccept={onAccept}
                                    loadingAccept={loadingAccept}
                                    onReject={() => setShowReject(true)}
                                />
                            ) : (
                                <Div f={1} center onPress={() => setProcess('idle')}>
                                    <Text>{t('BACK')}</Text>
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
            
            <Overlay
                show={showReject}
                hide={clearReject}
                w={'95%'}
                bg={'red'}
                p={24}
            >
                <Div keyboarddismiss>
                    <Text h4 color={'white'} mb={12}>
                        {t('REJECTION_REASON')}
                    </Text>
                    <Group 
                        options={[
                            {value: 'COVID_RESTRICTIONS', text: t('COVID_RESTRICTIONS')},
                            {value: 'FACILITY_IS_TEMPORARY_CLOSED', text: t('FACILITY_IS_TEMPORARY_CLOSED')},
                            {value: 'ALLOWED_GUESTS_NUMBER_EXCEEDED', text: t('ALLOWED_GUESTS_NUMBER_EXCEEDED')},
                            {value: 'OTHER', text: t('OTHER')},
                        ]}
                        onChange={v => setRejection(v)}
                    />
                    {rejection === 'OTHER' && (
                        <>
                        <Input 
                            label={t('REJECTION_REASON')}
                            value={rejectionText}
                            onChange={v => setRejectionText(v)}
                            color={'white'}
                        />
                        <KeyboardSpacer />
                        </>
                    )}

                    <Div 
                        bg={'secondary'} px={12} py={8} r={8} center
                        disabled={loadingReject || isEmpty(rejection)}
                        o={isEmpty(rejection) ? 0.65 : 1}
                        onPress={onReject}
                    >
                        {loadingReject ? (
                            <Spinner color={'white'} />
                        ) : (
                            <Text bold color={'white'}>{t('SAVE')}</Text>
                        )}
                    </Div>

                    <Icon name={'close-filled'} size={24} absolute right={-28} top={-28} color={'secondary'} onPress={clearReject} />

                </Div>
            </Overlay>
        </Div>
    )
}
