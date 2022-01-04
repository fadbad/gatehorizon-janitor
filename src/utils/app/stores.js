import React, { createContext, useContext, useState } from 'react';
import stores from '../../app/stores'

const StoreContext = createContext()
const useStore = () => useContext(StoreContext)

const StoreProvider = ({children}) => {

    return (
        <StoreContext.Provider value={{...stores()}}>
            {children}
        </StoreContext.Provider>
    )
}

export {
    StoreContext,
    StoreProvider,
    useStore,
}
