'use client'
import { getTabelas, getTabelasObject } from '@/utils/calculoTabelas'
import { Contexts, ProdutoCadastro, useCalcular, useManual } from '../context/CalcularContext'
import TableHeader from './TabelaHeader/TabelaHeader'
import TabelaRow from './TabelaRow/TabelaRow'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import Search from '@/components/Search/Search'
import React, { useEffect, useMemo, useRef } from 'react'
import { SearchFieldKeys } from '@/hooks/useFilter'

import style from './TabelaSection.module.scss'
import SelectFornecedor from '@/components/SelectFornecedor/SelectFornecedor'
import { useModal } from '../../(contexts)/ModalContext'
import ConfirmationDialog from '@/components/ConfirmationDialog/ConfirmationDialog'
import { useMediaQuery } from '../../(contexts)/MediaQueryContext'
import { useSectionSelect } from '../../(contexts)/SectionSelectContext'
import { usePathname } from 'next/navigation'
import { UseSectionContext } from '@/hooks/useSectionContext'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import Highlight from '@/components/Highlight/Highlight'

export default function TabelaSection() {

    const { context: { context }, cadastrarPedido } = useCalcular()

    const {
        tabelaContext,
        tabelaValid,
        filterContext, 
        resetContext,
        pedidoContext: {pedidoData: {quantidadeProdutos}},
    } = context
    const {searchParam, setSearchParam, searchField, setSearchFieldCapitalized} = filterContext

    const { tabela } = tabelaContext

    const fieldKeys: SearchFieldKeys[] = ['unitario', 'codigo']

    const tabelaFilter = useMemo(() => 
        tabela.filter( item => (item[searchField.toLowerCase() as keyof ProdutoCadastro] as string).includes(searchParam) )
    , [searchParam, tabela, searchField])

    const { setModal, clearModal } = useModal()
    const { section, setSection } = useSectionSelect()
    const { matches: isMobile } = useMediaQuery()

    const handleSaveClick = () => {

        setModal(
            <ConfirmationDialog 
                title='Confirme se deseja salvar o pedido:'
                message='Atenção: O pedido será salvo permanentemente!'
                cancelHandler={clearModal}
                confirmHandler={async () => cadastrarPedido()}
            />
        )

    }

    return (
        // (!isMobile || section === 'Tabela')&&
        <section 
            className={style.tabelaSection} 
            data-active={(section === 'Tabela')}
        > 
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
                <AnimatePresence mode='popLayout'>
                <motion.div 
                    className={style.tabelaBody} 
                    layout 
                    layoutRoot
                >
                {(tabelaFilter.length !== 0)
                ?
                // <LayoutGroup>
                // {
                    tabelaFilter.map((produto) => 
                        <TabelaRow 
                            key={produto.id}
                            produto={produto} 
                        />
                    )   
                // }
                // </LayoutGroup>
                :
                <motion.div 
                    className={style.empty}

                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <span className={style.noMatch}>
                        {svgsUtil.produto}
                        <p>Nenhum <Highlight>produto</Highlight> cadastrado ainda, use as abas para calcular eles.</p>
                    </span>
                </motion.div>
                }
                </motion.div>
                </AnimatePresence>

            </div>

        </div>

        <span className={style.footer}>
            {(!tabelaValid && (tabela.length > 0))&&
            <span className={style.message}>
                <svg width="20" height="20" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M462 433L250.5 67L144.75 250L39 433H462Z" stroke="black" strokeWidth="40" strokeLinejoin="bevel"/>
                    <path d="M250 198V380" stroke="black" strokeWidth="40"/>
                </svg>
                {/* <p>É preciso cadastrar {quantidadeProdutos} itens para cadastrar pedido (faltam {parseInt(quantidadeProdutos) - tabela.length})</p> */}
                <p>{tabela.length} / {quantidadeProdutos} cadastrados</p>
            </span>
            }
            <button 
                className={style.submit}
                disabled={!tabelaValid}
                // onClick={() => cadastrarPedidoDB()}
                onClick={() => handleSaveClick()}
            >{isMobile
                ? 'Cadastrar'
                : 'Cadastrar Pedido'
            }</button>
        </span>

    </section>
        
    )


}