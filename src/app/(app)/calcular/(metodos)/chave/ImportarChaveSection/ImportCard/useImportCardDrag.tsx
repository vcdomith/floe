import { useNotification } from "@/app/(app)/(contexts)/NotificationContext"
import { DocumentoImportado, UseDocumento } from "@/hooks/useDocumento"
import { CTeData, parseXml } from "@/utils/parseXml"
import { ChangeEvent, Dispatch, DragEvent, SetStateAction, useState } from "react"

export interface UseImportCardDrag {

    // documentos: DocumentoImportado[]

    dragHover: boolean
    setDragHover: Dispatch<SetStateAction<boolean>>

    handleDrop: (e: DragEvent<HTMLDivElement>) => void
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void

}

interface DocumentosNodes {
    nfe: Document | null
    cte: Document | null

}

export default function useImportCardDrag(context: UseDocumento): UseImportCardDrag {

    // const [documentos, setDocumentos] = useState<DocumentoImportado[]>([])
    // const [documentosNodes, setDocumentosNodes] = useState<DocumentosNodes>({
    //     nfe: null,
    //     cte: null,
    // })

    const {
        documentos,
        setDocumento,
    } = context

    const [ dragHover, setDragHover ] = useState(false)
    const { addNotification } = useNotification()

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {

        const file = e.dataTransfer.files?.[0]

        if (file.name.split('.').at(-1) !== 'xml') {
            addNotification({
                tipo: 'erro',
                mensagem: `Arquivo tipo .${file.name.split('.').at(-1)} não é compatível, use um arquivo .xml`
            })
        }

        if (file) {
            const reader = new FileReader()
            reader.onload = function (e) {
                const text = e.target?.result as string
                
                const { data, documento, node } = parseXml(text)

                setDocumento(documento)
                // setDocumentosNodes(prev => ({
                //     ...prev,
                //     [documento.tipo.toLowerCase()]: node
                // }))
                // const documento: DocumentoImportado = {
                //     tipo: 'CTe',
                //     fornecedor: data.transportador,
                //     numero: data.nCTe,
                //     chave: data.chaveCTe,
                //     data: new Date(),
                // }

                // setDocumentos(prev => [
                //     ...prev,
                //     documento
                // ])

                console.log(data);

            }
            reader.readAsText(file)
        }

    }
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0]
        // console.log(fileList);

        if (file) {
            const reader = new FileReader()
            reader.onload = function (e) {
                const text = e.target?.result as string
                
                const { data, documento } = parseXml(text)

                setDocumento(documento)

                // setDocumentos(prev => [
                //     ...prev,
                //     documento
                // ])

                console.log(data);

            }
            reader.readAsText(file)
        }

    }

    return {
        dragHover,
        setDragHover,
        handleChange,
        handleDrop
    }

}