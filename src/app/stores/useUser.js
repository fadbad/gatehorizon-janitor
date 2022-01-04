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
	const [hasLoc, setHasLoc] = useState(false)
	const [isLoggedIn, setIsLoggedIn] = useState(false)

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
        }
    }

    const user_logout = async () => {
        Vars.setToken('')
        await storage.delete('@Session:token'); 
		events.publish('userLogout', null)
        setToken(null)
        setUser(null)
    }

    const user_login = async (token) => {
        const r = await api.post('/login', {token})
        if(r && r.token){
            await create(r.token)
            setUser(r.user)
            events.publish('userInit', user)
        } else {
            console.log('No token found')
        }
        return r
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
        hasLoc,
        setHasInternet,
        user_init,
        user_locate,
        user_login,
        user_logout,
        user_update,
        user_refetch,
        record_device_push,
    }
}
