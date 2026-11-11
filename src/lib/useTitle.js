import { useEffect } from 'react'

export default function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · 素材中台` : '素材中台'
  }, [title])
}
