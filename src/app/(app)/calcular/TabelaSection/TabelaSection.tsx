'use client'
import { getTabelas } from '@/utils/calculoTabelas'
import { useCalcular } from '../context/CalcularContext'
import style from './TabelaSection.module.scss'
import TableHeader from './TabelaHeader/TableHeader'
import TabelaRow from './TabelaRow/TabelaRow'
import { AnimatePresence } from 'framer-motion'

export default function TabelaSection() {

    const {tabela, setTabela} = useCalcular()

    return (
        <section className={style.tabelaSection}>
            <div className={style.content}>

                <span>
                    <input type="text" />
                    <button>a</button>
                </span>

                <div className={style.tabela}>

                    <TableHeader />
                    <div className={style.tabelaBody}>
                    <AnimatePresence mode='popLayout'>
                    {tabela.map((produto) => 
                        <TabelaRow produto={produto} setTabela={setTabela} key={produto.id} />
                    )}
                    </AnimatePresence>
                    </div>

                </div>
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
            <button className={style.submit}>Cadastrar Pedido</button>
        </section>
    )


}