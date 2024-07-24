import { createContext, useContext, useState } from "react";

interface ModalContextProps {
    modal: React.ReactNode
    setModal: (component: React.ReactNode) => void
}

export const ModalContext = createContext<ModalContextProps | undefined>(undefined)
ModalContext.displayName = 'Modal'

export const useModal = () => {
    const context = useContext(ModalContext)
    if (!context) throw new Error('useModal must be used within a ModalProvider')
    return context
}

export const ModalProvider = ({ children }: { children: React.ReactNode}) => {

    const [modal, setModal] = useState<React.ReactNode>(null)

    return <ModalContext.Provider
        value={{
            modal,
            setModal
        }}
    >
        {children}
    </ModalContext.Provider>

}