import useImportDocument, { DadosImportados, DocumentoImportado } from "@/hooks/useImportDocument";
import { createContext, useContext, useState } from "react";

interface ImportarChaveContext {

    chaveNFe: string
    setChaveNFe: (chave: string) => void
    NFeLoading: boolean
    importNFe: (chave: string) => void
    NFeImportado: DocumentoImportado | undefined
    
    chaveCTe: string
    setChaveCTe: (chave: string) => void
    CTeLoading: boolean
    importCTe: (chave: string) => void
    CTeImportado: DocumentoImportado | undefined
    
    dadosImportados: DadosImportados

}

export const ImportarChaveContext = createContext<ImportarChaveContext | undefined>(undefined)
ImportarChaveContext.displayName = 'Import Chave'

export const useImportarChave = () => {
    const context = useContext(ImportarChaveContext)
    if (!context) throw new Error('useImportarChave must be used within a ImportarChaveProvider')
    return context
}

export const ImportarChaveProvider = ({ children }: { children: React.ReactNode }) => {

    const [chaveNFe, setChaveNFe] = useState('')
    
    const [chaveCTe, setChaveCTe] = useState('')
    
    const ImportDocumentContext = useImportDocument()
    const { 
        NFeLoading, 
        NFeImportado,
        CTeLoading, 
        CTeImportado,
        importCTe, 
        importNFe, 
        dadosImportados 
    } = ImportDocumentContext    

    // const gerarTabela = () => {

    //     dadosImportados.produtos.map( produto => 

    //     )

    // }

    return <ImportarChaveContext.Provider
        value={{

            chaveNFe,
            setChaveNFe,
            NFeLoading,
            importNFe,
            NFeImportado,

            chaveCTe,
            setChaveCTe,
            CTeLoading,
            importCTe, 
            CTeImportado,

            dadosImportados 

        }}
    >
        {children}
    </ImportarChaveContext.Provider>

}