'use client'
import Link from 'next/link'
import style from './ImportarChaveSection.module.scss'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import ImportCard, { Xml } from './ImportCard/ImportCard'
import { useChave } from '../../../context/CalcularContext'
import { UIEvent, useMemo, useState } from 'react'
import LogoSvg from '@/components/SvgArray/LogoSvg'
import FornecedorTab from '../../../Tabs/FornecedorTab/FornecedorTab'
import PedidoTab from '../../../Tabs/PedidoTab/PedidoTab'
import { AnimatePresence, motion } from 'framer-motion'
import capitalize from '@/utils/capitalize'
import { useNotification } from '@/app/(app)/(contexts)/NotificationContext'
import AvisoFatoresDiferentes from '@/components/AvisoFatoresDiferentes/AvisoFatoresDIferentes'
import Tab from '@/components/Tab/Tab'
import { Chave } from './ImportCard/ImportCard'

export default function ImportarChaveSection({ tipo = 'chave'} : { tipo: 'chave' | 'xml'}) {

    const { chave: { 
        context: { 
            fornecedorContext: { fornecedorData, fornecedorDiff, rollbackFornecedor, updateFornecedorControl },
            pedidoContext: { pedidoData, pedidoDiff, rollbackPedido, updatePedidoControl },
            tabelaContext: { updateFatoresTabela }
        },
        documentos, 
        loading, 
        submitForm 
    }} = useChave()

    const { addNotification } = useNotification()

    const {
        nfe: { importado: nfeImportado }, 
        cte: { importado: cteImportado },
    } = documentos

    const valid = useMemo(() => {
        return (nfeImportado !== undefined && cteImportado !== undefined)
    }, [nfeImportado, cteImportado])

    return (

        <section className={style.chaveSection}>
            
            <div className={style.title}>

                <span className={style.header}>
                    <Link href={'/calcular'} prefetch>
                        {svgsUtil.back}
                    </Link>
                    <h3>Importar NFe e CTe - {tipo}</h3>
                </span>

                {/* <p>Forneça a chave de acesso da Nfe com 44 dígitos para importar os valores da nota:</p> */}

            </div>

            <div 
                className={style.content}
            >    

                <Tab 
                    svg={svgsUtil.chave} 
                    section={'Importar'} 
                    // initialDisplay
                >
                    <p>Forneça a chave de acesso da Nfe com 44 dígitos para importar os valores da nota:</p>
                    
                    <Xml documento={documentos.cte} />
                    {/* <Chave documento={documentos.cte}/> */}
                    
                    <button
                        className={style.submit} 
                        onClick={() => submitForm()}
                        disabled={(!valid || loading)}
                    >
                        {(loading)
                            ? <><LogoSvg loop />  Importando...</>
                            : 'Gerar Tabela'
                        }
                    </button>

                    {/* <ImportCard 
                        tipo={tipo} 
                        documento={documentos.cte}     
                    />
                    
                    <ImportCard
                        tipo={tipo} 
                        documento={documentos.nfe}
                    /> */}
                </Tab>

                <Tab 
                    svg={svgsUtil.unitarioNota} 
                    section={'Fatores'}
                >

                    <FornecedorTab 
                        disabled
                        fornecedorCtx={fornecedorData.nome} 
                        fornecedores={[]} 
                    />
                    <AnimatePresence>
                    {(fornecedorDiff.length > 0) &&
                    <AvisoFatoresDiferentes 
                        tab={'fornecedor'} 
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

                    <PedidoTab />
                    <AnimatePresence>
                    {(pedidoDiff.length > 0) &&
                    <AvisoFatoresDiferentes 
                        tab={'pedido'} 
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
                </Tab>

            </div>

            <button
                className={style.submit} 
                onClick={() => submitForm()}
                disabled={(!valid || loading)}
            >
                {(loading)
                    ? <><LogoSvg loop />  Importando...</>
                    : 'Gerar Tabela'
                }
            </button>

        </section>

    )

}