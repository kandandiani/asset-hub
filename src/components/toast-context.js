import { createContext, useContext } from 'react'

export const ToastContext = createContext(() => {})

// toast('文案') shows a short message at the bottom of the screen
export const useToast = () => useContext(ToastContext)
