import { createContext, useContext, useEffect, useRef, useState } from "react";

interface BackgroundSyncContextProps {
    index: number | null
}

export const BackgroundSyncContext = createContext<BackgroundSyncContextProps | undefined>(undefined)
BackgroundSyncContext.displayName = 'Background_Sync'

export const useBackgroundSync = () => {
    const context = useContext(BackgroundSyncContext)
    if (!context) throw new Error('useBackgroundSync must be used within BackgroundSyncProvider')
    return context
}

export const BackgroundSyncProvider = ( {children, interval}: {children: React.ReactNode, interval: number}) => {

    const [index, setIndex] = useState<number | null>(null)
    const lastIndex = useRef<number | null>(null)

    function generateIndex() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * 5)
        } while (newIndex === lastIndex.current);       
        lastIndex.current = newIndex
        setIndex(newIndex)
    }

    useEffect(() => {

        generateIndex()

        const intervalId = setInterval(
            generateIndex, 
            interval
        );

        return () => clearInterval(intervalId);

    }, [interval])

    return <BackgroundSyncContext.Provider
        value={{
            index
        }}
    >
        {children}
    </BackgroundSyncContext.Provider>

}