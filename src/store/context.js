import { createContext, useContext } from 'react'

export const StoreContext = createContext(null)

// { state, actions } — see store/actions.js for the action list and store/selectors.js for derived data
export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
