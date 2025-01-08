import useDynamicState from "@/hooks/useDynamicState";
import { usePathname } from "next/navigation";
import { createContext, Dispatch, MutableRefObject, RefObject, SetStateAction, UIEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

interface SectionSelectContextProps {
    path: string
    sections: string[]
    section: string
    setSection: Dispatch<SetStateAction<string>>
    handleSectionChange: (value: string) => void
    mainRef: RefObject<HTMLElement>
    handleScroll: (e: UIEvent<HTMLElement>) => void
    // sectionsRefs: MutableRefObject<SectionRefs>
}

interface SectionRefs {
    section_1: HTMLElement | null
    section_2: HTMLElement | null
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

    const path = usePathname().split('/')[1]
    // console.log(path);
    
    // const [previousPath, setPreviousPath] = useState<string>(path)

    const sections = useMemo(() => {

        return (SUPPORTED_PATHS.includes(path))
            ? SECTIONS_BY_PATH[path as keyof typeof SECTIONS_BY_PATH]
            : []
            
    }, [path])    

    const [section, setSection] = useDynamicState({
        initialState: sections[0],
        dependency: path
    })
    const [programaticScroll, setProgramaticScroll] = useState(false)
    
    const mainRef = useRef<HTMLElement>(null)
    console.log(mainRef)

    const handleScroll = (e: UIEvent<HTMLElement>) => {

        if (programaticScroll) return

        const scrollPos = (e.target as HTMLElement).scrollLeft
        const scrollWidth = (e.target as HTMLElement).scrollWidth

        if (scrollPos > scrollWidth / 4) {
            setSection('Tabela')
        } else {
            setSection('Fatores')
        }

    }

    const handleSectionChange = (value: string) => {
        
        if(mainRef.current?.childNodes.length === 0) return 
        
        const index = sections.indexOf(value)
        setSection(value);
        setProgramaticScroll(true);
        (mainRef.current?.childNodes[index] as HTMLElement).scrollIntoView({ behavior: 'smooth' })

        setTimeout(() => setProgramaticScroll(false), 500)

    }

    // const sectionsRefs = useRef<SectionRefs>({
    //     section_1: null,
    //     section_2: null,
    // })

    // const parentRef = useRef<HTMLElement>(null)
    // if (sectionsRefs.current) parentRef.current = sectionsRefs.current.section_1?.parentElement

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
            setSection,
            handleSectionChange,
            mainRef,
            handleScroll,
        }}
    >
        {children}
    </SectionSelectContext.Provider>

}