'use client'
import { getTabelas } from '@/utils/calculoTabelas'
import { useCalcular } from '../context/CalcularContext'
import TableHeader from './TabelaHeader/TableHeader'
import TabelaRow from './TabelaRow/TabelaRow'
import { AnimatePresence } from 'framer-motion'
import Search from '@/components/Search/Search'
import { useMemo } from 'react'
import { SearchFieldKeys } from '@/hooks/useFilter'

import style from './TabelaSection.module.scss'

export default function TabelaSection() {

    const {
        tabela, 
        setTabela, 
        tabelaValid, 
        filterContext, 
        pedidoContext: {pedidoData: {quantidadeProdutos}}
    } = useCalcular()
    const {searchParam, setSearchParam, searchField, setSearchField} = filterContext

    const fieldKeys: SearchFieldKeys[] = ['unitario', 'codigo']

    const tabelaFilter = useMemo(() => 
        tabela.filter( item => (item[searchField] as string).includes(searchParam) )
    , [searchParam, tabela, searchField])

    console.log(tabela, tabelaFilter);

    return (
        <section className={style.tabelaSection}>
            <div className={style.content}>

                <span className={style.options}>
                    <select name="" id="" value={searchField} onChange={(e) => setSearchField(e.target.value as SearchFieldKeys)}>
                        {fieldKeys.map( field => 
                            <option key={field} value={field}>{field}</option>
                        )}
                    </select>
                    <Search className={style.search} searchParam={searchParam} setSearchParam={setSearchParam} />
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
            </div>

            <span className={style.footer}>
                {(!tabelaValid && (tabela.length > 0))&&
                <span className={style.message}>
                    <svg width="20" height="20" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M462 433L250.5 67L144.75 250L39 433H462Z" stroke="black" strokeWidth="40" strokeLinejoin="bevel"/>
                        <path d="M250 198V380" stroke="black" strokeWidth="40"/>
                    </svg>
                    <p>É preciso cadastrar {quantidadeProdutos} itens (faltam {parseInt(quantidadeProdutos) - tabela.length})</p>
                </span>
                }
                <button 
                    className={style.submit}
                    disabled={!tabelaValid}
                >Cadastrar Pedido</button>
            </span>

        </section>
    )


}