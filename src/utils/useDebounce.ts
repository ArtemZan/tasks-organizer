import { useCallback, useRef } from "react"

export function useDebounce(timeMs: number){
    const timer = useRef<number | null>(null)

    return useCallback((callback: (...args: any[]) => any) => {
        if(timer.current){
            clearTimeout(timer.current)
        }

        timer.current = setTimeout(callback, timeMs)
    }, [timeMs])
}