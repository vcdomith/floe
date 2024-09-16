import { svgsUtil } from "@/components/SvgArray/SvgUtil";

export default function Pedidos() {

    return <div
        style={{ display: 'flex', justifyContent: 'center', height: '100%', width: '100%' }}
    >
        {svgsUtil.base}
        <p>Nenhum pedido selecionado</p>
    </div>

}