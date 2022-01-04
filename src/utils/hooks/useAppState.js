import {useEffect, useState} from 'react'
import {AppState, AppStateStatus} from 'react-native'

export default function useAppState() {
  const currentState = AppState.currentState
  const [appState, setAppState] = useState(currentState)

  function onChange(newState) {
    setAppState(newState)
  }

  let SUB = null

  useEffect(() => {
    SUB = AppState.addEventListener('change', onChange)

    return () => {
      SUB && SUB.remove()
      // AppState.removeEventListener('change', onChange)
    }
  })

  return appState
}
