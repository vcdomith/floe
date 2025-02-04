import { createContext, ReactNode, useContext, useState } from "react";

interface ModalContextProps {
    modal: ModalNode[]
    setModal: (component: React.ReactNode, disableClickOutside?: boolean) => void
    clearModal: () => void
    clearAllModal: () => void
}

export const ModalContext = createContext<ModalContextProps | undefined>(undefined)
ModalContext.displayName = 'Modal'

export const useModal = () => {
    const context = useContext(ModalContext)
    if (!context) throw new Error('useModal must be used within a ModalProvider')
    return context
}

export interface ModalNode {
    modal: ReactNode
    disableOutsideClick: boolean
}

export const ModalProvider = ({ children }: { children: React.ReactNode}) => {

    const [modal, setModal] = useState<ModalNode[]>([])

    const addModal = (modal: React.ReactNode, disableOutsideClick = false) => setModal( prev => {

        // Condition to debounce and make sure only one type of modal is being shown at a time
        if (prev.some( element => 
            (element.modal as React.JSX.Element).type.name === 
            (modal as React.JSX.Element).type.name)) {
                return [...prev]
        }

        return [
            ...prev,
            {
                modal: modal,
                disableOutsideClick: disableOutsideClick
            }
        ]
    })

    // const clearModal = () => setModal([])

    const clearModal = () => setModal(prev => {
        const updated = [...prev]
        updated.pop()
        return updated
    })

    const clearAllModal = () => setModal([])

    return <ModalContext.Provider
        value={{
            modal,
            setModal: addModal,
            clearModal,
            clearAllModal,
        }}
    >
        {children}
    </ModalContext.Provider>

}