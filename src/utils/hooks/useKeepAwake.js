import { useEffect } from 'react';
import { NativeModules } from 'react-native';

// yarn add react-native-keep-awake

export default () => {
	const KeepAwake = NativeModules?.KCKeepAwake
  	useEffect(() => {
		KeepAwake?.activate && KeepAwake.activate()
    	return () => KeepAwake?.deactivate && KeepAwake.deactivate();
  	}, []);
}
