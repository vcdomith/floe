'use client'
import { motion, AnimatePresence } from "framer-motion";
import FornecedorTab from "../Tabs/FornecedorTab/FornecedorTab";
import PedidoTab from "../Tabs/PedidoTab/PedidoTab";
import ProdutoTab from "../Tabs/ProdutoTab/ProdutoTab";
import { useCalcular, useManual } from "../context/CalcularContext";

import style from './FatoresSection.module.scss'
import { useNotification } from "../../(contexts)/NotificationContext";
import capitalize from "@/utils/capitalize";
import { useEffect, useState } from "react";
import { useMediaQuery } from "../../(contexts)/MediaQueryContext";
import { useSectionSelect } from "../../(contexts)/SectionSelectContext";
import Link from "next/link";
import { svgsUtil } from "@/components/SvgArray/SvgUtil";

interface FatoresSectionProps {

    fornecedores: string[] | undefined

}

export default function FatoresSection({ fornecedores }: FatoresSectionProps) {

    const { 
        manual: { context, submitForm } 
    } = useManual()
    const {
        fornecedorContext,
        pedidoContext,  
        produtoValid,  
        tabelaValid,
        tabelaContext: { updateFatoresTabela },
    } = context

    const {fornecedorData, fornecedorDiff, rollbackFornecedor, updateFornecedorControl} = fornecedorContext
    const {pedidoData, pedidoDiff, rollbackPedido, updatePedidoControl} = pedidoContext

    const {addNotification} = useNotification()

    const { section, setSection } = useSectionSelect()
    const { matches: isMobile } = useMediaQuery()

    useEffect(() => {

        const handleKeyCombo = (e: KeyboardEvent) => {

            if (e.key === 'Alt') {
                e.preventDefault()
                setSection((prev) => {
                    return (prev === 'Fatores')
                        ? 'Tabela' 
                        : 'Fatores'
                })
            }

        }
        
        window.addEventListener('keydown', handleKeyCombo)
        
        return () => window.removeEventListener('keydown', handleKeyCombo)

    }, [])

    return (
        (!isMobile || section === 'Fatores')&&
        <section 
            className={style.fatores} 
            data-active={(section === 'Fatores')}

            // drag='x'
            // dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            // onDrag={(event, info) => {
            //     if (info.offset.x <= -40) {
            //         setCalcularSection('Tabela')
            //     }
            // }}
        >
            <div className={style.content}>

                <div className={style.title}>
                <span className={style.header}>
                        <Link href={'/calcular'}>
                            {svgsUtil.back}
                        </Link>
                        <h3>Fornecedor</h3>
                    </span>
                    <AnimatePresence initial={false}>
                    {(fornecedorData.nome === '')&&
                    <motion.p
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        Selecione um fornecedor para acessar os fatores e configurações para calcular as tabelas:
                    </motion.p>
                    }
                    </AnimatePresence>
                </div>
                {fornecedores&&
                <div className={style.tabContainer}>
                    <FornecedorTab
                    fornecedorCtx={fornecedorData.nome}
                    fornecedores={fornecedores}
                    />
                    <AnimatePresence initial={false}>
                    {(fornecedorDiff.length > 0)&&
                        <AvisoFatoresDiferentes 
                            tab="fornecedor" 
                            cancelHandler={rollbackFornecedor}
                            confirmHandler={() => {
                                updateFornecedorControl(fornecedorData)
                                updateFatoresTabela()
                                addNotification({
                                    tipo: 'sucesso',
                                    mensagem: 'Fatores atualizados com sucesso!'
                                })
                            }}
                        />
                    }
                    </AnimatePresence>
                </div>
                }

                <AnimatePresence>
                {(fornecedorData.nome !== '')
                ?
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, delayChildren: 0.5 }}
                >
                {(fornecedorDiff.length === 0)&&
                <>
                <div className={style.title}>

                    <h3>Fatores</h3>

                </div>
            
                <div className={style.tabContainer}>
                    <AnimatePresence initial={false}>

                    <PedidoTab />
                    
                    {(pedidoDiff.length > 0)&&
                        <AvisoFatoresDiferentes 
                            tab="pedido" 
                            cancelHandler={rollbackPedido}
                            confirmHandler={() => {
                                updatePedidoControl(pedidoData)
                                updateFatoresTabela()
                                addNotification({
                                    tipo: 'sucesso',
                                    mensagem: 'Fatores atualizados com sucesso!'
                                })
                            }}
                        />
                    }
                    </AnimatePresence>
                    
                </div>
                </>
                }


                {(fornecedorDiff.length === 0 && pedidoDiff.length === 0)&&
                <div className={style.tabContainer}>
                    <ProdutoTab />
                </div>
                }
                </motion.div>
                :
                ''
                }
                </AnimatePresence>

            </div>
            <button 
                className={style.submit} 
                onClick={() => submitForm()} 
                disabled={(fornecedorDiff.length === 0 && pedidoDiff.length === 0) 
                    ? (tabelaValid)|| !produtoValid
                    : true
                }
            >
                {(!tabelaValid)
                ?
                'Adicionar produto'
                :
                'Limite produtos atingido'
                }
            </button>
        </section>
    )

}

interface AvisoFatoresDiferentesProps {
    tab: 'pedido' | 'fornecedor' 
    cancelHandler: () => void
    confirmHandler: () => void
}

const AvisoFatoresDiferentes = ({tab, cancelHandler, confirmHandler}: AvisoFatoresDiferentesProps) => {
    return (
        <motion.span
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            key={tab}
            
            className={style.aviso}
        >
            <span className={style.mensagem}>
                <svg width="20" height="20" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M462 433L250.5 67L144.75 250L39 433H462Z" stroke="black" strokeWidth="40" strokeLinejoin="bevel"/>
                    <path d="M250 198V380" stroke="black" strokeWidth="40"/>
                </svg>
                <p>{`Fatores alterados em '${capitalize(tab)}' não estão afetando os produtos!`}</p> 
            </span>
            <span className={style.buttons}>
                <button 
                    className={style.discard}
                    onClick={() => cancelHandler()}
                >Descartar</button>
                <button 
                    className={style.confirm}
                    onClick={() => confirmHandler()}
                >Atualizar Fatores</button>
            </span>
        </motion.span>
    )
}