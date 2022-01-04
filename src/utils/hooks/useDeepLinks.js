import { useEffect } from 'react'
import { Linking, Platform} from 'react-native'

export default ( fn ) => {

    const handleDeepLink = e => {
        if(e && e.url){
            const route = e.url.replace(/.*?:\/\//g, ''); // receives backslash for non (/)
            const name = route.split('/')[0] || route
            const id = route.split('/')[1] || ''
            setTimeout( () => {
                fn && fn(name, id)
            }, 1000)
        }
    }

    useEffect( () => { 
        let a = null
        if(Platform.OS === 'android'){
            Linking.getInitialURL().then(url => handleDeepLink(url) );
        } else {
            a = Linking.addEventListener('url', handleDeepLink) 
        }
        return () => {
            a && a.remove()
        }
    }, [])
}
