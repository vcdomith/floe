import { ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext"
import { Dispatch, SetStateAction, useState } from "react"
import { UseFornecedor } from "./useFornecedor"
import { IFornecedor } from "@/interfaces/IFornecedor"
import { IFatoresPedido } from "./usePedido"
import { ContextControl } from "./useContextControl"

export interface UseTabela {

    tabela: ProdutoCadastro[]
    setTabela: Dispatch<SetStateAction<ProdutoCadastro[]>>
    adicionarProduto: (produto: ProdutoCadastro) => void
    removeProduto: (id: string) => void
    updateProdutoTabela: (id: string, updatedProduto: ProdutoCadastro) => void
    updateFatoresTabela: () => void
    resetTabela: () => void

}

export default function useTabela(ctx: ContextControl): UseTabela {

    const { 
        fornecedorCtx: { fornecedorData }, 
        pedidoCtx: { pedidoData },
    } = ctx

    const [tabela, setTabela] = useState<ProdutoCadastro[]>([])

    const adicionarProduto = (produto: ProdutoCadastro) => {
        setTabela( prev => ([...prev, produto]) )
    }

    const removeProduto = (id: string) => {
        setTabela(prev => {
            const updated = [...prev]
            const removed = updated.filter( produto => produto.id !== id )
            return removed
        })
    }

    const updateProdutoTabela = (id: string, updatedProduto: ProdutoCadastro) => {
        setTabela((prev) => {
            const newTabela = [...prev]
            const index = newTabela.indexOf(newTabela.filter( produto => produto.id === id )[0])
            newTabela[index] = updatedProduto
            return newTabela
        })
    }

    const updateFatoresTabela = () => {

        setTabela((prev) => {

            //Exemplo errado de como atualizar um objeto mais complexo no React, abaixo está a maneira correta de lidar com tais objetos

            // const newTabela = [...prev]
            // newTabela.map( produto => {
            //     const newFatores = {
            //         base: fornecedorData.fatorBase || '1',
            //         fatorBaseNormal: (!produto.st) ? fornecedorData.fatorBaseNormal : '1',
            //         fatorBaseST: (produto.st) ? fornecedorData.fatorBaseST : '1',
            
            //         transporte: (produto.st) 
            //             ? pedidoData.fatorTransportePedido || '1'
            //             : '1',
            //         st: (produto.st) 
            //             ? pedidoData.fatorSTPedido || '1'
            //             : '1',
            //     }
            //     produto.fatores = {...produto.fatores, ...newFatores}
            // })
            // return newTabela

            const newTabela = prev.map( produto => {

                const newFatores = {
                    base: fornecedorData.fatorBase || '1',
                    fatorBaseNormal: (!produto.st) ? fornecedorData.fatorBaseNormal : '1',
                    fatorBaseST: (produto.st) ? fornecedorData.fatorBaseST : '1',
            
                    transporte: (produto.st) 
                        ? pedidoData.fatorTransportePedido || '1'
                        : '1',
                    st: (produto.st) 
                        ? pedidoData.fatorSTPedido || '1'
                        : '1',
                }

                return {
                    ...produto,
                    fatores: {
                        ...produto.fatores,
                        ...newFatores,
                    },
                }
            })
            
            return newTabela
        })
    }

    const resetTabela = () => {
        setTabela([])
    }

    return {
        tabela,
        setTabela,
        adicionarProduto,
        removeProduto,
        updateProdutoTabela,
        updateFatoresTabela,
        resetTabela,
    }

}