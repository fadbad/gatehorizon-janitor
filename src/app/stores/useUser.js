import { useState, useEffect } from "react";
import _ from 'lodash'
import { locate } from '../../utils/src/maps'
import { isEmpty } from '../../utils/src/functions'
import useStorage from '../../utils/hooks/useStorage';
import useApi from '../../utils/hooks/useApi';
import useEvents from '../../utils/hooks/useEvents';
import Vars from '../../Vars'

export default () => {
	const storage = useStorage()
	const events = useEvents()
	const api = useApi()

    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [lat, setLat] = useState(null)
    const [lng, setLng] = useState(null)
    const [hasInternet, setHasInternet] = useState(true)
	const [authModal, setAuthModal] = useState(false)
	const [authPincodeModal, setAuthPincodeModal] = useState(false)
	const [hasLoc, setHasLoc] = useState(false)
	const [isLoggedIn, setIsLoggedIn] = useState(false)

    const [user_properties, setUserProperties] = useState([])
    const [user_property, setUserProperty] = useState({})

	useEffect(() => {
		setIsLoggedIn(!!token && !_.isEmpty(user))
	}, [token, user])

	useEffect(() => {
		setHasLoc(!isEmpty(lat) && !isEmpty(lng))
	}, [lat, lng])

    const user_locate = async () => {
        const { latitude, longitude } = await locate()
        setLat(latitude)
        setLng(longitude)
        return {
            lat: latitude,
            lng: longitude,
            latitude,
            longitude
        }
    }

    const create = async (token) => {
        Vars.setToken(token)
        await storage.save('@Session:token', token);
        setToken(token)
        return token;
    }

    const user_init = async () => {
        const token = await storage.get('@Session:token');
        Vars.setToken(token)
        console.log('TOKEN', token)
        if (token) {
            setToken(token)
            const res = await api.post('/fetch');
            setUser(res || null)
            if(hasInternet && !res){
                await user_logout()
                return false
            }
            events.publish('userInit', res)
            // console.log(res)
            return res;
        } else {
			const id = await storage.get('@Registration:ID'); 
			if(id){
				setAuthPincodeModal(true)
			}
		}
    }

    const user_logout = async () => {
        Vars.setToken('')
        await storage.delete('@Session:token');
		await storage.delete('@Registration:ID'); 
		events.publish('userLogout', null)
        setToken(null)
        setUser(null)
    }

    const user_login = async (mobile, password) => {
        const r = await api.post('/login', {mobile, password})
        if(r && r.token){
            await create(r.token)
            setUser(r.user)
			await storage.delete('@Registration:ID'); 
            events.publish('userInit', user)
        } else {
            console.log('No token found')
        }
        return r
    }

    const user_register = async (args) => {
        const r = await api.post('/register', args)
		if(r.result === 'success'){
			await storage.save('@Registration:ID', r.user?.id); 
		}
        return r
    }

    const user_verify = async (code, user) => {
        const r = await api.post('/verify', { code, id: user?.id })
        if(r && r.token){
            await create(r.token)
            setUser(r.user)
			await storage.delete('@Registration:ID'); 
            events.publish('userInit', user)
        } else {
            console.log('No token found')
        }
        return r;
    }

	const user_verify_id = async (code) => {
		const id = await storage.get('@Registration:ID');
		if(!id) return;
        const r = await api.post('/verify', { code, id })
        if(r && r.token){
            await create(r.token)
            setUser(r.user)
			await storage.delete('@Registration:ID'); 
            events.publish('userInit', user)
        } else {
            console.log('No token found')
        }
        return r;
    }

    const user_resend = async (mobile) => {
        const r = await api.post('/resend', { mobile })
        return r;
    }

	const user_resend_token = async () => {
		const id = await storage.get('@Registration:ID');
		// if(!id) return false;
        const r = await api.post('/resend-token', { id })
        return r;
    }

    const user_update = async (args) => {
        if(!token) return;
        const r = await api.post('/user', args)
        if(r.result == 'success'){
            setUser(r.user)
        }
        return r
    }

    const user_refetch = async () => {
        if(!token) return;
        const r = await api.post('/fetch')
        if(r) setUser(r)
        return user
    }

    const record_device_push = async (player_id) => {
        console.log('player_id', player_id)
        await api.post('/user', { player_id })
    }

    return {
        token, user, lat, lng, hasInternet, 
        isLoggedIn,
        authModal, setAuthModal,
        authPincodeModal, setAuthPincodeModal,
        hasLoc,
        setHasInternet,
        user_init,
        user_locate,
        user_verify,
		user_verify_id,
        user_resend,
		user_resend_token,
        user_login,
        user_logout,
        user_register,
        user_update,
        user_refetch,
        record_device_push,
    }
}
