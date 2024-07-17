'use client'
import { getTabelas, getTabelasObject } from '@/utils/calculoTabelas'
import { produtoCadastro, useCalcular } from '../context/CalcularContext'
import TableHeader from './TabelaHeader/TableHeader'
import TabelaRow from './TabelaRow/TabelaRow'
import { AnimatePresence } from 'framer-motion'
import Search from '@/components/Search/Search'
import { useMemo } from 'react'
import { SearchFieldKeys } from '@/hooks/useFilter'

import style from './TabelaSection.module.scss'
import SelectFornecedor from '@/components/SelectFornecedor/SelectFornecedor'

export default function TabelaSection() {

    const {
        tabela, 
        setTabela, 
        tabelaValid,
        cadastrarPedidoDB, 
        filterContext, 
        pedidoContext: {pedidoData: {quantidadeProdutos}}
    } = useCalcular()
    const {searchParam, setSearchParam, searchField, setSearchFieldCapitalized} = filterContext

    const fieldKeys: SearchFieldKeys[] = ['unitario', 'codigo']

    const tabelaFilter = useMemo(() => 
        tabela.filter( item => (item[searchField.toLowerCase() as keyof produtoCadastro] as string).includes(searchParam) )
    , [searchParam, tabela, searchField])

    return (
        <section className={style.tabelaSection}>
            <div className={style.content}>

                <span className={style.options}>
                    <SelectFornecedor 
                        omitSearch={true}
                        fornecedoresControle={fieldKeys} 
                        fornecedor={searchField} 
                        setFornecedor={setSearchFieldCapitalized as (() => void)} 
                    />
                    <Search 
                        className={style.search} 
                        searchParam={searchParam} 
                        setSearchParam={setSearchParam} 
                        textInput={(searchField.toLowerCase() === 'codigo')}
                    />
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
                        <p>Nenhum produto cadastrado ainda, use as abas para calcular eles.</p>
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
                    <p>É preciso cadastrar {quantidadeProdutos} itens para cadastrar pedido (faltam {parseInt(quantidadeProdutos) - tabela.length})</p>
                </span>
                }
                <button 
                    className={style.submit}
                    disabled={!tabelaValid}
                    onClick={() => cadastrarPedidoDB()}
                >Cadastrar Pedido</button>
            </span>

        </section>
    )


}