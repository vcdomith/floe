'use client'
import { useCalcular } from '../context/CalcularContext'
import style from './TabelaSection.module.scss'

export default function TabelaSection() {

    const {tabela} = useCalcular()

    return (
        <section className={style.tabela}>
            <div className={style.content}>
                {tabela.map( produto =>
                <div key={produto.id} style={{ display: 'flex', gap: '1rem' }}>
                    <div>
                    {Object.keys(produto).map( key => 
                        <p key={key}>{key}</p>
                    )}
                    </div>
                    <div>
                    {Object.values(produto).map( value => 
                        <p key={value}>{(typeof value === 'object') ? JSON.stringify(value) : `${value}` }</p>
                    )}
                    </div>
                </div> 
                )}
            </div>
        </section>
    )


}