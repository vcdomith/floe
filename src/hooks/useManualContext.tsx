import { useNotification } from "@/app/(app)/(contexts)/NotificationContext";
import useSectionContext, { UseSectionContext } from "./useSectionContext";
import { ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext";


export interface UseManualContext {

    context: UseSectionContext

    submitForm: () => void
    

}

export default function useManualContext(): UseManualContext {

    const { addNotification } = useNotification()
    const context = useSectionContext()

    const submitForm = () => {

        const {
            pedidoContext: { pedidoData },
            produtoContext: { resetForm, codigoInputRef },
            filterContext: { setSearchParam },
            tabelaContext: { adicionarProduto },
            produtoValid,
            tabelaValid,
            unitario,
            controlledInputData,
        } = context

        if(!produtoValid) {
            addNotification({tipo: 'erro', mensagem: 'Não foi possível adicionar o produto na tabela, preencha todos os dados!'}) 
            return
        } 
        
        if(tabelaValid) {
            addNotification({tipo: 'erro', mensagem: `Não foi possível adicionar o produto na tabela, limite de ${pedidoData.quantidadeProdutos} produtos atingido!`}) 
            return
        } 

        let produto: ProdutoCadastro = {
            
            id: Date.now().toString(36) + Math.random().toString(36).substring(2),
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

        setSearchParam('')
        adicionarProduto(produto)
        resetForm()
        codigoInputRef?.current?.focus()

    }

    return {
        context,
        submitForm
    }

}