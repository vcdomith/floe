import { svgsUtil } from "@/components/SvgArray/SvgUtil";
import style from './fornecedores.module.scss'
import Highlight from "@/components/Highlight/Highlight";

export default function Fornecedores() {

    return (
        <div className={style.noFornecedor}>
            {svgsUtil.fornecedor}
            <p>Nenhum <Highlight>fornecedor</Highlight> selecionado</p>
        </div>
    )

}