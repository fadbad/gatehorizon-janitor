import React from 'react'
import { Div, Text, PinCode, Icon, SIZES, COLORS, TextField, Image, IMAGES, Spinner, CountDown, Alert } from "../../ui";
import { useStore, validSaudiPhone, KeyboardSpacer, useReducer, useLayoutAnimation, alert, useTranslation, isRTL, a2e } from '../../utils'
import { LinearBg } from "../components";

export default () => {

    const { setAuthModal, user_login, user_register, user_resend, user_resend_token, user_verify, toast_show } = useStore()
	const { t } = useTranslation()

    const defaultState = {
        type: 'login',
        name: '',
        mobile: '',
        password: '',
        code: '',
        errPhone: '',
        errName: '',
        errPassword: '',
        errCode: '',
        USER: null,
        loading: false
    }
    const [state, setState] = useReducer(defaultState)
    const PINCODE = React.useRef()
    const SCROLL = React.useRef()
    const PHONEREF = React.useRef()

    React.useEffect(() => {
        setTimeout(() => {
            PHONEREF.current?.focus()
            // showPinCode()
        }, 800)
    }, [])

    useLayoutAnimation([state.type], 300)

    const showPinCode = () => SCROLL?.current?.scrollTo({x: SIZES.width})

    const validate = async () => {
        let errors = false
        const isValid = validSaudiPhone(`${state.mobile}`) || (state.mobile === '96678905006') || (state.mobile === '9663443568')
        if(!isValid){
            setState({errPhone: `${state.mobile} ${t('IS_NOT_A_VALID_SAUDI_NUMBER')}`})
            errors = true
        }
        if(state.type === 'login' || state.type === 'register') {
            if(state.type === 'register'){
                if(state.name.trim().length <= 2){
                    setState({errName: t('NAME_IS_REQUIRED')})
                    errors = true
                }
            }

            if(state.password.trim().length < 6){
                setState({errPassword: t('PASSWORD_IS_REQUIRED_MIN_LENGTH_6_CHARACTERS')})
                errors = true
            }
        }
        if(errors) return false;

        setState({loading: true})

        if(state.type === 'login'){
            const login = await user_login(state.mobile, state.password)
            setState({loading: false})
            if(login.result === 'success'){
                toast_show(`${t('WELCOME')} ${login.user?.name}`)
                setTimeout(() => setAuthModal(false), 100)
            } else {
                alert(t('ERROR_OCCURED'), login.message)
            }
        }

        if(state.type === 'register'){
            const register = await user_register({
                mobile: state.mobile,
                name: state.name,
                password: state.password,
            });
            setState({loading: false})
            if(register.result === 'success'){
                setState({USER: register?.user})
                showPinCode()
                setTimeout(() => PINCODE.current.focus(), 900)
            } else {
                alert(t('ERROR_OCCURED'), register.message)
            }
        }

        if(state.type === 'resend'){
            const resend = await user_resend(state.mobile)
            setState({loading: false})
            if(resend.result == 'success'){
                alert(t('SUCCESS'), t('WE_RESET_YOUR_PASSWORD_AND_SENT_IT_TO_YOUR_MOBILE'))
            } else {
                alert(t('ERROR_OCCURED'), resend.message)
            }
        }
    }

    const verify_code = async (code) => {
        const res = await user_verify(code, state.USER)
        if(res.result == 'success'){
            toast_show(`${t('WELCOME')} ${state.USER?.name}`)
            setTimeout(() => setAuthModal(false), 100)
        } else {
            PINCODE.current.shake()
            setState({code: ''})
        }
    }

    const switchTo = type => {
        const mobile = state.mobile
        setState({...defaultState, mobile, type})
    }

    const headerText = () => {
        if(state.type === 'resend'){
            return t('RESEND_PASSWORD')
        } else if(state.type === 'register'){
            return t('REGISTER')
        } else {
            return t('LOGIN')
        }
    }

	const [loadingResend, setLoadingResend] = React.useState(false)
	const [canResend, setCanResend] = React.useState(true)

	const resend_code = async () => {
		setLoadingResend(true)
		await user_resend_token()
		setLoadingResend(false)
		setCanResend(false)
	}

    return (
        <Div scroll horizontal forwardedRef={SCROLL} bounces={false} scrollEnabled={false}>
        
            <Div fs bg={'secondary'}>
                <LinearBg type='login' />
                <Div safe f={1} center>
                    <Image src={IMAGES.logo} h={50} />
                    <Div fw px={18} mt={24}>
                    <Div p={20} fw bg={'white'} r={16}>
                        <Div fw>
                            <Text h3>
                                { headerText() }
                            </Text>
                            <TextField 
                                // autoFocus={true}
                                ref={PHONEREF}
                                keyboardType="number-pad"
                                prefix={!isRTL ? '+966' : ''}
                                suffix={isRTL ? '+966' : ''}
                                // baseColor={'#fff'}
                                tintColor={COLORS.primary}
                                textColor={COLORS.black}
                                label={t('PHONE_NUMBER')}
                                title={t('WE_ONLY_SUPPORT_SAUDI_NUMBERS')}
                                characterRestriction={9}
                                value={state.mobile}
                                onChangeText={v => setState({mobile: `966${v}`})}
                                onSubmitEditing={validate}
                                formatText={v => a2e(v)}
                                error={state.errPhone}
                                errorColor={COLORS.red}
                                style={{
                                    textAlign: 'left'
                                }}
                            />
                            {(state.type === 'register') && (
                                <TextField 
                                    tintColor={COLORS.primary}
                                    textColor={COLORS.black}
                                    label={t('YOUR_NAME')}
                                    autoCorrect={false}
                                    onChangeText={v => setState({name: v})}
                                    error={state.errName}
                                    errorColor={COLORS.red}
                                />
                            )}
                            {(state.type !== 'resend') && (
                                <TextField 
                                    secureTextEntry
                                    tintColor={COLORS.primary}
                                    textColor={COLORS.black}
                                    label={t('PASSWORD')}
                                    title={t('MIN_6_CHARACTERS')}
                                    onChangeText={v => setState({password: v})}
                                    error={state.errPassword}
                                    errorColor={COLORS.red}
                                />
                            )}
                        </Div>

                        <Div 
                            fw py={10} my={20} r={5} bg={'primary'} center 
                            disabled={state.loading}
                            onPress={validate}
                        >
                            {state.loading ? (
                                <Spinner color={'#fff'} />
                            ) : (
                                <Text bold color={'white'}>
                                    { headerText() }
                                </Text>
                            )}
                                
                        </Div>
                        
                        {(state.type === 'login') ? (
                            <Div row fw center>
                                <Div mx={10} onPress={() => switchTo('register')}>
                                    <Text color={'primary'}>
                                        {t('REGISTER')}
                                    </Text>
                                </Div>
                                <Div mx={10} onPress={() => switchTo('resend')}>
                                    <Text color={'primary'}>
                                        {t('RESET_PASSWORD')}
                                    </Text>
                                </Div>
                            </Div>
                        ) : (
                            <Div row fw center>
                                <Div mx={10} onPress={() => switchTo('login')}>
                                    <Text color={'primary'}>
                                        {t('LOGIN')}
                                    </Text>
                                </Div>
                            </Div>
                        )}
                        
                        <Div h={16} />
                    </Div>
                </Div>
                </Div>
                <KeyboardSpacer />
                <Image src={'login-bottom'} fw h={100} />
            </Div>
            <Div fs bg={'secondary'}>
                <LinearBg type='login' />
                <Div f={1} center>
                    <Image src={IMAGES.logo} h={50} />
                    <Div h={50} />
                    <PinCode
                        ref={PINCODE}
                        autoFocus={true}
                        codeLength={4}
                        cellSpacing={9}
                        cellStyle={{
                            // borderBottomWidth: 3,
                            // borderColor: '#ffffff99',
                            backgroundColor: COLORS.light,
                            borderRadius: 5,
                        }}
                        cellStyleFocused={{
                            backgroundColor: '#fff',
                        }}
                        textStyle={{color: COLORS.secondary, fontSize: 28}}
                        value={state.code}
                        onTextChange={code => setState({code})}
                        onFulfill={(code) => verify_code(code)}
                    />
                    <Div center my={16}>
                        <Text color={'#fff'} size={13}>
                            {t('ENTER_THE_TOKEN_YOU_RECEIVED_ON_YOUR_MOBILE')}
                        </Text>
                    </Div>

                    <Div center 
                        onPress={canResend ? () => resend_code() : null}
                        px={16} py={8} r={4}
                        disabled={!canResend}
                    >
                        {loadingResend ? (
                            <Spinner />
                        ) : (
                            <Text color={canResend ? 'primary' : '#ffffff88'}>
                                {t('RESEND_TOKEN')}
                            </Text>
                        )}
                    </Div>

                    {!canResend && (
                        <Div row center mt={16}>
                            <Text color={'white'} mr={10} size={12}>
                                {t('YOU_CAN_RESEND_TOKEN_IN')}
                            </Text>
                            <CountDown 
                                minutes={1}
                                finished={''}
                                onEnd={() => setCanResend(true)}
                                color={'white'}
                            />
                        </Div>
                    )}
                </Div>
                
                <KeyboardSpacer />
                
                <Image src={'login-bottom'} fw h={100} />

            </Div>

        </Div>
    )
}
