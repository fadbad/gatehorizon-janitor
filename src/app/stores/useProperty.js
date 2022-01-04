import React, { useState, useEffect } from "react";
import _ from 'lodash'
import { isEmpty } from '../../utils/src/functions'
import useStorage from '../../utils/hooks/useStorage';
import useApi from '../../utils/hooks/useApi';
import useEvents from '../../utils/hooks/useEvents';
import Vars from '../../Vars'

export default () => {
	const storage = useStorage()
	const events = useEvents()
	const api = useApi()

    const STORAGE_KEY = '@Session:property'

    const [user_properties, setUserProperties] = useState([])
    const [user_property, setUserProperty] = useState({})
    const [current_property_id, setCurrent_property_id] = React.useState(0)

    const fetch_user_properties = async () => {
        const res = await api.post('/get-properties');
        if(res.result === 'success'){
            setUserProperties(res.items ?? [])
            Vars.setProperties(res.items ?? [])
        }
        return res.items ?? []
    }

    const set_current_property = async (property) => {
        Vars.setProperty(property)
        await storage.save(STORAGE_KEY, property);
        setUserProperty(property)
        setCurrent_property_id(property.id ?? 0)
        events.publish('propertyChange', property)
        return property;
    }

    const delete_current_property = async () => {
        await storage.delete(STORAGE_KEY);
        setUserProperty({})
        setCurrent_property_id(0)
        return null
    }

    const get_current_property = async () => {
        const property = await storage.get(STORAGE_KEY);
        if(property) {
            setUserProperty(property)
            return property
        }
        return user_property
    }

    const boot_properties = async () => {
        const res = await api.post('/get-properties');
        if(res.result === 'success'){
            const items = res.items ?? []
            setUserProperties(items)
            Vars.setProperties(items)
            
            const curr = await storage.get(STORAGE_KEY);
            if(!isEmpty(curr)){
                const ind = items.findIndex(x => x.id === curr.id)
                if(ind < 0) {
                    await delete_current_property()
                    await set_current_property(items[0] ?? {})
                } else {
                    await set_current_property(curr)
                }
            } else {
                await set_current_property(items[0] ?? {})
            }
        }
    }

    return {
        boot_properties, fetch_user_properties,
        user_properties, setUserProperties,
        user_property, setUserProperty,
        set_current_property, delete_current_property, get_current_property,
        current_property_id, setCurrent_property_id,
    }
}
