import { IFornecedor } from "@/interfaces/IFornecedor";
import useDocumento, { DadosImportados, DocumentoData } from "./useDocumento";
import useSectionContext, { UseSectionContext } from "./useSectionContext";
import Converter from "@/utils/typeConversion";
import { IFatoresPedido } from "./usePedido";
import { NFeProduto } from "@/utils/parseXml";
import { ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext";
import { IProdutoContext } from "./useProduto";
import { useMemo, useState } from "react";
import { useNotification } from "@/app/(app)/(contexts)/NotificationContext";
import { useModal } from "@/app/(app)/(contexts)/ModalContext";

export interface UseChaveContext {

    context: UseSectionContext
    documentos: Record<"nfe" | "cte", DocumentoData>
    dadosImportados: DadosImportados
    loading: boolean

    submitForm: () => void

}


// const createDOM = (xml: string): Document => {

//     const parser = new DOMParser()
//     const doc = () => {

//         const Doc = parser.parseFromString(xml, 'application/xml')
//         return <Doc />

//     } 

//     return
// }

export default function useChaveContext(): UseChaveContext {

    const { stringToFloat, floatToString } = Converter

    const chaveContext = useSectionContext()
    const {
        fornecedorContext: { setFornecedorData },
        pedidoContext: { setPedidoData, updatePedidoControl },
        tabelaContext: { setTabela },
    } = chaveContext

    const { documentos, dadosImportados } = useDocumento()

    const [loading, setLoading] = useState(false)
    const { addNotification } = useNotification()

    // const unitario = useMemo(() => {

    //     if (fornecedorData.usaComposto) 
    //         return controlledInputData.unitarioComposto
    //     else if (fornecedorData.usaUnitarioPedido) 
    //         return controlledInputData.unitarioPedido
    //     else 
    //         return controlledInputData.unitarioNota

    // }, [fornecedorData, controlledInputData])

    const gerarProdutoCadastro = (produtos: NFeProduto[], fornecedor: IFornecedor, pedido: IFatoresPedido): ProdutoCadastro[] => {

        //Iterar sobre produtos e cria uma array do produtosContext então usa o gerar produto em cada um

        const listaProdutosCadastro = produtos.map( produto => {

            const produtoContext: IProdutoContext = {
                st: produto.st,
                codigo: produto.codigo,
                ncm: produto.ncm,
                desconto: fornecedor.usaDesconto 
                    ? '1' 
                    : "1",
                ipi: (produto.st && fornecedor.usaIpi) 
                    ?  floatToString(1 + (stringToFloat(produto.ipi) / 100)) 
                    : "1",
                ipiProporcional: "",
                unitarioNota: produto.unitario,
                unitarioPedido: fornecedor.usaUnitarioPedido 
                    ? produto.unitario 
                    : "",
                unitarioComposto: fornecedor.usaComposto 
                    ? produto.unitario 
                    : "",
                composto1: "",
                composto2: ""
            }
            
            const unitario = (() => {
                if (fornecedor.usaComposto) 
                    return produtoContext.unitarioComposto
                else if (fornecedor.usaUnitarioPedido) 
                    return produtoContext.unitarioPedido
                else 
                    return produtoContext.unitarioNota
            })()

            return {
            
                id:  Date.now().toString(36) + Math.random().toString(36).substring(2),
                codigo: produtoContext.codigo,
                ncm: produtoContext.ncm || '',
                st: produtoContext.st,
                unitario: unitario || '0',
                unitarioNota: produtoContext.unitarioNota || '0',
                composto: [
        
                    produtoContext.composto1 || '', 
                    produtoContext.composto2 || '',
        
                ],
                fatores: {
        
                    base: fornecedor.fatorBase || '1',
                    fatorBaseNormal: (!produtoContext.st) ? fornecedor.fatorBaseNormal : '1',
                    fatorBaseST: (produtoContext.st) ? fornecedor.fatorBaseST : '1',
            
                    transporte: (produtoContext.st) 
                        ? pedido.fatorTransportePedido || '1'
                        : '1',
                    st: (produtoContext.st) 
                        ? pedido.fatorSTPedido || '1'
                        : '1',
                    ipi: produtoContext.ipi || '1',
                    desconto: produtoContext.desconto || '1',
        
                }
            }

        })

        // const produtoCriado = createProduto()
        // setProdutoData(produtoContext)

        return listaProdutosCadastro
    }

    const getTotalProdutosST = (produtos: NFeProduto[]) => {

        const initial = 0
        return floatToString(produtos
            .filter( produto => produto.st )
            .reduce(
                (acc, val) => acc + stringToFloat(val.total),
                initial
            ))

    }

    const gerarFatoresPedido = (fatorBase: string): IFatoresPedido => {

        const { pedido, produtos } = dadosImportados        

        const pedidoResult: IFatoresPedido = {
            usaNcm: true,
            quantidadeProdutos: "",
            fatorTransportePedido: "",
            valorFrete: "",
            fatorFrete: "",
            valorTotalProdutos: "",
            fatorSTPedido: "",
            valorST: "",
            multiploST: "",
            valorTotalProdutosST: ""
        } 

        const resultadoTransporte = (1 + (
            (stringToFloat(pedido.valorFrete) * stringToFloat('3.4')) / 
            (stringToFloat(pedido.valorTotalProdutos) * stringToFloat(fatorBase))
        ))

        const totalPedidoSt = getTotalProdutosST(produtos)
        // console.log(produtos
        //     .filter( produto => produto.st ));
        // console.log(totalPedidoSt);

        const resultadoSt = (1 + (
            (stringToFloat(pedido.valorSt) * stringToFloat('1')) / 
            (stringToFloat(totalPedidoSt) * stringToFloat(fatorBase))
        ))

        setPedidoData(prev => ({
            ...prev,
            usaNcm: true,
            quantidadeProdutos: produtos.length.toString(),
            fatorTransportePedido: floatToString(resultadoTransporte, 3),
            valorFrete: pedido.valorFrete,
            valorTotalProdutos: pedido.valorTotalProdutos, 
            fatorSTPedido: floatToString(resultadoSt, 3),
            valorST: pedido.valorSt,
            valorTotalProdutosST: totalPedidoSt,
        }))

        return {
            ...pedidoResult,
            usaNcm: true,
            quantidadeProdutos: produtos.length.toString(),
            fatorTransportePedido: floatToString(resultadoTransporte, 3),
            valorFrete: pedido.valorFrete,
            fatorFrete: '3,4',
            valorTotalProdutos: pedido.valorTotalProdutos, 
            fatorSTPedido: floatToString(resultadoSt, 3),
            valorST: pedido.valorSt,
            multiploST: '1',
            valorTotalProdutosST: totalPedidoSt,
        }

    }

    const gerarFatoresFornecedor = async () => {

        // Consulta DB fornecedor e importa seus dados
        const cnpj = dadosImportados.pedido.cnpj
        
        try {
            
            const res = await fetch(`/calcular/api/getFornecedor?cnpj=${cnpj}`)

            const fornecedorData: IFornecedor = await res.json()
            setFornecedorData(fornecedorData)

            return fornecedorData


        } catch (error) {
            
            console.log(error);

        }

    }

    const submitForm = async () => {

        try {
         
            setLoading(true)

            const fornecedor = await gerarFatoresFornecedor()
            if (!fornecedor) return

            const pedido = gerarFatoresPedido(fornecedor.fatorBase)

            const produtos = dadosImportados.produtos
            const produtosCadastro = gerarProdutoCadastro(produtos, fornecedor, pedido)

            setPedidoData(prev => ({
                ...prev,
                quantidadeProdutos: produtos.length.toString(),
            }))
            console.log(pedido);
            updatePedidoControl(pedido)
            setTabela(produtosCadastro)

            addNotification({
                tipo: 'sucesso',
                mensagem: 'Tabela gerada com sucesso!'
            })
            setLoading(false)

        } catch (error) {
         
            console.log(error);
            addNotification({
                tipo: 'erro',
                mensagem: `Erro ao gerar tabela: ${error}`
            })

        }

    }

    return {

        context: chaveContext,
        documentos,
        dadosImportados,
        loading,
        submitForm

    }

}