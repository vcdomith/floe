import { UseFornecedor } from "./useFornecedor";
import { IFatoresPedido, UsePedido } from "./usePedido";
import { IProdutoContext, UseProduto } from "./useProduto";
import { useMemo } from "react";
import { IFornecedor } from "@/interfaces/IFornecedor";
import { IProduto } from "@/interfaces/IProduto";

export interface UseContextControl {

    controlledInputData: ControlledInputData
    getDisplayControl: (st?: boolean) => IDisplayControl
    produtoValid: boolean

}

export interface ControlledInputData extends 
    IFornecedor, 
    IFatoresPedido, 
    IProdutoContext
    // Omit<IProduto, 'fatores' | 'unitario' | 'id' >  
{}

export interface ContextControl {
    fornecedorCtx: UseFornecedor
    pedidoCtx: UsePedido
    produtoCtx: UseProduto
}

export interface IDisplayControl {

    fatorTransportePedido: boolean
    fatorSTPedido: boolean
    ncm: boolean
    desconto: boolean
    ipi: boolean
    ipiProporcional: boolean
    unitarioPedido: boolean
    unitarioNota: boolean
    unitarioComposto: boolean

}

export default function useContextControl(ctx: ContextControl): UseContextControl {

    const { 
        fornecedorCtx: { fornecedorData }, 
        pedidoCtx: { pedidoData }, 
        produtoCtx: { produtoData }, 
    } = ctx

    const controlledInputData: ControlledInputData = useMemo(() => {
        return {...fornecedorData, ...pedidoData, ...produtoData}
    }, [fornecedorData, pedidoData, produtoData])

    const getDisplayControl = (st: boolean = produtoData.st): IDisplayControl => (st)
        ? {

            fatorTransportePedido: fornecedorData.usaTransporte,
            fatorSTPedido: fornecedorData.usaSt,
            ncm: pedidoData.usaNcm,
            desconto: fornecedorData.usaDesconto,
            ipi: fornecedorData.usaIpi,
            ipiProporcional: (fornecedorData.usaIpi && fornecedorData.usaIpiProporcional),

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
            ipi: fornecedorData.usaIpi,
            ipiProporcional: (fornecedorData.usaIpi && fornecedorData.usaIpiProporcional),

            // unitarioNota: (fornecedorData.usaComposto) ? true : fornecedorData.usaUnitarioPedido,
            unitarioNota: true,
            unitarioPedido: (fornecedorData.usaUnitarioPedido && !fornecedorData.usaComposto), 
            unitarioComposto: (fornecedorData.usaUnitarioPedido && fornecedorData.usaComposto),

        }
                              
    const displayControl = getDisplayControl()
    const validKeys = Object.keys(displayControl)
        .filter( key => displayControl[key as keyof IDisplayControl] )

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
            baseCheck[key] = controlledInputData[key as keyof ControlledInputData]
        })

        return baseCheck

    }, [fornecedorData, produtoData, pedidoData, validKeys, controlledInputData])

    const produtoValid = useMemo(() => {
        return Object.values(produtoValuesToCheck).every( value => value !== '' )
    }, [produtoValuesToCheck])

    return {
        controlledInputData,
        getDisplayControl,
        produtoValid,
    }

}