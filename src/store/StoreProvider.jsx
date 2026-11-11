import { useEffect, useMemo, useReducer, useRef } from 'react'
import { useToast } from '../components/toast-context.js'
import { createActions } from './actions.js'
import { StoreContext } from './context.js'
import { reducer } from './reducer.js'
import { loadState, saveState } from './storage.js'

export default function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const toast = useToast()
  const warned = useRef(false)

  useEffect(() => {
    if (saveState(state)) {
      warned.current = false
    } else if (!warned.current) {
      warned.current = true
      toast('本机存储空间不足，最近的修改可能没有保存')
    }
  }, [state, toast])

  const actions = useMemo(() => createActions(dispatch), [])
  const value = useMemo(() => ({ state, actions }), [state, actions])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
