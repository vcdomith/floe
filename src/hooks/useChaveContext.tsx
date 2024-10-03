import useDocumento, { DocumentoData } from "./useDocumento";
import useSectionContext, { UseSectionContext } from "./useSectionContext";

export interface UseChaveContext {

    context: UseSectionContext
    documentos: Record<"nfe" | "cte", DocumentoData>

    submitForm: () => void

}

export default function useChaveContext(): UseChaveContext {

    const chaveContext = useSectionContext()

    const { documentos, dadosImportados } = useDocumento()

    const gerarFatores = async () => {

        // Consulta DB fornecedor e importa seus dados
        const fornecedor = dadosImportados.pedido.fornecedor
        
        try {
            
            const res = await fetch(`/calcular/getFornecedor?fornecedor=${fornecedor}`)

            const fornecedorData = await res.json()




        } catch (error) {
            
        }

    }

    const submitForm = () => {

        // Gerar fatores a partir dos dadosImportados

        // A partir dos fatores itera produtos e gera-os

        // setTabela(produtosGerados)


    }

    return {

        context: chaveContext,
        documentos,
        submitForm

    }

}