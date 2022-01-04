import React from 'react'
import { Div, Text, Spinner } from "../../ui";
import { useTranslation, useReducer, useApi, alert } from "../../utils";
import { Header, Input } from '../components'

export default () => {
	const { t } = useTranslation()
	const api = useApi()

	const defaultState = {
		old_password: '',
		err_old_password: '',
		new_password: '',
		err_new_password: '',
		confirm_password: '',
		err_confirm_password: '',
		loading: false,
	}

	const [state, setState] = useReducer(defaultState)

	const validate = async () => {
        let errors = false

		setState({
			err_old_password: '',
			err_new_password: '',
			err_confirm_password: '',
		})

		if(state.old_password.trim().length < 6){
			setState({err_old_password: t('PASSWORD_IS_REQUIRED_MIN_LENGTH_6_CHARACTERS')})
			errors = true
		}

		if(state.new_password.trim().length < 6){
			setState({err_new_password: t('PASSWORD_IS_REQUIRED_MIN_LENGTH_6_CHARACTERS')})
			errors = true
		}

		if(state.confirm_password.trim() !== state.new_password.trim()){
			setState({err_confirm_password: t('PASSWORDS_DONT_MATCH')})
			errors = true
		}

		if(errors) return false;

		setState({loading: true})

		const res = await api.post('/change-password', {
			old_password: state.old_password,
			new_password: state.new_password
		});

		setState({loading: false})

		if(res.result === 'success'){
			setState(defaultState)
			alert( t('PASSWORD_CHANGED_SUCCESSFULLY'))
		} else {
			setState({
				err_old_password: t('OLD_PASSWORD_IS_WRONG'),
				err_new_password: '',
				err_confirm_password: '',
			})
		}
	}
    
    return (
        <Div f={1} bg={'secondary'}>
            <Header title={t('CHANGE_PASSWORD')} back />
			<Div px={24} f={1} rt={24} bg={'light'}>
				<Input password
					label={t('OLD_PASSWORD')}
					title={t('MIN_6_CHARACTERS')}
					onChange={v => setState({old_password: v})}
					value={state.old_password}
					error={state.err_old_password}
				/>

				<Input password 
					label={t('NEW_PASSWORD')}
					title={t('MIN_6_CHARACTERS')}
					onChange={v => setState({new_password: v})}
					value={state.new_password}
					error={state.err_new_password}
				/>

				<Input password 
					label={t('CONFIRM_NEW_PASSWORD')}
					title={t('MIN_6_CHARACTERS')}
					onChange={v => setState({confirm_password: v})}
					value={state.confirm_password}
					error={state.err_confirm_password}
				/>

				<Div fw py={10} my={20} r={5} bg={'primary'} center 
					onPress={validate} disabled={state.loading} o={state.loading ? 0.5 : 1}>
					{
						state.loading ? <Spinner color={'white'} /> : (
							<Text bold color={'white'}>
								{ t('SAVE') }
							</Text>
						)
					}
					
				</Div>

			</Div>
        </Div>
    )
}
