import React from "react";
import { Div, Text, Icon, Image, Sheet, Alert, List } from '../../ui'
import { useStore, useTranslation, useApi, useTimedToggle, isEmpty, moment } from '../../utils'
import { DateCal, StatusCircle } from '../components'

export default ({item, show, hide, onDelete}) => {
    const { t } = useTranslation()
    const api = useApi()
    const { current_property_id } = useStore()
    const [reload, doReload] = useTimedToggle()
    const [showDeleteAlert, setShowDeleteAlert] = React.useState(false)

    const __delete = () => {
        setShowDeleteAlert(false)
        onDelete && onDelete(item.id)
        setTimeout(() => {
            hide && hide()
        }, 300)
    }

    React.useEffect(() => {
        if(show) doReload()
    }, [show])

    return (
        <Sheet
            scrollable
            show={show}
            hide={hide}
            bg={'light'}
            radius={24}
        >
            {show && <Div px={24} py={12} f={1}>
                <Div row center>
                    <Image src={item.image} size={64} r={64} />
                    <Div f={1} ml={24}>
                        <Text size={24} lh={24} bold>{item.name}</Text>
                        <Text size={16}>{item.mobile}</Text>
                        <Text size={16}>{t(item?.type?.toUpperCase())}</Text>
                    </Div>
                    <Div absolute right={0} top={0} onPress={hide}>
                        <Icon name={'close-filled'} size={24} color={'muted'} />
                    </Div>
                </Div>

                <Div f={1} my={12} r={24}>
                    <List 
                        fetch={page => api.post('/guest-permits', {
                            id: item.id,
                            property_id: current_property_id,
                            page
                        })}
                        render={({item, index}) => (
                            <Div row my={4}>
                                <DateCal date={item.expected_at} mr={4} />
                                <Div f={1} p={8} h={60} justify={'center'} bb>
                                    <Div row align={'center'}>
                                        <StatusCircle size={18} status={item.status} mr={8} />
                                        <Text>{t(item?.status?.toUpperCase())}</Text>

                                    </Div>

                                    <Div row>
                                        {!isEmpty(item.arrived_at) && (
                                            <Text size={12} color={'muted'} mr={8}>
                                                {t('ARRIVED_AT')}: {moment(item.arrived_at).format('HH:mm')}
                                            </Text>
                                        )}
                                        {!isEmpty(item.accepted_at) && (
                                            <Text size={12} color={'muted'}>
                                                {t('ACCEPTED_AT')}: {moment(item.accepted_at).format('HH:mm')}
                                            </Text>
                                        )}
                                    </Div>

                                </Div>
                            </Div>
                        )}
                        reload={reload}
                    />
                </Div>

                <Div center onPress={() => setShowDeleteAlert(true)}>
                    <Text color={'red'}>{t('DELETE')}</Text>
                </Div>
            
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
