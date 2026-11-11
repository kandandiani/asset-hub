import { useCallback, useEffect, useRef, useState } from 'react'
import { ToastContext } from './toast-context.js'

export default function ToastProvider({ children }) {
  const [message, setMessage] = useState(null)
  const timer = useRef(0)

  const toast = useCallback((text) => {
    setMessage({ text, key: Date.now() })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMessage(null), 2200)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {message && (
          <div className="toast" key={message.key}>
            {message.text}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}
