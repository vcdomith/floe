import useDynamicaState from "@/hooks/useDynamicState";
import { usePathname } from "next/navigation";
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface SectionSelectContextProps {
    path: string
    sections: string[]
    section: string
    setSection: Dispatch<SetStateAction<string>>
}

const SUPPORTED_PATHS = ['configurar', 'calcular', 'cadastros']

export const SECTIONS_BY_PATH: Record<('configurar' | 'calcular' | 'cadastros'), string[]> = {
    configurar: ['Novo', 'Fornecedores', 'Fornecedor'],
    calcular: ['Fatores', 'Tabela'],
    cadastros: ['Cadastros', 'Pedido']
}

export const SectionSelectContext = createContext<SectionSelectContextProps | undefined>(undefined)
SectionSelectContext.displayName = 'Section'

export const useSectionSelect = () => {
    const context = useContext(SectionSelectContext)
    if (!context) throw new Error("useSectionSelect must be used within it's Provider")
    return context
}

export const SectionSelectProvider = ({ children }: { children: React.ReactNode }) => {

    const path = usePathname().slice(1,)
    
    const [previousPath, setPreviousPath] = useState<string>(path)

    const sections = useMemo(() => {

        return (SUPPORTED_PATHS.includes(path))
            ? SECTIONS_BY_PATH[path as keyof typeof SECTIONS_BY_PATH]
            : []
            
    }, [path])    

    const [section, setSection] = useDynamicaState({
        initialState: sections[0],
        dependency: path
    })

    // const [section, setSection] = useState(sections[0])
    
    // if (path !== previousPath) {
    //     setPreviousPath(path)
    //     setSection(sections[0])
    // }

    return <SectionSelectContext.Provider
        value={{
            path,
            sections,
            section,
            setSection
        }}
    >
        {children}
    </SectionSelectContext.Provider>

}