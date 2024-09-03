import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface MediaQueryContextProps {
    query: MediaQuery
    newQuery: (query: MediaQuery) => void
    matches: boolean
}

export interface MediaQuery {

    width: number
    range: 'min' | 'max'

}

function useMediaQueryInner({width, range = 'max'}: MediaQuery) {

    const [matches, setMatches] = useState(false)

    const query = useMemo(() => `(${range}-width: ${width}px)`, [width, range])

    useEffect(() => {

        const media = window.matchMedia(query)
        if (media.matches !== matches) {
            setMatches(media.matches)
        }
        const listener = () => setMatches(media.matches)
        media.addEventListener('change', listener)

        return () => media.removeEventListener('change', listener)

    }, [matches, query])

    return matches

}

export const MediaQueryContext = createContext<MediaQueryContextProps | undefined>(undefined)
MediaQueryContext.displayName = 'MediaQuery'

export const useMediaQuery = () => {
    const context = useContext(MediaQueryContext)
    if (!context) throw new Error("useMediaQuery must be used within it's Provider")
    return context
}

export const MediaQueryProvider = ({ children }: { children: React.ReactNode }) => {

    const [query, newQuery] = useState<MediaQuery>({
        width: 700,
        range: 'max',
    })

    const matches = useMediaQueryInner(query)

    return <MediaQueryContext.Provider
        value={{
            query,
            newQuery,
            matches
        }}
    >
        {children}
    </MediaQueryContext.Provider>

}