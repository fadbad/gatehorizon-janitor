import React from "react";
import { Div, Text, Icon, Image, Spinner } from '../../ui'
import { useStore, useApi, useNavigation, useTranslation, isEmpty, useReducer, uuid, useFocused } from '../../utils'
import { Header, LinearBg, YouAreAt } from "../components";

const DisplayGuests = ({ data = [], title = '' }) => (
    <Div center>
        {isEmpty(data) ? (
            <Text color={'muted'}>No {title} found</Text>
        ) : (
            <Div row center>
                {data.map((x, i) => (
                    <Div key={uuid()} size={48} ml={-16}>
                        <Image src={x.image} size={48} r={48} />
                    </Div>
                ))}
            </Div>
        )}
    </Div>
)

const Brick = ({
    onPress,
    title = '',
    icon = 'user',
    manageColor = 'secondary',
    manageText = 'Manage',
    children,
    rest
}) => (
    <Div r={24} bg={'white'} onPress={onPress} {...rest}>
        <Div row justify={'between'}>
            <Div
                row center px={16} py={6} 
            >
                <Icon name={icon} size={20} mr={8} />
                <Text size={14} bold>{title}</Text>
            </Div>

            <Div row >
                <Div
                    row center 
                    bg={manageColor} px={16} py={6}
                    rtr={24} rbl={24}
                >
                    <Text color={'white'} bold size={12} lh={12}>
                        {manageText}
                    </Text>
                    <Icon name={'right'} color={'white'} size={12} ml={4} />
                </Div>

            </Div>
        </Div>
        
        <Div p={16}>
            {children}
        </Div>
    </Div>
)

const PermitText = ({ title, num }) => (
    <Div f={1} row>
        <Text size={12} color={'muted'}>{title}:</Text>
        <Text bold ml={6} color={'secondary'}>{num}</Text>
    </Div>
)

export default () => {
    const nav = useNavigation()
    const api = useApi()
    const { t } = useTranslation()
    const { current_property_id } = useStore()

    const focused = useFocused()

    const defaultState = {
        loading: true,
        guests: [],
        permanent: [],
        today_count: 0,
        yesterday_count: 0,
        tomorrow_count: 0,
        pending_count: 0,
        accepted_count: 0,
        rejected_count: 0
    }

    const [state, setState] = useReducer(defaultState)

    const boot = async () => {
        setState(defaultState)
        const res = await api.post('/get-home', { property_id: current_property_id})
        if(res.result === 'success'){
            setState({
                guests: res.guests,
                permanent: res.permanent,
                today_count: res.today_count,
                yesterday_count: res.yesterday_count,
                tomorrow_count: res.tomorrow_count,
                pending_count: res.pending_count,
                accepted_count: res.accepted_count,
                rejected_count: res.rejected_count,
            })
        } else {
            alert(res.message || 'error occured')
        }
        setState({loading: false})
    }

    React.useEffect(() => {
        boot()
    }, [ , current_property_id])

    return (
        <Div f={1} bg={'secondary'}>
            
            {focused && <LinearBg type="home" />}

            <Header logo right={(
                <Div 
                    size={40} bg={'red'} center r={40}
                    onPress={() => nav.navigate('SOS')}
                >
                    <Text bold color={'white'}>SOS</Text>
                </Div>
            )} more={(
                <YouAreAt text={t('CURRENTLY_MANAGING')} />
            )} />

            <Div f={1} rt={24} bg={'light'} >
                {state.loading ? (
                    <Div f={1} center>
                        <Spinner />
                    </Div>
                ) : !focused ? null : (
                    <Div scroll p={24} onRefresh={boot}>

                        <Brick f={1}
                            title={t('PERMITS')}
                            manageText={t('MANAGE')}
                            icon={'privacy'}
                            manageColor={'primary'}
                            onPress={() => nav.navigate('LocalPermits', { 
                                withBack: true
                            })}
                        >
                            <Div row center bb py={6}>
                                <PermitText title={t('YESTERDAY')} num={state.yesterday_count} />
                                <PermitText title={t('TODAY')} num={state.today_count} />
                                <PermitText title={t('TOMORROW')} num={state.tomorrow_count} />
                                
                            </Div>
                            <Div row center py={6}>
                                <PermitText title={t('PENDING')} num={state.pending_count} />
                                <PermitText title={t('ACCEPTED')} num={state.accepted_count} />
                                <PermitText title={t('REJECTED')} num={state.rejected_count} />
                            </Div>
                        </Brick>
    
                        <Div h={24} />

                        <Brick 
                            title={t('PERMANENT_GUESTS')}
                            manageText={t('MANAGE')}
                            icon={'user'}
                            manageColor={'cyan'}
                            onPress={() => nav.navigate('LocalPermanentAccess', {
                                withBack: true
                            })}
                        >
                            <DisplayGuests data={state.permanent} title={t('PERMANENT_GUESTS')} />
                        </Brick>

                        <Div h={24} />

                        <Brick 
                            title={t('GUESTS')}
                            manageText={t('MANAGE')}
                            icon={'users'}
                            manageColor={'secondary'}
                            onPress={() => nav.navigate('LocalGuests', {
                                withBack: true
                            })}
                        >
                            <DisplayGuests data={state.guests} title={t('GUESTS')} />
                        </Brick>
                        
                    </Div>
                )}

            </Div>
        </Div>
    )
}
