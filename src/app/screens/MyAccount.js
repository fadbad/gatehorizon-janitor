import React from "react";
import { Div, Text, Icon, Image, Spinner } from '../../ui'
import { useStore, useApi, useTranslation, upload, moment, useReducer, validEmail, useRoute } from '../../utils'
import { Header, Input, ButtonGroup } from "../components";

export default () => {
    const api = useApi()
    const { t } = useTranslation()
    const { user, user_update, toast_show } = useStore()

    const { params } = useRoute()
    const withBack = params?.withBack ?? false

    const IMG_SIZE = 90
    const DOB = React.useRef()

    const [state, setState] = useReducer({
        loading: false,
        img: null,
        dob: user.dob,
        name: user.name,
        name_error: '',
        email: user.email,
        email_error: '',
        gender: user.gender || 'male'
    })

    const validate = async () => {
        let errors = false

		setState({
			name_error: '',
			email_error: '',
		})

		if(state.name.trim().length < 3){
			setState({name_error: 'Name not valid'})
			errors = true
		}

        if(!validEmail(state.email)){
            setState({email_error: 'Email not valid'})
            errors = true
        }

		if(errors) return false;

		setState({loading: true})

		const res = await user_update({
			image: state.img,
			name: state.name,
            email: state.email,
            dob: state.dob,
            gender: state.gender,
		});

		setState({loading: false})

		if(res.result === 'success'){
            toast_show('Profile Updated')
		} else {
			alert('Error Occured')
		}
	}

    return (
        <Div f={1} bg={'secondary'}>
            <Header title={t('MY_ACCOUNT')} back={withBack} />
            <Div f={1} rt={24} bg={'light'} keyboarddismiss>
                <Div p={24}>
                    <Div center>
                        <Div 
                            size={IMG_SIZE+6} bg={'white'} r={IMG_SIZE} b={3} bcolor={'white'}
                            onPress={() => upload(i => setState({img: i}) )}
                        >
                            <Image src={state.img ?? user.avatar} size={IMG_SIZE} r={IMG_SIZE} cover />
                            <Div 
                                absolute bottom={-6} right={-6}
                                size={40} r={20} bg={'primary'} center
                                b={3} bcolor={'white'}
                            >
                                <Icon name={'camera'} size={22} color={'white'} />
                            </Div>
                        </Div>
                    </Div>

                    <Input 
                        type={'phone'}
                        label={t('YOUR_MOBILE')}
                        onChange={v => {}}
                        value={user.mobile}
                        error={null}
                        disabled
                    />

                    <Input 
                        label={t('YOUR_NAME')}
                        onChange={v => setState({name: v})}
                        value={state.name}
                        error={state.name_error}
                    />
                    <Input 
                        type={'email'}
                        label={t('YOUR_EMAIL')}
                        onChange={v => setState({email: v})}
                        value={state.email}
                        error={state.email_error}
                    />

                    <Input 
                        type={'date'}
                        label={t('DOB')}
                        forwardedRef={DOB}
                        onChange={v => {
                            setState({dob: moment(v).format('YYYY-MM-DD')})
                            DOB.current.setValue( moment(v).format('DD MMMM, YYYY') )
                        }}
                        value={moment(state.dob).format('DD MMMM, YYYY')}
                        dateValue={moment(state.dob).toDate()}
                        error={null}
                    />

                    <ButtonGroup mt={24}
                        options={[
                            {text: t('MALE'), value: 'male'},
                            {text: t('FEMALE'), value: 'female'}
                        ]}
                        value={state.gender}
                        onChange={v => setState({gender: v})}
                    />

                    <Div my={24} bg={'primary'} py={10} r={8} center onPress={validate} disabled={state.loading}>
                        {state.loading ? <Spinner color={'white'} /> : (
                            <Text color={'white'} bold>{t('SAVE')}</Text>
                        )}
                    </Div>

                </Div>
            </Div>
        </Div>
    )
}
