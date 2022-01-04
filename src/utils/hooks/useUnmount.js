import { useRef, useEffect } from 'react'

export default (fn) => {
    const fnRef = useRef(fn)
    if (fnRef.current !== f) fnRef.current = f
    useEffect(() => () => fnRef.current(), [])
}
