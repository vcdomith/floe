'use client'
import useFornecedor, { UseFornecedor } from "@/hooks/useFornecedor";
import usePedido, { IFatoresPedido, UsePedido } from "@/hooks/usePedido";
import useProduto, { UseProduto } from "@/hooks/useProduto";
import { IFornecedor } from "@/interfaces/IFornecedor";
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNotification } from "../../(contexts)/NotificationContext";
import useFilter, { useFilterReturn } from "@/hooks/useFilter";
import { dbConnect } from "@/utils/db/supabase";


export interface CalcularContext {

    fornecedorContext: UseFornecedor
    pedidoContext: UsePedido
    produtoContext: UseProduto
    getDisplayControl: (st: boolean) => IDisplayControl
    displayControl: IDisplayControl 
    produtoIsValid: boolean

    tabelaValid: boolean
    tabela: ProdutoCadastro[]
    setTabela: Dispatch<SetStateAction<ProdutoCadastro[]>>
    removeProduto: (id: number) => void
    updateProdutoTabela: (id: number, updatedProduto: ProdutoCadastro) => void
    updateFatoresTabela: () => void
    cadastrarPedidoDB: () => Promise<void>
    filterContext: useFilterReturn
    
    submitForm: () => void
    resetContext: () => void

    calcularSection: 'Fatores' | 'Tabela'
    setCalcularSection : Dispatch<SetStateAction<"Fatores" | "Tabela">>

}

export interface FatoresContext {

    base: string
    fatorBaseNormal: string
    fatorBaseST: string

    transporte: string
    st: string

    ipi: string
    desconto: string 

}

export interface ProdutoCadastro {

    id: number
    codigo: string
    ncm: string
    
    st: boolean
    unitario: string
    unitarioNota: string
    composto: string[]

    fatores: FatoresContext

}

export interface IDisplayControl {

    fatorTransportePedido: boolean
    fatorSTPedido: boolean
    ncm: boolean
    desconto: boolean
    ipi: boolean
    unitarioPedido: boolean
    unitarioNota: boolean
    unitarioComposto: boolean

}

const INITIAL_STATE_DIFF_CONTROL: DifferenceControl = {
    nome: false,
    fatorBase: false,
    fatorBaseNormal: false,
    fatorBaseST: false,
    usaTransporte: false,
    usaSt: false,
    usaDesconto: false,
    usaIpi: false,
    usaIpiUniversal: false,
    usaUnitarioPedido: false,
    usaComposto: false,
    usaNcm: false,
    quantidadeProdutos: false,
    fatorTransportePedido: false,
    valorFrete: false,
    fatorFrete: false,
    valorTotalProdutos: false,
    fatorSTPedido: false,
    valorST: false,
    multiploST: false,
    valorTotalProdutosST: false
}

export interface DifferenceControl extends Record<keyof IFornecedor, boolean>, Record<keyof IFatoresPedido, boolean> {}

export const CalcularContext = createContext<CalcularContext | undefined>(undefined)
CalcularContext.displayName = 'Calcular'

export const useCalcular = () => {
    const context = useContext(CalcularContext)
    if (!context) throw new Error('useCalcular must be used within a CalcularProvider')
    return context
}

