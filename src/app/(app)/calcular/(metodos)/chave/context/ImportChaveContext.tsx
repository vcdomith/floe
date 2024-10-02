import useImportDocument, { DadosImportados, DocumentoImportado } from "@/hooks/useImportDocument";
import { createContext, useContext, useMemo, useState } from "react";

interface ImportarChaveContext {

    documentos: Record<'nfe' | 'cte', DocumentoData>
    
    dadosImportados: DadosImportados

}

export interface DocumentoData {

    documento: string
    chave: string
    setChave: (chave: string) => void
    loading: boolean
    importarDocumento: (chave: string) => void
    importado: DocumentoImportado | undefined

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

    const documentos: Record<'nfe' | 'cte', DocumentoData> = useMemo(() => ({
        nfe: {
            documento: 'NFe',
            chave: chaveNFe,
            setChave: setChaveNFe,
            loading: NFeLoading,
            importarDocumento: importNFe,
            importado: NFeImportado,
        } ,
        cte: {
            documento: 'CTe',
            chave: chaveCTe,
            setChave: setChaveCTe,
            loading: CTeLoading,
            importarDocumento: importCTe,
            importado: CTeImportado,
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [ImportDocumentContext, chaveNFe, chaveCTe])

    // const gerarTabela = () => {

    //     dadosImportados.produtos.map( produto => 

    //     )

    // }

    return <ImportarChaveContext.Provider
        value={{

            documentos,

            dadosImportados 

        }}
    >
        {children}
    </ImportarChaveContext.Provider>

}