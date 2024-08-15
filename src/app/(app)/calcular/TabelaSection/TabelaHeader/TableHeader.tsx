
import style from './TabelaHeader.module.scss'

export default function TabelaHeader() {

    return (

        <span className={style.header}>
            {/* <div>Tipo</div>
            <div>Código <span>(NCM)</span></div>
            <div>Unitário <span>(Composto)</span></div>
            <div>Tabela 1</div>
            <div>Tabela 2</div>
            <div>Tabela 3</div>
            <div>Fatores</div> */}
            <div><p>Tipo</p></div>
            <div><p>Código</p> <p>(NCM)</p></div>
            <div><p>Unitário</p> <p>(Composto)</p></div>
            <div><p>Tabela 1</p></div>
            <div><p>Tabela 2</p></div>
            <div><p>Tabela 3</p></div>
            <div><p>Fatores</p></div>
        </span>

    )

}