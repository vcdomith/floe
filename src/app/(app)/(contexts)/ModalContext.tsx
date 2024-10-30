import { createContext, useContext, useState } from "react";

interface ModalContextProps {
    modal: React.ReactNode[]
    setModal: (component: React.ReactNode) => void
    clearModal: () => void
}

export const ModalContext = createContext<ModalContextProps | undefined>(undefined)
ModalContext.displayName = 'Modal'

export const useModal = () => {
    const context = useContext(ModalContext)
    if (!context) throw new Error('useModal must be used within a ModalProvider')
    return context
}

export const ModalProvider = ({ children }: { children: React.ReactNode}) => {

    const [modal, setModal] = useState<React.ReactNode[]>([])

    const addModal = (modal: React.ReactNode) => setModal( prev => {

        // Condition to debounce and make sure only one type of modal is being shown at a time
        if (prev.some( element => 
            (element as React.JSX.Element).type.name === 
            (modal as React.JSX.Element).type.name)) {
                return [...prev]
        }

        return [
            ...prev,
            modal
        ]
    })

    // const clearModal = () => setModal([])

    const clearModal = () => setModal(prev => {
        const updated = [...prev]
        updated.pop()
        return updated
    })


    return <ModalContext.Provider
        value={{
            modal,
            setModal: addModal,
            clearModal
        }}
    >
        {children}
    </ModalContext.Provider>

}