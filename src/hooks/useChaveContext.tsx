import { IFornecedor } from "@/interfaces/IFornecedor";
import useDocumento, { DocumentoData } from "./useDocumento";
import useSectionContext, { UseSectionContext } from "./useSectionContext";
import Converter from "@/utils/typeConversion";
import { IFatoresPedido } from "./usePedido";
import { NFeProduto } from "@/utils/parseXml";

export interface UseChaveContext {

    context: UseSectionContext
    documentos: Record<"nfe" | "cte", DocumentoData>

    submitForm: () => void

}

export default function useChaveContext(): UseChaveContext {

    const { stringToFloat, floatToString } = Converter

    const chaveContext = useSectionContext()
    const {
        fornecedorContext: { fornecedorData, setFornecedorData },
        pedidoContext: { pedidoData, setPedidoData }
    } = chaveContext

    const { documentos, dadosImportados } = useDocumento()

    const getTotalProdutosST = (produtos: NFeProduto[]) => {

        const initial = 0
        return floatToString(produtos
            .filter( produto => produto.cst === '10')
            .reduce(
                (acc, val) => acc + parseFloat(val.total),
                initial
            ))

    }

    const gerarFatoresPedido = (fatorBase: string) => {

        const { pedido, produtos } = dadosImportados        

        const resultadoTransporte = (1 + (
            (stringToFloat(pedido.valorFrete) * stringToFloat('3.4')) / 
            (stringToFloat(pedido.valorTotalProdutos) * stringToFloat(fatorBase))
        ))

        // setPedidoData(prev => ({
        //     ...prev, 
        //     ['fatorTransportePedido' as keyof IFatoresPedido]: floatToString(resultadoTransporte, 3)
        // }))

        const resultadoSt = (1 + (
            (stringToFloat(pedido.valorSt) * stringToFloat('1')) / 
            (stringToFloat(getTotalProdutosST(produtos)) * stringToFloat(fatorBase))
        ))

        setPedidoData(prev => ({
            ...prev,
            ['fatorTransportePedido' as keyof IFatoresPedido]: floatToString(resultadoTransporte, 3), 
            ['fatorSTPedido' as keyof IFatoresPedido]: floatToString(resultadoSt, 3)
        }))

    }

    const gerarFatores = async () => {

        // Consulta DB fornecedor e importa seus dados
        const cnpj = dadosImportados.pedido.cnpj
        
        try {
            
            const res = await fetch(`/calcular/getFornecedor?cnpj=${cnpj}`)

            const fornecedorData: IFornecedor = await res.json()
            setFornecedorData(fornecedorData)


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