import { IFornecedor } from "@/interfaces/IFornecedor";
import usePedido, { IFatoresPedido } from "./usePedido";
import useFornecedor from "./useFornecedor";

export interface FatoresControlReturn {

    fornecedorControl: IFornecedor
    updateFornecedorControl: (fornecedor: IFornecedor) => void

    pedidoControl: IFatoresPedido
    updatePedidoControl: (pedido: IFatoresPedido) => void

    resetControl: () => void
}

//This might not be needed because the hook is to be used after fatores have been chosen
const INITIAL_STATE_FORNECEDOR: IFornecedor = {
    nome: "",
    fatorBase: "",
    fatorBaseNormal: "",
    fatorBaseST: "",
    usaTransporte: false,
    usaSt: false,
    usaDesconto: false,
    usaIpi: false,
    usaIpiUniversal: false,
    usaUnitarioPedido: false,
    usaComposto: false
}
const INITIAL_STATE_PEDIDO: IFatoresPedido = {
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

export default function useFatoresControl(): FatoresControlReturn {

    const {
        fornecedorData: fornecedorControl,
        setFornecedorData,
        resetFornecedor
    } = useFornecedor()

    const {
        pedidoData: pedidoControl,
        setPedidoData,
        resetPedido
    } = usePedido()

    function updateFornecedorControl(fornecedor: IFornecedor) {
        setFornecedorData(fornecedor)
    }

    function updatePedidoControl(pedido: IFatoresPedido) {
        setPedidoData(pedido)
    }

    function resetControl() {
        resetFornecedor()
        resetPedido()
    }

    return {
        fornecedorControl,
        updateFornecedorControl,
        pedidoControl,
        updatePedidoControl,
        resetControl
    }

}