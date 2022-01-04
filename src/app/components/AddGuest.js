import React from "react";
import { Div, Text, Icon, Modal, Sheet, SIZES, Alert } from '../../ui'
import { useStore, useApi, useTranslation, useReducer, empty } from '../../utils'
import { Input, PhoneInput, UploadPhoto, Btn, Group } from "../components";

export default ({ show, hide, onChange, inset = 80}) => {
    const { t } = useTranslation()
    const api = useApi()
    const SCROLL = React.useRef()
    const NAME = React.useRef()
    const MOBILE = React.useRef()

    const [index, setIndex] = React.useState(null)
    const [showCloseAlert, setShowCloseAlert] = React.useState(false)

    const scrollTo = (i = 0) => {
        SCROLL?.current?.scrollTo({ x: i * SIZES.width, animated: true })
        setIndex(i)
    }

    const defaultState = {
        above18: true,
        type: '',
        name: '',
        mobile: '',
        company: '',
        reference: '',
        image: '',
        id_front: '',
        id_back: '',
        passport: '',
        passport_visa: '',

        name_error: '',
        mobile_error: '',
        loading: false
    }
    const [state, setState] = useReducer(defaultState)

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

        const res = await api.post('/add-guest', {
            above18: state.above18,
            type: state.type,
            name: state.name,
            mobile: state.mobile,
            company: state.company,
            reference: state.reference,
            image: state.image,
            id_front: state.id_front,
            id_back: state.id_back,
            passport: state.passport,
            passport_visa: state.passport_visa,
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
            inset={inset}
        >
            {show && <Div f={1} bg={'secondary'} rt={24}>
                <Div row center px={24} py={12} bb>
                    {index > 0 && (
                        <Icon name={'back'} color={'white'} onPress={() => scrollTo(index - 1)} mr={16} />
                    )}
                    <Div f={1}>
                        <Text h4 color={'white'}>{t('ADD_GUEST')}</Text>
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
                        <Div fs p={24}>
                            <Group mb={12}
                                options={[
                                    {text: t('ABOVE_18_YEARS'), value: true},
                                    {text: t('UNDER_18_YEARS'), value: false},
                                ]}
                                value={state.above18}
                                onChange={v => {
                                    setState({above18: v})
                                    scrollTo(!v ? 2 : 1)
                                }}
                            />
                        </Div>
                        <Div fs p={24}>
                            <Group 
                                options={[
                                    {text: t('LOCAL'), value: 'local'},
                                    {text: t('RESIDENT'), value: 'resident'},
                                    {text: t('TOURIST'), value: 'tourist'},
                                ]}
                                value={state.type}
                                onChange={v => {
                                    setState({type: v})
                                    scrollTo(2)
                                    NAME?.current?.focus()
                                }}
                            />
                        </Div>
                        <Div w={SIZES.width} px={24} pt={12}>
                            <Div scroll>
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
                                {state.above18 && (
                                    <>
                                        <Input 
                                            autoCorrect={false}
                                            label={t('COMPANY')} title={t('OPTIONAL')}
                                            onChange={v => setState({company: v})}
                                            value={state.company}
                                        />
        
                                        <Input 
                                            autoCorrect={false}
                                            label={t('REFERENCE')} title={t('OPTIONAL')}
                                            onChange={v => setState({reference: v})}
                                            value={state.reference}
                                        />
                                    </>
                                )}

                            </Div>

                            <Btn 
                                text={t('NEXT')} 
                                onPress={() => scrollTo(3)} 
                                disabled={empty(state.name) || !empty(state.name_error) || empty(state.mobile) || !empty(state.mobile_error)} 
                            />
                        </Div>

                        <Div w={SIZES.width} pt={24}>
                            <Div scroll px={24}>    
                                <UploadPhoto 
                                    label={t('PHOTO')}
                                    help={t('A_CLEAR_SHOT_OF_GUEST_HEAD')}
                                    onChange={v => setState({image: v})}
                                />
                                <Div h={50} />
                            </Div>
                            <Div px={24}>
                                <Btn 
                                    text={!state.above18 ? t('SAVE') : t('NEXT')} 
                                    onPress={() => !state.above18 ? __save() : scrollTo(4)} 
                                    disabled={empty(state.image)} 
                                    loading={!state.above18 ? state.loading : false} 
                                />
                                
                            </Div>
                        </Div>

                        <Div w={SIZES.width} pt={24}>
                            <Div scroll px={24}>
                                {(state.type === 'local' || state.type === 'resident') ? (
                                    <>
                                        <UploadPhoto
                                            label={t('ID_FRONT')}
                                            help={t('ID_FRONT_SCAN')}
                                            onChange={v => setState({id_front: v})}
                                        />
                                        <Div h={16} />
                                        <UploadPhoto
                                            label={t('ID_BACK')}
                                            help={t('ID_BACK_SCAN')}
                                            onChange={v => setState({id_back: v})}
                                        />
                                        
                                    </>
                                ) : (
                                    <>
                                        <UploadPhoto
                                            label={t('PASSPORT')}
                                            help={t('PASSPORT_MAIN_SCAN')}
                                            onChange={v => setState({passport: v})}
                                        />
                                        <Div h={16} />
                                        <UploadPhoto
                                            label={t('PASSPORT_VISA')}
                                            help={t('PASSPORT_ENTRY_SCAN')}
                                            onChange={v => setState({passport_visa: v})}
                                        />
                                        
                                    </>
                                )}
                                <Div h={50} />
                            </Div>
                            <Div px={24}>
                                <Btn 
                                    text={t("SAVE")} 
                                    onPress={__save} 
                                    disabled={(state.type === 'local' || state.type === 'resident') ? empty(state.id_front) || empty(state.id_back) : empty(state.passport) || empty(state.passport_visa)} 
                                    loading={state.loading} 
                                />
                            </Div>
                        </Div>
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
