import React from 'react'

export default (defaults = {}) => {
    const [state, setState] = React.useReducer((o, n) => ({...o, ...n}), defaults)
    return [state, setState]
}
