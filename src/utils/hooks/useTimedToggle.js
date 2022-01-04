import { useState } from 'react'
export default (timeout = 100) => {
    const [ tog, setTog ] = useState(false)

    const doTog = () => {
        setTog(true)
        setTimeout(() => setTog(false), timeout)
    }

    return [tog, doTog]
}
