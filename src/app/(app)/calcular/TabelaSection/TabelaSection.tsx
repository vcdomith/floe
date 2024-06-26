'use client'
import { getTabelas } from '@/utils/calculoTabelas'
import { useCalcular } from '../context/CalcularContext'
import style from './TabelaSection.module.scss'
import TableHeader from './TabelaHeader/TableHeader'
import TabelaRow from './TabelaRow/TabelaRow'
import { AnimatePresence } from 'framer-motion'
import Search from '@/components/Search/Search'
import { useMemo } from 'react'

export default function TabelaSection() {

    const {tabela, setTabela, searchContext} = useCalcular()
    const [search, setSearch] = searchContext

    const tabelaFilter = useMemo(() => 
        tabela.filter( item => item.unitario.includes(search) )
    , [search, tabela])

    console.log(tabela, tabelaFilter);

    return (
        <section className={style.tabelaSection}>
            <div className={style.content}>

                <span className={style.options}>
                    <Search searchParam={search} setSearchParam={setSearch} />
                </span>

                <div className={style.tabela}>

                    <TableHeader />
                    <div className={style.tabelaBody}>
                    <AnimatePresence mode='popLayout'>
                    {(tabelaFilter.length !== 0)
                    ?
                    tabelaFilter.map((produto) => 
                        <TabelaRow produto={produto} setTabela={setTabela} key={produto.id} />
                    )   
                    :
                    <div className={style.empty}>
                        Nenhum produto cadastrado ainda, use as abas para calcular eles.
                    </div>
                    }
                    
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