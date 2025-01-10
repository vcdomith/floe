'use client'
import { motion, AnimatePresence, useScroll } from "framer-motion";
import FornecedorTab from "../Tabs/FornecedorTab/FornecedorTab";
import PedidoTab from "../Tabs/PedidoTab/PedidoTab";
import ProdutoTab from "../Tabs/ProdutoTab/ProdutoTab";
import { useCalcular, useManual } from "../context/CalcularContext";

import style from './FatoresSection.module.scss'
import { useNotification } from "../../(contexts)/NotificationContext";
import capitalizeInner from "@/utils/capitalize";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../../(contexts)/MediaQueryContext";
import { useSectionSelect } from "../../(contexts)/SectionSelectContext";
import Link from "next/link";
import { svgsUtil } from "@/components/SvgArray/SvgUtil";
import AvisoFatoresDiferentes from "@/components/AvisoFatoresDiferentes/AvisoFatoresDIferentes";
import MetodoSelect from "../(metodos)/(MetodoSelect)/MetodoSelect";

interface FatoresSectionProps {

    fornecedores: string[] | undefined

}

export default function FatoresSection({ fornecedores }: FatoresSectionProps) {

    const { 
        context: { context } ,
        submitForm
    } = useCalcular()
    const {
        fornecedorContext,
        pedidoContext,  
        produtoValid,  
        tabelaValid,
        tabelaContext: { updateFatoresTabela },
    } = context

    const {fornecedorData, fornecedorDiff, fornecedorControl, rollbackFornecedor, updateFornecedorControl} = fornecedorContext
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
        // (!isMobile || section === 'Fatores')&&
        <section 
            className={style.fatores} 
            data-active={(section === 'Fatores')}
        >

            <MetodoSelect />

            <div className={style.content}>

                <div className={style.title}>
                    {/* <span className={style.header}>
                        <Link href={'/calcular'}>
                            {svgsUtil.back}
                        </Link>
                        <h3>Fornecedor</h3>
                    </span> */}
                    <AnimatePresence initial={false}>
                    {/* {(fornecedorData.nome === '')&&
                    } */}
                    <span className={style.badge}>
                        {svgsUtil.documentManual}
                        <motion.p
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            Selecione um fornecedor para acessar os fatores e configurações para calcular:
                        </motion.p>
                    </span>
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
                {(fornecedorControl && fornecedorControl.nome !== '')
                ?
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, delayChildren: 0.5 }}
                    className={style.fatoresSection}
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