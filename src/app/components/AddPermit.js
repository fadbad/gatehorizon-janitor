import React from "react";
import { Keyboard } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { Div, Text, Icon, Image, Sheet, SIZES, Alert, List, COLORS } from '../../ui'
import { useStore, useApi, useDebounce, useTranslation, useReducer, empty, moment, Vars, useTimedToggle } from '../../utils'
import { SearchInput, Input, Btn, AddGuest, QrShare } from "../components";

const Guest = ({ item, onPress, withIcon, ...rest }) => (
    <Div
        row center bg={'white'} mx={8} my={4} r={8} px={12} py={8} shadow={2}
        onPress={onPress}
        {...rest}
    >
        <Image src={item.image} size={48} r={48} />
        <Div f={1} ml={16}>
            <Text>{item.name}</Text>
            <Text size={12} color={'muted'}>{item.mobile}</Text>
        </Div>
        {withIcon && (<Icon name={'right'} color={'mutedlight'} size={16} />)}
    </Div>
)

export default ({ show, hide, onChange}) => {
    const { t } = useTranslation()
    const { current_property_id } = useStore()
    const api = useApi()
    const SCROLL = React.useRef()

    const [showCloseAlert, setShowCloseAlert] = React.useState(false)
    const [showAddGuest, setShowAddGuest] = React.useState(false)
    
    const [index, setIndex] = React.useState(null)
    const scrollTo = (i = 0) => {
        SCROLL?.current?.scrollTo({ x: i * SIZES.width, animated: true })
        setIndex(i)
    }

    const defaultState = {
        guest: {},
        expected_at: '',
        __date: moment().add(3, 'hours').toDate(),
        reason: '',
        loading: false
    }
    const [state, setState] = useReducer(defaultState)

    const __close = () => {
        setShowCloseAlert(false)
        setState(defaultState)
        setTimeout(() => {
            hide && hide()
        }, 300)
    }

    const [qr, setQr] = React.useState('')
    const [url, setUrl] = React.useState('')

    const __save = async () => {
        console.log('SAVING')
        setState({loading: true})

        const res = await api.post('/add-permit', {
            property_id: current_property_id,
            guest_id: state.guest?.id,
            expected_at: state.expected_at,
            reason: state.reason,
        })

        setState({loading: false})

        if(res.result === 'success'){
            onChange && onChange(res.item)

            setQr(res.qr)
            setUrl(res.url)
            scrollTo(3)
            Keyboard.dismiss()
            // __close()
        } else {
            alert(res.message ?? 'Unable to communicate with server')
        }
    }

    const [prepend, setPrepend] = React.useState(null)
    const __add = v => {
        setPrepend(v)
        setTimeout(() => setPrepend(null), 100)
    }

    const [reload, doReload] = useTimedToggle()
    const [search, setSearch] = React.useState('')

    useDebounce(doReload, 350, [search]);

    return (
        <Sheet 
            show={show} 
            hide={hide} 
            scrollable 
            closable={false} 
            draggable={false}
            bg={'light'}
            radius={24}
        >
            {show && <Div f={1} bg={'primary'} rt={24}>
                <Div row center px={24} py={12} bb>
                    {index > 0 && (
                        <Icon name={'back'} color={'white'} onPress={() => scrollTo(index - 1)} mr={16} />
                    )}
                    <Div f={1}>
                        <Text h4 color={'white'}>{t('ADD_PERMIT')}</Text>
                    </Div>
                    <Icon name={'down'} color={'white'} onPress={() => setShowCloseAlert(true)} />
                </Div>
                <Div f={1} bg={'light'}>
                    <Div 
                        forwardedRef={SCROLL} 
                        scroll horizontal 
                        bounces={false} scrollEnabled={false}
                        pagingEnabled={true}
                        decelerationRate={0}
                        snapToInterval={SIZES.width}
                        snapToAlignment={"center"}
                    >
                        <Div fs>
                            <Div row center bg={'light'} mb={4}>
                                <Div f={1} px={12}>
                                    <SearchInput color={'secondary'} onChange={ v => setSearch(v) } />

                                </Div>
                                <Div 
                                    bg={'secondary'} px={12} py={4} mx={8} r={4} 
                                    row center
                                    onPress={() => setShowAddGuest(true)}
                                >
                                    <Icon name={'plus'} color={'white'} size={16} mr={8} />
                                    <Text color={'white'} size={12} bold>
                                        {t('NEW_GUEST')}
                                    </Text>
                                </Div>
                            </Div>
                            <List 
                                fetch={page => api.post('guests', { page, search })}
                                autoTrigger={true}
                                render={({ item, index }) => (
                                    <Guest withIcon item={item} onPress={() => {
                                        setState({guest: item})
                                        scrollTo(1)
                                    }} />
                                )}
                                empty={(
                                    <Div f={1} center>
                                        <Btn title={t('NEW_GUEST')} />
                                    </Div>
                                )}
                                reload={reload}
                                prepend={prepend}
                            />
                        </Div>


                        <Div fs p={24}>
                            {/* <Guest item={state.guest} r={8} bg={'light'} shadow={0} /> */}
                            <Text h5 mb={6} color={'muted'}>
                                {t('Giving permit to')}:
                            </Text>
                            <Text h3 mb={12}>
                                {state.guest?.name}
                            </Text>
                            
                            <Text h4 mb={12} color={'secondary'}>
                                {t('WHEN?')}
                            </Text>
                            <Div center bg={'white'} r={8}>  
                                <DatePicker 
                                    mode={'datetime'}
                                    locale={Vars.lang}
                                    date={state.__date}
                                    minuteInterval={5}
                                    onDateChange={v => setState({
                                        __date: v,
                                        expected_at: moment(v).format('YYYY-MM-DD HH:mm:00')
                                    })}
                                    minimumDate={moment().toDate()}
                                    textColor={COLORS.secondary}
                                />

                            </Div>

                            <Btn text={t('NEXT')} disabled={empty(state.expected_at)} onPress={() => scrollTo(2)} />
                        </Div>


                        <Div fs p={24}>
                            <Text h4 mb={6} color={'muted'}>
                                {t('GIVING_PERMIT_TO')}:
                            </Text>
                            <Text h3 mb={12}>
                                {state.guest?.name}
                            </Text>
                            <Text h4>
                                {moment(state.expected_at).format('DD MMM, YYYY @ HH:mm')}
                            </Text>

                            <Input 
                                label={t('REASON')}
                                title={t('OPTIONAL')}
                                onChange={v => setState({reason: v})}
                            />
                            <Btn text={t('SEND')} onPress={__save} loading={state.loading} />
                        </Div>

                        <Div fs p={24}>
                            <Text h4 mb={6} color={'muted'}>
                                {t('PERMIT_TO')}:
                            </Text>
                            <Text h3 mb={12}>
                                {state.guest?.name}
                            </Text>
                            <Text h4>
                                {moment(state.expected_at).format('DD MMM, YYYY @ HH:mm')}
                            </Text>
                            
                            <Div h={24} />
                            
                            <QrShare qr={qr} url={url} mobile={state?.guest?.mobile} />
                            
                            <Div absolute right={12} top={12} onPress={hide}>
                                <Icon name={'close-filled'} size={24} color={'muted'} />
                            </Div>
                        </Div>
                        
                    </Div>
                </Div>
                
                <AddGuest 
                    show={showAddGuest} 
                    hide={() => setShowAddGuest(false)} 
                    onChange={(v) => __add(v)} 
                    inset={120}
                />

                <Alert 
                    cancel={true}
                    show={showCloseAlert}
                    hide={() => setShowCloseAlert(false)}
                    title={t('ARE_YOU_SURE')}
                    subtitle={t('THIS_ACTION_CANNOT_BE_UNDONE')}
                    btn={t('YES_SURE')}
                    onPress={__close}
                />

            </Div>}

        </Sheet>
    )
}
