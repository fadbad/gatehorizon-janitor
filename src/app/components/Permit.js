import React from "react";
import { Div, Text, Icon, Image, SIZES, Sheet, Spinner, Alert } from '../../ui'
import { useStore, useTranslation, useApi, moment, isEmpty } from '../../utils'
import { StatusCircle, DateCal, QrShare } from "../components";

export default ({item, show, hide, onDelete}) => {
    const api = useApi()
    const { t } = useTranslation()
    const [loading, setLoading] = React.useState(false)
    const [fresh, setFresh] = React.useState({})
    const [showDeleteAlert, setShowDeleteAlert] = React.useState(false)

    const [qr, setQr] = React.useState('')
    const [url, setUrl] = React.useState('')

    const __delete = () => {
        setShowDeleteAlert(false)
        onDelete && onDelete(item.id)
        setTimeout(() => {
            hide && hide()
        }, 300)
    }

    const boot = async () => {
        setLoading(true)
        const res = await api.post('/get-permit', {id: item?.id ?? 0})
        setLoading(false)
        if(res.result === 'success'){
            setFresh(res.item)
            setQr(res.qr)
            setUrl(res.url)
        } else {
            alert(res.message ?? 'unable to communicate with server')
        }
    }

    React.useEffect(() => {
        if(show) boot()
    }, [show])

    return (
        <Sheet
            show={show}
            hide={hide}
            bg={'light'}
            radius={24}
        >
            {show && <Div px={24} py={12}>
                <Div row center>
                    <Image src={item?.guest?.image} size={64} r={64} />
                    <Div f={1} ml={12}>
                        <Text size={24} lh={24} bold>{item?.guest?.name}</Text>
                        <Text size={16}>{item?.guest?.mobile}</Text>
                    </Div>

                    <DateCal date={item?.expected_at} ml={4} />

                </Div>

                <Div my={24}>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Div>
                            {(fresh?.status === 'pending') && (
                                <QrShare qr={qr} url={url} mobile={fresh?.guest?.mobile} mb={24} />
                            )}

                            <Div row center>
                                <StatusCircle status={fresh.status} mr={8} />
                                <Text size={24} lh={30}>{t(fresh?.status?.toUpperCase())}</Text>
                            </Div>
                            {!isEmpty(fresh.arrived_at) && (
                                <Div bg={'cyan'} r={8} mt={12} py={4} center>
                                    <Text>
                                        {t('ARRIVED_AT')}: {moment(fresh.arrived_at).format('DD MMM, YY @ HH:mm')}
                                    </Text>
                                </Div>
                            )}
                            {!isEmpty(fresh.accepted_at) && (
                                <Div bg={'primary'} r={8} mt={12} py={4} center>
                                    <Text>
                                        {t('ACCEPTED_AT')}: {moment(fresh.accepted_at).format('DD MMM, YY @ HH:mm')}
                                    </Text>
                                </Div>
                            )}
                        </Div>
                    )}
                </Div>
                {(!isEmpty(fresh) && fresh.canDelete) && (
                    <Div center onPress={() => setShowDeleteAlert(true)}>
                        <Text color={'red'}>{t('DELETE')}</Text>
                    </Div>
                )}
                
                <Alert 
                    theme={'danger'}
                    cancel={true}
                    show={showDeleteAlert}
                    hide={() => setShowDeleteAlert(false)}
                    title={t('ARE_YOU_SURE')}
                    subtitle={t('THIS_ACTION_CANNOT_BE_UNDONE')}
                    btn={t('YES_SURE')}
                    onPress={__delete}
                />

            </Div>}

        </Sheet>
    )
}