export const CalcularProvider = ({ children }: { children: React.ReactNode }) => {

    const {notifications, addNotification} = useNotification()

    const supabase = dbConnect()

    const fornecedorContext = useFornecedor()
    const pedidoContext = usePedido()
    const produtoContext = useProduto()
    const filterContext = useFilter()

    // TABELA CONTEXT _ TODO
    const [calcularSection, setCalcularSection] = useState<'Fatores' | 'Tabela'>('Fatores')

    const {fornecedorData, resetFornecedor, resetFornecedorControl} = fornecedorContext
    const {pedidoData, resetPedido, resetPedidoControl} = pedidoContext
    const {produtoData, resetForm, codigoInputRef} = produtoContext
    const { setSearchParam } = filterContext

    // const fornecedorValid = isEqual(fornecedorData, fornecedorControl)
    // console.log('fornecedorValid', fornecedorValid);
    // console.log(getDifferentKeys(fornecedorData, fornecedorControl));

    // const pedidoValid = isEqual(pedidoData, pedidoControl)
    // console.log('pedidoValid', pedidoValid);
    // console.log(getDifferentKeys(pedidoData, pedidoControl));

    type ControlledInputDataKeys = keyof typeof controlledInputData;
    const controlledInputData = useMemo(() => {
        return {...fornecedorData, ...pedidoData, ...produtoData}
    }, [fornecedorData, pedidoData, produtoData])

    const [tabela, setTabela] = useState<ProdutoCadastro[]>([])

    const adicionarProduto = (produto: ProdutoCadastro) => {
        setTabela( prev => ([...prev, produto]) )
    }

    const removeProduto = (id: number) => {
        setTabela(prev => {
            const updated = [...prev]
            const removed = updated.filter( produto => produto.id !== id )
            return removed
        })
    }

    const updateProdutoTabela = (id: number, updatedProduto: ProdutoCadastro) => {
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

    const resetContext = () => {

        resetFornecedor()
        resetFornecedorControl()
        
        resetPedido()
        resetPedidoControl()

        resetForm()
        setTabela([])
    }

    type DisplayControlKeys = typeof displayControl;
    const getDisplayControl = (st: boolean = produtoData.st): IDisplayControl => (st)
        ? {

            fatorTransportePedido: fornecedorData.usaTransporte,
            fatorSTPedido: fornecedorData.usaSt,
            ncm: pedidoData.usaNcm,
            desconto: fornecedorData.usaDesconto,
            ipi: fornecedorData.usaIpi,

            // unitarioNota: (fornecedorData.composto) ? true : fornecedorData.unitarioNota,
            unitarioNota: true,
            unitarioPedido: (fornecedorData.usaUnitarioPedido && !fornecedorData.usaComposto), 
            unitarioComposto: (fornecedorData.usaUnitarioPedido && fornecedorData.usaComposto),

        }
        : {

            fatorTransportePedido: false,
            fatorSTPedido: false,
            ncm: pedidoData.usaNcm,
            desconto: fornecedorData.usaDesconto,
            ipi: fornecedorData.usaIpiUniversal,

            // unitarioNota: (fornecedorData.usaComposto) ? true : fornecedorData.usaUnitarioPedido,
            unitarioNota: true,
            unitarioPedido: (fornecedorData.usaUnitarioPedido && !fornecedorData.usaComposto), 
            unitarioComposto: (fornecedorData.usaUnitarioPedido && fornecedorData.usaComposto),

        }
                              
    const displayControl = getDisplayControl()
    const validKeys = Object.keys(displayControl)
                        .filter( key => displayControl[key as keyof DisplayControlKeys] )

    interface BaseCheck {
        
        quantidadeProdutos: string

        codigo: string
    
        fatorBase: string
        fatorBaseNormal: string
        fatorBaseST: string 

        [key: string]: any
        
    }

    const produtoValuesToCheck = useMemo(() => {

        const baseCheck: BaseCheck = {
            
            quantidadeProdutos: pedidoData.quantidadeProdutos,

            codigo: produtoData.codigo,
    
            fatorBase: fornecedorData.fatorBase,
            fatorBaseNormal: fornecedorData.fatorBaseNormal,
            fatorBaseST: fornecedorData.fatorBaseST,   
        }

        validKeys.map((key) => {
            baseCheck[key] = controlledInputData[key as ControlledInputDataKeys]
        })

        return baseCheck

    }, [fornecedorData, produtoData, pedidoData, validKeys, controlledInputData])

    const produtoIsValid = useMemo(() => {
        return Object.values(produtoValuesToCheck).every( value => value !== '' )
    }, [produtoValuesToCheck])

    const tabelaValid = useMemo(() => {
        return tabela.length === parseInt(pedidoData.quantidadeProdutos)
    }, [tabela, pedidoData])

    const unitario = useMemo(() => {

        if (fornecedorData.usaComposto) 
            return controlledInputData.unitarioComposto
        else if (fornecedorData.usaUnitarioPedido) 
            return controlledInputData.unitarioPedido
        else 
            return controlledInputData.unitarioNota

    }, [fornecedorData, controlledInputData])

    const submitForm = () => {

        let produto: ProdutoCadastro = {
            
            id: new Date().getTime(),
            codigo: controlledInputData.codigo,
            ncm: controlledInputData.ncm || '',
            st: controlledInputData.st,
            unitario: unitario || '0',
            unitarioNota: controlledInputData.unitarioNota || '0',
            composto: [

                controlledInputData.composto1 || '', 
                controlledInputData.composto2 || '',

            ],
            fatores: {

                base: controlledInputData.fatorBase || '1',
                fatorBaseNormal: (!controlledInputData.st) ? controlledInputData.fatorBaseNormal : '1',
                fatorBaseST: (controlledInputData.st) ? controlledInputData.fatorBaseST : '1',
        
                transporte: (controlledInputData.st) 
                    ? controlledInputData.fatorTransportePedido || '1'
                    : '1',
                st: (controlledInputData.st) 
                    ? controlledInputData.fatorSTPedido || '1'
                    : '1',
                ipi: controlledInputData.ipi || '1',
                desconto: controlledInputData.desconto || '1',

            }
        }

        if(!produtoIsValid) {
            addNotification({tipo: 'erro', mensagem: 'Não foi possível adicionar o produto na tabela, preencha todos os dados!'}) 
            return
        } 
        
        if(tabelaValid) {
            addNotification({tipo: 'erro', mensagem: `Não foi possível adicionar o produto na tabela, limite de ${pedidoData.quantidadeProdutos} produtos atingido!`}) 
            return
        } 

        setSearchParam('')
        adicionarProduto(produto)
        resetForm()
        codigoInputRef?.current?.focus()

    }

    const cadastrarPedidoDB = async () => {

        if (tabela.length === 0) {
            addNotification({
                tipo: 'erro',
                mensagem: 'Não é possível cadastrar um pedido vazio!'
            })
        }

        if (tabela.length !== parseInt(pedidoData.quantidadeProdutos)) {
            addNotification({
                tipo: 'erro',
                mensagem: `Não é possível cadastrar o pedido, são necessários ${pedidoData.quantidadeProdutos} produtos!`
            })
        }

        try {
            
            const { data , error } = await supabase
                .from('cadastros')
                .insert({
                    fornecedor: fornecedorData.nome,
                    produtos: tabela
                })

            addNotification({
                tipo: 'sucesso',
                mensagem: 'Cadastro realizado com sucesso!'
            })

        } catch (error) {
            
            addNotification({
                tipo: 'erro',
                mensagem: JSON.stringify(error)
            })

        }

    }

    return <CalcularContext.Provider
        value={{
            fornecedorContext,
            pedidoContext,
            produtoContext,
            getDisplayControl,
            displayControl,
            produtoIsValid,

            tabela,
            tabelaValid,
            setTabela,
            removeProduto,
            updateProdutoTabela,
            updateFatoresTabela,
            cadastrarPedidoDB,
            filterContext,

            submitForm,
            resetContext,

            calcularSection,
            setCalcularSection,
        }}
    >
        {children}
    </CalcularContext.Provider>

}