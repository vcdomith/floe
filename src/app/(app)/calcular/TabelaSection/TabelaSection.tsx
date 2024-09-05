'use client'
import { getTabelas, getTabelasObject } from '@/utils/calculoTabelas'
import { ProdutoCadastro, useCalcular } from '../context/CalcularContext'
import TableHeader from './TabelaHeader/TabelaHeader'
import TabelaRow from './TabelaRow/TabelaRow'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import Search from '@/components/Search/Search'
import { useEffect, useMemo } from 'react'
import { SearchFieldKeys } from '@/hooks/useFilter'

import style from './TabelaSection.module.scss'
import SelectFornecedor from '@/components/SelectFornecedor/SelectFornecedor'
import { useModal } from '../../(contexts)/ModalContext'
import ConfirmationDialog from '@/components/ConfirmationDialog/ConfirmationDialog'
import { useMediaQuery } from '../../(contexts)/MediaQueryContext'
import { useSectionSelect } from '../../(contexts)/SectionSelectContext'

export default function TabelaSection() {

    const {
        tabela, 
        setTabela, 
        tabelaValid,
        cadastrarPedidoDB, 
        filterContext, 
        resetContext,
        pedidoContext: {pedidoData: {quantidadeProdutos}},
        // calcularSection,
        setCalcularSection
    } = useCalcular()
    const {searchParam, setSearchParam, searchField, setSearchFieldCapitalized} = filterContext

    const fieldKeys: SearchFieldKeys[] = ['unitario', 'codigo']

    const tabelaFilter = useMemo(() => 
        tabela.filter( item => (item[searchField.toLowerCase() as keyof ProdutoCadastro] as string).includes(searchParam) )
    , [searchParam, tabela, searchField])

    const { setModal, clearModal } = useModal()
    const { section } = useSectionSelect()
    const { matches: isMobile } = useMediaQuery()

    const handleSaveClick = () => {

        setModal(
            <ConfirmationDialog 
                title='Confirme se deseja salvar o pedido:'
                message='Atenção: O pedido será salvo permanentemente!'
                cancelHandler={clearModal}
                confirmHandler={() => {
                    cadastrarPedidoDB()
                    resetContext()
                }}
            />
        )

    }

    return (
        (!isMobile || section === 'Tabela')&&
        <section 
            className={style.tabelaSection} 
            data-active={(section === 'Tabela')}

            // drag='x'
            // dragConstraints={{ left: 0, right: 0 }}
            // onDrag={(event, info) => {
            //     if (info.offset.x >= 40) {
            //         setCalcularSection('Fatores')
            //     }
            // }}
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
                        <TabelaRow produto={produto} setTabela={setTabela} key={produto.id} />
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
                    <p>Nenhum produto cadastrado ainda, use as abas para calcular eles.</p>
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
                <p>É preciso cadastrar {quantidadeProdutos} itens para cadastrar pedido (faltam {parseInt(quantidadeProdutos) - tabela.length})</p>
            </span>
            }
            <button 
                className={style.submit}
                disabled={!tabelaValid}
                // onClick={() => cadastrarPedidoDB()}
                onClick={() => handleSaveClick()}
            >Cadastrar Pedido</button>
        </span>

    </section>
        
    )


}