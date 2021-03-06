import React from 'react'
import { useStore, useApi, useNetChecker, useEvents, useOneSignal, useDeepLinks, currentLang, Vars, useTranslation, useTimedToggle } from "./utils";
import {LoadingScreen, Home, Login} from './app/screens'
import { Toast, Div, Text, Spinner } from "./ui";
import { Updater } from './app/components';

export default () => {
	const { t } = useTranslation()
    const events = useEvents()
    const api = useApi()

    const { 
        toast_ref, setHasInternet, record_device_push,
		notifications_onReceived, notifications_set, user_init, isLoggedIn,
    } = useStore()

	const [connected, setConnected] = React.useState(true)
	const [loaded, setLoaded] = React.useState(false)
    const [rebootOneSignal, doRebootOneSignal] = useTimedToggle()

    useNetChecker(v => {
		setConnected(v)
		setHasInternet(v)
	})

	// const internalNav = async (name, id) => {
	// 	if(!id) return;
	// 	switch(name.trim().toLowerCase()) {
	// 		case 'shop': case 'branch':
	// 			const item = await api.post(`/fetch-branch/${id}`)
	// 			navigate('Shop', { item })
	// 		break;
	// 		case 'vendor':
	// 			navigate('Vendor', { id })
	// 		break;
	// 	}
	// }

    // useDeepLinks( async (name, id) => {
	// 	await internalNav(name, id)
    // })

    useOneSignal({
        ids: d => record_device_push(d),
        received: n => notifications_onReceived(n),
        // opened: (data) => setTimeout(async () => {
        //     const name = data.section || ''
        //     const id = data.id || ''
        //     await internalNav(name, id)
        // }, 1500),
        reboot: rebootOneSignal
	})

    const boot = async () => {
        const lang = await currentLang()
        Vars.setLang(lang)
		await user_init()
        doRebootOneSignal()
        setLoaded(true)

        events.subscribe('userInit', (u) => {
            u && notifications_set( u.notifications_count || 0 )
        })
    }

    React.useEffect( () => { boot() }, [])

    return (
        <>
            {
                !loaded ? (<Div f={1} bg={'secondary'} center><Spinner color={'white'} /></Div>) : 
                !isLoggedIn ? <Login /> : <Home />
            }

            <Updater />

            {/* {!connected && (<Div bg={'red'} absolute bottom={0} fw rt={24}>
                <Text p={24} color={'white'} size={13} center>
                    {t('NO_NETWORK')}
                </Text>
            </Div>)} */}

            <LoadingScreen />

            <Toast ref={toast_ref} />
        </>
    )
}
