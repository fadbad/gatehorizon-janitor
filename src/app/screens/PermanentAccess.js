import { t } from "i18next";
import React from "react";
import { Div, Text, Icon, Image, List, SwipeRow, Switch, ProgressBar, ProgressCircle } from '../../ui'
import { useStore, useTranslation, useApi, useRoute, useTimedToggle, empty, useFocused } from '../../utils'
import { Header, LinearBg, NotFound, YouAreAt, AddPermanentGuest, PermanentGuest } from "../components";

const Item = ({ item, onPress }) => {
    const api = useApi()
    const { t } = useTranslation()
    const [active, setActive] = React.useState(item.active);
    const toggle = async (isActive) => {
        const res = await api.post('toggle-permanent-guest', { id: item.id, active: isActive })
        if(res.result !== 'success') {
            alert(res.message || 'unable to communicate with server')
        }
    }
    return (
        <Div 
            row center bg={'white'} r={8} h={80} px={8} shadow={2} my={4}
            onPress={onPress} activeOpacity={1}
        >
            <Image src={item.image} size={48} r={48} />
            <Div f={1} ml={16}>
                <Text>{item.name}</Text>
                <Text size={12} lh={18} color={'muted'}>{t(item?.relation?.toUpperCase())}</Text>
                <Text size={11} lh={18} color={'muted'}>{item.mobile}</Text>
            </Div>
            <Div center mr={8}>
                <Text size={9} lh={9} mb={3} uppercase color={'muted'}>{t('ACTIVE?')}</Text>
                <Switch 
                    value={active} onChange={v => {
                        setActive(v)
                        toggle(v)
                    }} 
                />
            </Div>
        </Div>
    )
}

export default () => {
    const api = useApi()
    const { t } = useTranslation()
    const { current_property_id } = useStore()
    const focused = useFocused()

    const { params } = useRoute()
    const withBack = params?.withBack ?? false

    const [showAdd, setShowAdd] = React.useState(false)
    const [guest, setGuest] = React.useState({})
    const [showGuest, setShowGuest] = React.useState(false)

    const TOTAL_ALLOWED = 5
    const [total, setTotal] = React.useState(0)
    const [progress, setProgress] = React.useState(0)

    React.useEffect(() => {
        setProgress(total / TOTAL_ALLOWED)
    }, [total])

    const [prepend, setPrepend] = React.useState(null)
    const __add = v => {
        setPrepend(v)
        setTimeout(() => setPrepend(null), 100)

        setTotal(total => total + 1)
    }
    
    const [deleteId, setDeleteId] = React.useState(null)
    const __delete = async (id) => {
        const res = await api.post('delete-permanent-guest', { id })
        if(res.result === 'success'){
            setDeleteId(id)
            setTimeout(() => setDeleteId(null), 100)

            setTotal(total => total - 1)
        } else {
            alert(res.message || 'Unable to communicate with server')
        }
    }

    const [reload, doReload] = useTimedToggle()
    React.useEffect(() => {
        doReload()
    }, [current_property_id])

    return (
        <Div f={1} bg={'secondary'}>
            {focused && <LinearBg type="secondary" />}
            <Header 
                back={withBack}
                title={t('PERMANENT_GUESTS')}
                subtitle={t('UPTO_X_PERMANENT_GUESTS_ALLOWED', {number: TOTAL_ALLOWED})}
                right={( empty(current_property_id) || (total >= TOTAL_ALLOWED) ) ? null :(<Icon name={'plus'} size={32} color={'white'} onPress={() => setShowAdd(true)} />)} 
                more={(
                    <Div row center>
                        <Div f={1}>
                            <YouAreAt />
                        </Div>
                        <Div ml={8} mb={16}>
                            <ProgressCircle 
                                size={36} stroke={3}
                                progress={progress} 
                                text={`${total}/${TOTAL_ALLOWED}`}
                                textProps={{ bold: true, size: 12, color: 'white' }}
                                bg={'white'}
                            />
                        </Div>
                    </Div>
                )}
            />
            <Div f={1} rt={24} px={16} pt={16} bg={'light'}>
                
                {focused && <List
                    fetch={page => api.post('permanent-guests', { page, property_id: current_property_id })}
					autoTrigger={true}
                    render={({ item, index }) => (
                        <Item 
                            item={item} 
                            onPress={() => {
                                setShowGuest(true)
                                setGuest(item)
                            }} 
                        />
                    )}
                    empty={(<NotFound text={'No Permanent guests found'} />)}
                    reload={reload}
                    prepend={prepend}
                    deleteId={deleteId}
                    callback={ ({total}) => setTotal(total) }
                />}
            </Div>
            
            <PermanentGuest 
                item={guest} 
                bg={'primary'} 
                show={showGuest} 
                onDelete={__delete}
                hide={() => {
                    setShowGuest(false)
                    setGuest({})
                }} 
            />

            <AddPermanentGuest 
                show={showAdd} 
                hide={() => setShowAdd(false)} 
                onChange={(v) => __add(v)} 
            />
        </Div>
    )
}
