import React from 'react';
import Text from './Text'
import { moment, empty } from "../utils";

const formatDate = (toDate, targetMask) => {
	const ms = Math.max( 0, toDate.diff(moment()) );
	const duration = moment.duration(ms);
	const str = moment(duration.as('milliseconds')).format(targetMask);
	return [ms, str];
}

export default ({
	from,
	minutes = 5,
    targetMask = 'mm:ss',
	onTick,
	onEnd,
	finished = '',
	...rest
}) => {
	const [countdown, setCountdown] = React.useState(null);
	const [processed, setProcessed] = React.useState(false);
	
	const toDate = empty(from) ? moment().add(minutes, 'minutes') : moment(from).add(minutes, 'minutes')
  
	const tick = () => {
	  	const [delta, lastCountdown] = formatDate(toDate, targetMask);
  
	  	if (delta <= 0) {
			setCountdown('');
			if(!processed){
				onEnd && onEnd();
				setProcessed(true)
			}
	  	} else {
			setCountdown(lastCountdown);
			onTick && onTick(countdown);
			setTimeout(tick, 1000)
	  	}
	};
  
	React.useEffect(() => {
	  	tick();
	}, []);
  
	return (
	  	<Text {...rest}>{countdown ?? finished}</Text>
	);
};
