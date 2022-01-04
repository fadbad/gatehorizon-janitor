import { useEffect, useState } from 'react'
import moment from 'moment'

export default (time, args = {}) => {
    const interval = 10000
    const mini = args.mini || null 
    const hideAgo = args.hideAgo || false

    const fromNow = (d, nosuffix = false) => moment.utc(d).fromNow(nosuffix)

    const get = (d, mini, hideAgo) => {
        if(mini){
            return fromNow(d, true)
            .replace('a few seconds', 'just now')
            .replace('a few', '')
            .replace('a ', '1')
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
            .replace('justnow', 'just now')
        } else {
            return fromNow(d, hideAgo)
        }
    }

    const [date, setDate] = useState( get(time, mini, hideAgo) )

    useEffect(() => {
        const INT = setInterval(() => setDate( get(time, mini, hideAgo) ), interval)
        return () => {
            clearInterval(INT)
        }
    }, [])

    return date
}
