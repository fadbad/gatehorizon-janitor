import React from 'react'
import { Div, Text, SIZES, Image, IMAGES, Spinner } from "../../ui";
import { useStore, KeyboardSpacer, alert, useTranslation } from '../../utils'
import { LinearBg, Input } from "../components";

export default () => {

    const { user_login, toast_show } = useStore()
	const { t } = useTranslation()

    const [loading, setLoading] = React.useState(false)
    const [token, setToken] = React.useState('')
    const [tokenErr, setTokenErr] = React.useState('')


    const validate = async () => {

        if(token.trim().length < 3){
            setTokenErr('Min 3 chahacters required')
            return false
        }
        setTokenErr('')

        setLoading(true)
        const res = await user_login(token)
        setLoading(false)
        if(res.result === 'success'){
            toast_show(`${t('WELCOME')} ${res.user?.name}`)
        } else {
            alert(t('ERROR_OCCURED'), res.message)
        }
    }

    return (
        <Div f={1} safe bg={'secondary'}>
            <LinearBg type='login' />
        
            <Div f={1} center mx={18} keyboarddismiss>
                
                <Div p={20} w={SIZES.width / 2}>
                    <Div mb={24}>
                        <Image src={IMAGES.logo} h={50} />
                    </Div>
                    <Div fw>
                        <Text h3 color={'white'}>{ t('LOGIN') }</Text>
                        <Input 
                            color={'white'}
                            autoFocus={true}
                            autoCorrect={false}
                            label={'Token'}
                            value={token}
                            onChange={v => setToken(v)}
                            error={tokenErr}
                        />
                    </Div>

                    <Div 
                        fw py={10} my={20} r={5} bg={'primary'} center 
                        disabled={loading}
                        onPress={validate}
                    >
                        {loading ? (
                            <Spinner color={'#fff'} />
                        ) : (
                            <Text bold color={'white'}>
                                { t('LOGIN') }
                            </Text>
                        )}   
                    </Div>
                </Div>
            </Div>
            
            <KeyboardSpacer />
            <Image src={'login-bottom'} fw h={100} />
            
        </Div>
    )
}
