import React from "react";
import { Div, Text, Icon, Image, CallWave, Overlay } from '../../ui'
import { useStore, useApi, useTranslation, isEmpty, KeyboardSpacer } from '../../utils'
import { Header, Camera, Loader, Permanent, Permit, Group, Input } from "../components";

export default () => {
    const api = useApi()
    const { t } = useTranslation()

    const [loading, setLoading] = React.useState(false)
    const [process, setProcess] = React.useState('idle')
    const [code, setCode] = React.useState(null)
    const [result, setResult] = React.useState(null)

    const [showReject, setShowReject] = React.useState(false)
    const [rejection, setRejection] = React.useState('')
    const [rejectionText, setRejectionText] = React.useState('')

    const onReset = () => {
        setResult(null)
        setCode(null)
        setShowReject(false)
        setRejection('')
        setRejectionText('')
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
                                    onAccept={() => {
                                        setResult(null)
                                        setProcess('idle')
                                    }}
                                    onReject={() => setShowReject(true)}
                                />
                            ) : result?.type === 'permanent' ? (
                                <Permanent 
                                    item={result?.item} 
                                    code={result?.code} 
                                    onAccept={() => {
                                        setResult(null)
                                        setProcess('idle')
                                    }}
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
                hide={() => setShowReject(false)}
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
                        bg={'white'} px={12} py={8} r={8} center
                        disabled={isEmpty(rejection)}
                        o={isEmpty(rejection) ? 0.5 : 1}
                    >
                        <Text bold>{t('SAVE')}</Text>
                    </Div>

                    <Icon name={'close-filled'} size={24} absolute right={-28} top={-28} color={'secondary'} onPress={() => setShowReject(false)} />

                </Div>
            </Overlay>
        </Div>
    )
}
