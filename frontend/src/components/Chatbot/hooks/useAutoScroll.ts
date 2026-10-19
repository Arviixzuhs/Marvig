import React from 'react'

export const useAutoScroll = () => {
    const endRef = React.useRef<HTMLDivElement | null>(null)

    const scrollToBottom = React.useCallback(() => {
        endRef.current?.scrollIntoView({ behavior: 'auto' })
    }, [])

    return { endRef, scrollToBottom }
}
