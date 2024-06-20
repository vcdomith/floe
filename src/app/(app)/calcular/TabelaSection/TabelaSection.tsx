'use client'
import { useCalcular } from '../context/CalcularContext'
import style from './TabelaSection.module.scss'

export default function TabelaSection() {

    const {tabela} = useCalcular()

    return (
        <section className={style.tabela}>
            <div className={style.content}>
                <span style={{ display: 'flex', gap: '0.5rem'}}>
                    <div style={{ flex: 1}}>Tipo</div>
                    <div style={{ flex: 2}}>Código</div>
                    <div style={{ flex: 2}}>Unitário</div>
                    <div style={{ flex: 2}}>Tabela 1</div>
                    <div style={{ flex: 2}}>Tabela 2</div>
                    <div style={{ flex: 2}}>Tabela 3</div>
                </span>
                {tabela.map(({id, st, codigo, unitario}) => 
                    <span key={id} style={{ display: 'flex', gap: '0.5rem'}}>
                        <div style={{ flex: 1, backgroundColor: `${st ? '#53015828' : '' }`}}>{st ? 'ST' : ''}</div>
                        <div style={{ flex: 2 }}>{codigo}</div>
                        <div style={{ flex: 2 }}>{unitario}</div>
                        <div style={{ flex: 2 }}>Tabela 1</div>
                        <div style={{ flex: 2 }}>Tabela 2</div>
                        <div style={{ flex: 2 }}>Tabela 3</div>
                    </span>
                )}
                {/* {tabela.map( produto =>
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
                )} */}
            </div>
        </section>
    )


}