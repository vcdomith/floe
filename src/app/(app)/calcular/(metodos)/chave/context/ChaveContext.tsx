// import useImportDocument, { DadosImportados, DocumentoImportado } from "@/hooks/useDocumento";
// import { createContext, useContext, useMemo, useState } from "react";
// import { useCalcular } from "../../../context/CalcularContext";

// interface ChaveContext {

//     documentos: Record<'nfe' | 'cte', DocumentoData>
    
//     dadosImportados: DadosImportados

// }

// export const ChaveContext = createContext<ChaveContext | undefined>(undefined)
// ChaveContext.displayName = 'Import Chave'

// export const useChave = () => {
//     const context = useContext(ChaveContext)
//     if (!context) throw new Error('useImportarChave must be used within a ImportarChaveProvider')
//     return context
// }

// export const ChaveProvider = ({ children }: { children: React.ReactNode }) => {

//     const {} = useCalcular()

//     const [chaveNFe, setChaveNFe] = useState('')
//     const [chaveCTe, setChaveCTe] = useState('')
//     const ImportDocumentContext = useImportDocument()
//     const { 
//         NFeLoading, 
//         NFeImportado,
//         CTeLoading, 
//         CTeImportado,
//         importCTe, 
//         importNFe, 
//         dadosImportados 
//     } = ImportDocumentContext 

//     const documentos: Record<'nfe' | 'cte', DocumentoData> = useMemo(() => ({
//         nfe: {
//             documento: 'NFe',
//             chave: chaveNFe,
//             setChave: setChaveNFe,
//             loading: NFeLoading,
//             importarDocumento: importNFe,
//             importado: NFeImportado,
//         } ,
//         cte: {
//             documento: 'CTe',
//             chave: chaveCTe,
//             setChave: setChaveCTe,
//             loading: CTeLoading,
//             importarDocumento: importCTe,
//             importado: CTeImportado,
//         }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     }), [ImportDocumentContext, chaveNFe, chaveCTe])

//     // const gerarTabela = () => {

//     //     dadosImportados.produtos.map( produto => 

//     //     )

//     // }

//     return <ChaveContext.Provider
//         value={{

//             documentos,

//             dadosImportados 

//         }}
//     >
//         {children}
//     </ChaveContext.Provider>

// }