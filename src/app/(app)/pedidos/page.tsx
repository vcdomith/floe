import { svgsUtil } from "@/components/SvgArray/SvgUtil";

import style from './nenhumPedido.module.scss'
import Highlight from "@/components/Highlight/Highlight";

export default function Pedidos() {

    return <div
        className={style.noMatch}
        // style={{ display: 'flex', justifyContent: 'center', height: '100%', width: '100%' }}
    >
        {svgsUtil.unitarioNota}
        <p>Nenhum <Highlight>pedido</Highlight> selecionado</p>
    </div>

}