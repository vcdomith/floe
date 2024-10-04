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

export interface UseChaveContext {

    context: UseSectionContext
    documentos: Record<"nfe" | "cte", DocumentoData>
    dadosImportados: DadosImportados
    loading: boolean

    submitForm: () => void

}

export default function useChaveContext(): UseChaveContext {

    const { stringToFloat, floatToString } = Converter

    const chaveContext = useSectionContext()
    const {
        fornecedorContext: { fornecedorData, setFornecedorData },
        pedidoContext: { pedidoData, setPedidoData },
        produtoContext: { setProdutoData },
        contextControl: { controlledInputData },
        tabelaContext: { setTabela },
    } = chaveContext

    const { documentos, dadosImportados } = useDocumento()

    const [loading, setLoading] = useState(false)
    const { addNotification } = useNotification()

    const unitario = useMemo(() => {

        if (fornecedorData.usaComposto) 
            return controlledInputData.unitarioComposto
        else if (fornecedorData.usaUnitarioPedido) 
            return controlledInputData.unitarioPedido
        else 
            return controlledInputData.unitarioNota

    }, [fornecedorData, controlledInputData])

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

            console.log(produtoContext);

            return {
            
                id:  parseInt(Date.now().toString(36) + Math.random().toString(36).substring(2)),
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
                (acc, val) => acc + parseFloat(val.total),
                initial
            ))

    }

    const gerarFatoresPedido = (fatorBase: string): IFatoresPedido => {

        const { pedido, produtos } = dadosImportados        

        const pedidoResult: IFatoresPedido = {
            usaNcm: false,
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
        console.log('resultadoTransporte', resultadoTransporte);
        console.log(floatToString(resultadoTransporte));

        // setPedidoData(prev => ({
        //     ...prev, 
        //     ['fatorTransportePedido' as keyof IFatoresPedido]: floatToString(resultadoTransporte, 3)
        // }))

        const totalPedidoSt = getTotalProdutosST(produtos)

        const resultadoSt = (1 + (
            (stringToFloat(pedido.valorSt) * stringToFloat('1')) / 
            (stringToFloat(totalPedidoSt) * stringToFloat(fatorBase))
        ))
        console.log('resultadoSt', resultadoSt);
        console.log(floatToString(resultadoSt));

        setPedidoData(prev => ({
            ...prev,
            ['fatorTransportePedido' as keyof IFatoresPedido]: floatToString(resultadoTransporte, 3), 
            ['fatorSTPedido' as keyof IFatoresPedido]: floatToString(resultadoSt, 3)
        }))

        return {
            ...pedidoResult,
            fatorTransportePedido: floatToString(resultadoTransporte, 3),
            fatorSTPedido: floatToString(resultadoSt, 3)
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

        // A partir dos fatores itera produtos e gera-os

        // setTabela(produtosGerados)


    }

    return {

        context: chaveContext,
        documentos,
        dadosImportados,
        loading,
        submitForm

    }

}