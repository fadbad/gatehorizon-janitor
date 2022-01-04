import React from "react";
import { Div, Text, Icon, Modal, Sheet, SIZES, Alert } from '../../ui'
import { useStore, useApi, useTranslation, useReducer, empty } from '../../utils'
import { Input, PhoneInput, UploadPhoto, Btn, Group } from "../components";

export default ({ show, hide, onChange}) => {
    const { t } = useTranslation()
    const api = useApi()
    const NAME = React.useRef()
    const MOBILE = React.useRef()

    const defaultState = {
        relation: '',
        name: '',
        name_error: '',
        image: '',
        mobile: '',
        mobile_error: '',
        loading: false
    }
    const [state, setState] = useReducer(defaultState)

    const [showCloseAlert, setShowCloseAlert] = React.useState(false)

    const __close = () => {
        setShowCloseAlert(false)
        setTimeout(() => {
            setState(defaultState)
            hide && hide()
        }, 300)
    }

    const __save = async () => {
        console.log('SAVING')
        setState({loading: true})

        const res = await api.post('/add-permanent-guest', {
            name: state.name,
            mobile: state.mobile,
            image: state.image,
            relation: state.relation,
        })

        setState({loading: false})

        if(res.result === 'success'){
            onChange && onChange(res.item)
            __close()
        } else {
            alert(res.message ?? 'Unable to communicate with server')
        }
    }

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
            {show && <Div f={1} bg={'orange'} rt={24}>
                <Div row center px={24} py={12} bb>
                    <Div f={1}>
                        <Text h4 color={'white'}>{t('ADD_PERMANENT_GUEST')}</Text>
                    </Div>
                    <Icon name={'down'} color={'white'} onPress={() => setShowCloseAlert(true)} />
                </Div>
                <Div f={1} bg={'light'}>
                    
                    <Div scroll px={24}>
                        <Input select
                            label={t('RELATION')} 
                            options={[
                                {value: 'wife', text: t('WIFE')},
                                {value: 'husband', text: t('HUSBAND')},
                                {value: 'mother', text: t('MOTHER')},
                                {value: 'father', text: t('FATHER')},
                                {value: 'sister', text: t('SISTER')},
                                {value: 'brother', text: t('BROTHER')},
                                {value: 'kid', text: t('KID')},
                                {value: 'property_resident', text: t('PROPERTY_RESIDENT')},
                            ]}
                            value={'kid'}
                            onChange={o => setState({relation: o.value})}
                        />
                        <Input 
                            forwardedRef={NAME}
                            autoCorrect={false}
                            label={t('FULL_NAME')}
                            onChange={v => setState({
                                name: v,
                                name_error: v.length < 3 ? t('INAVLID_NAME') : ''
                            })}
                            value={state.name}
                            error={state.name_error}
                            onSubmitEditing={() => MOBILE?.current?.focus()}
                        />
                        <PhoneInput 
                            forwardedRef={MOBILE}
                            label={t('MOBILE')}
                            onChange={(v, err) => setState({mobile: v, mobile_error: err})}
                            value={state.mobile}
                        />

                        <Div h={24} />

                        <UploadPhoto 
                            label={t('PHOTO')}
                            help={t('A_CLEAR_SHOT_OF_GUEST_HEAD')}
                            onChange={v => setState({image: v})}
                        />

                        <Div h={48} />
                    
                    </Div>

                    <Div px={24}>
                        <Btn 
                            text={t('SAVE')} 
                            bg={'orange'}
                            onPress={__save} 
                            loading={state.loading}
                            disabled={
                                empty(state.name) || !empty(state.name_error) || empty(state.mobile) || !empty(state.mobile_error) || empty(state.image) || empty(state.relation)
                            } 
                        />
                    </Div>
                </Div>
            
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
