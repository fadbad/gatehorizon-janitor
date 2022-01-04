import { useEffect } from 'react'
import { useNetInfo } from "@react-native-community/netinfo";

export default (cb) => {

	const netInfo = useNetInfo();

	useEffect(() => {
		// console.log('NETINFO:', netInfo)

		if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false){
			cb && cb(false)
		} else {
			cb && cb(true)
		}

	}, [
		netInfo.type, 
		netInfo.isConnected, 
		netInfo.isInternetReachable, 
		netInfo.details
	])
}
