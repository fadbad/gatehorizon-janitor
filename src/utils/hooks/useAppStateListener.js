import { useState, useEffect } from 'react'
import { AppState } from 'react-native'
import moment from 'moment'
import _ from 'lodash'

export default ({ after, callback }) => {
    after = after || 30

    const [appState, setAppState] = useState(AppState.currentState)
    const [sleptAt, setSleptAt] = useState(null)

    const handleAppStateChange = (nextAppState) => {
        setAppState(nextAppState)
    
        if (nextAppState === 'background') {
            setSleptAt( moment( new Date() ) )
        }
    
        if (nextAppState === 'active') {
            if(_.isEmpty(sleptAt)) return;
            const time = moment(new Date());
            const diff = moment.duration(time.diff(sleptAt)).asSeconds();
            if(diff > after) callback && callback()
        }
    
        if (nextAppState === 'inactive') {}
    };

    let SUB = null

    useEffect(() => {
        SUB = AppState.addEventListener('change', handleAppStateChange)
        return () => {
            SUB && SUB.remove()
            // AppState.removeEventListener('change', handleAppStateChange)
        }
    })

    return appState
}
