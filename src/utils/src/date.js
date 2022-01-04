import moment from 'moment'

export const dateTimeout = (from, minutes = 3) => {
	const toDate = moment.utc(from).add(minutes, 'minutes')
	const ms = Math.max( 0, toDate.diff(moment.utc() ));
	return moment.duration(ms).as('milliseconds');
}

export const now = () => moment.utc().add((new Date()).getTimezoneOffset(), 'minutes')

export const date = (d, format = 'MMM DD, YYYY') => d ? moment.utc(d).format(format) : ''

export const dateFormat = (d, offset = 0, format = 'MMM DD, YYYY') => d ? moment.utc(d).add(offset, 'hours').format(format) : ''

export const dateDiff = (d1, d2) => moment.duration(moment.utc(d1).diff(moment.utc(d2))).humanize()

export const fromNow = (d, nosuffix = false) => moment.utc(d).fromNow(nosuffix)

export const fromNowMini = (d) => {
	const dat = fromNow(d, true)
	return dat
		.replace('a few seconds', 'just now')
		.replace('a few', '')
		.replace('seconds', 's')
		.replace('second', 's')
		.replace('minutes', 'min')
		.replace('minute', 'min')
		.replace('hours', 'h')
		.replace('hour', 'h')
		.replace('days', 'd')
		.replace('day', 'd')
		.replace('months', 'm')
		.replace('month', 'm')
		.replace('years', 'y')
		.replace('year', 'y')
		.replace(' ', '')
}

export const dateInFuture = dat => moment(dat).utc().isAfter( now() )

export const dateInPast = dat => moment(dat).utc().isBefore( now() )

export const formatDate = date => moment(date).calendar(null, {
	lastDay: `[Yesterday]`,
	sameDay: 'LT',
	lastWeek: 'dddd',
	sameElse: 'MMM D'
});

export const daysBetween = (date1, date2) => {
	const one_day = 1000 * 60 * 60 * 24;
	const date1_ms = date1.getTime();
	const date2_ms = date2.getTime();
	const difference_ms = date2_ms - date1_ms;
	return Math.round(difference_ms / one_day);
}
