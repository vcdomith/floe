import { IFornecedor } from "@/interfaces/IFornecedor";
import useDocumento, { DadosImportados, DocumentoData, UseDocumento } from "./useDocumento";
import useSectionContext, { UseSectionContext } from "./useSectionContext";
import Converter from "@/utils/typeConversion";
import { IFatoresPedido } from "./usePedido";
import { NFeProduto } from "@/utils/parseXml";
import { ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext";
import { IProdutoContext } from "./useProduto";
import { useMemo, useState } from "react";
import { useNotification } from "@/app/(app)/(contexts)/NotificationContext";
import { useModal } from "@/app/(app)/(contexts)/ModalContext";
import { FornecedorQueryType } from "@/app/(app)/calcular/Tabs/FornecedorTab/FornecedorTab";
import useImportCard from "./useImportCard";

export interface UseChaveContext {

    context: UseSectionContext
    // documentos: Record<"nfe" | "cte", DocumentoData>
    documentosContext: UseDocumento
    // dadosImportados: DadosImportados
    loading: boolean

    submitForm: () => void

    resetContext: () => void

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
        fornecedorContext: { setFornecedorData, updateFornecedorControl },
        pedidoContext: { setPedidoData, updatePedidoControl },
        tabelaContext: { setTabela },
        resetContext: baseReset,
    } = chaveContext
    const documentosContext = useDocumento()

    const { clearDocumento, dadosImportados } = documentosContext

    const [ loading, setLoading ] = useState(false)
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
                ipi: (fornecedor.usaIpi) 
                    ?  floatToString(1 + (stringToFloat(produto.ipi) / 100)) 
                    : "1",
                ipiProporcional: "",
                unitarioNota: produto.unitario,
                unitarioPedido: fornecedor.usaUnitarioPedido 
                    ? "" 
                    : "",
                unitarioComposto: fornecedor.usaComposto 
                    ? "" 
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

    const gerarFatoresPedido = (fornecedor: IFornecedor): IFatoresPedido => {

        const { fatorBase, usaSt, usaTransporte} = fornecedor
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

        let resultadoTransporte: number | undefined
        if (usaTransporte) {
            resultadoTransporte = (1 + (
                (stringToFloat(pedido.valorFrete) * stringToFloat('3.4')) / 
                (stringToFloat(pedido.valorTotalProdutos) * stringToFloat(fatorBase))
            ))
        }
        if (Number.isNaN(resultadoTransporte) || resultadoTransporte === null || resultadoTransporte === undefined) {
            resultadoTransporte = 1
        }

        const totalPedidoSt = getTotalProdutosST(produtos)
        // console.log(produtos
        //     .filter( produto => produto.st ));
        // console.log(totalPedidoSt);

        let resultadoSt: number | undefined
        if (usaSt) {
            resultadoSt = (1 + (
                (stringToFloat(pedido.valorSt) * stringToFloat('1')) / 
                (stringToFloat(totalPedidoSt) * stringToFloat(fatorBase))
            ))
        }
        if (Number.isNaN(resultadoSt) || resultadoSt === null || resultadoSt === undefined) {
            resultadoSt = 1
        }


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
        // console.log(dadosImportados);
        // console.log(cnpj);
        
        try {
            
            const type: FornecedorQueryType = 'cnpj'

            const res = await fetch(
                `/calcular/api/getFornecedor?type=${type}&cnpj=${cnpj}`
            )
            if (res.status !== 200) {
                setLoading(false)
                addNotification({
                    tipo: 'erro',
                    mensagem: `Erro ao gerar tabela: Erro ao buscar informações, fornecedor ${dadosImportados.pedido.fornecedor.split(' ')[0]} ou cnpj não cadastrado`
                })
                throw new Error('Erro ao buscar informações, fornecedor ou cnpj não cadastrado')
            }

            const fornecedorData: IFornecedor = await res.json()
            setFornecedorData(fornecedorData)
            updateFornecedorControl(fornecedorData)

            return fornecedorData


        } catch (error) {
            
            console.error(error);
            return null

        }

    }

    const submitForm = async () => {

        try {
         
            setLoading(true)

            const fornecedor = await gerarFatoresFornecedor()
            if (fornecedor === null) return new Error('Erro ao gerar Fatores Fornecedor')

            const pedido = gerarFatoresPedido(fornecedor)

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
         
            console.log('submitform', error);
            setLoading(false)
            addNotification({
                tipo: 'erro',
                mensagem: `Erro ao gerar tabela: ${error}`
            })
            return

        }

    }

    const resetContext = () => {
        baseReset()
        clearDocumento()
    }

    return {

        context: chaveContext,
        documentosContext,
        loading,
        submitForm,
        resetContext,

    }

}