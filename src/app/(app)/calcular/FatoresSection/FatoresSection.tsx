'use client'
import { motion, AnimatePresence } from "framer-motion";
import FornecedorTab from "../Tabs/FornecedorTab/FornecedorTab";
import PedidoTab from "../Tabs/PedidoTab/PedidoTab";
import ProdutoTab from "../Tabs/ProdutoTab/ProdutoTab";
import { useCalcular } from "../context/CalcularContext";

import style from './FatoresSection.module.scss'
import { useNotification } from "../../(contexts)/NotificationContext";
import capitalize from "@/utils/capitalize";
import { useEffect, useState } from "react";
import { useMediaQuery } from "../../(contexts)/MediaQueryContext";
import { useSectionSelect } from "../../(contexts)/SectionSelectContext";

interface NfeData {

    fornecedor: string
    cnpj: string
    valorSt: string
    valorTotalProdutos: string

}

interface NfeProduto {

    codigo: string
    ean: string
    descricao: string
    ncm: string
    cst: string
    unitario: string
    ipi: string

}

interface FatoresSectionProps {

    fornecedores: string[] | undefined

}

export default function FatoresSection({ fornecedores }: FatoresSectionProps) {

    const {
        fornecedorContext,
        pedidoContext,  
        produtoIsValid, 
        submitForm, 
        tabelaValid,
        setTabela,
        updateFatoresTabela,
        // calcularSection: section,
        setCalcularSection
    } = useCalcular()
    const {fornecedorData, fornecedorDiff, rollbackFornecedor, updateFornecedorControl} = fornecedorContext
    const {pedidoData, pedidoDiff, rollbackPedido, updatePedidoControl} = pedidoContext

    const {addNotification} = useNotification()

    const { section, setSection } = useSectionSelect()
    const {matches: isMobile} = useMediaQuery()

    const parseXml = (res: string): {fornecedor: NfeData, produtos: NfeProduto[]} => {
   
        const parser = new DOMParser()
        const xml = parser.parseFromString(res, 'application/xml')

        const fornecedor = xml.querySelector('emit > xNome')?.textContent
        const cnpj = xml.querySelector('emit > CNPJ')?.textContent
        const itens = xml.querySelectorAll('infNFe > det')
        const valorSt = xml.querySelector('vST')?.textContent
        const valorTotalProdutos = xml.querySelector('ICMSTot > vProd')?.textContent

        const fornecedorDataExtraido: NfeData = {
            fornecedor: fornecedor || '',
            cnpj: cnpj || "",
            valorSt: valorSt || "",
            valorTotalProdutos: valorTotalProdutos || ""
        }

        const produtosExtraidos: NfeProduto[] = []
        itens.forEach( item => {

            const codigo = item.querySelector('cProd')?.textContent || ''
            const ean = item.querySelector('cEAN')?.textContent || ''
            const descricao = item.querySelector('xProd')?.textContent || ''
            const ncm = item.querySelector('NCM')?.textContent || ''
            const cst = item.querySelector('CST')?.textContent || ''
            const unitario = item.querySelector('vUnCom')?.textContent || ''
            const ipi = item.querySelector('pIPI')?.textContent || ''

            const produto = {
                codigo: codigo,
                ean: ean,
                descricao: descricao,
                ncm: ncm,
                cst: cst,
                unitario: unitario,
                ipi: ipi,
            }

            produtosExtraidos.push(produto)

        })

        return {
            fornecedor: fornecedorDataExtraido,
            produtos: produtosExtraidos
        }

    }

    const [chave, setChave] = useState('')

    const handleImportNFe = async (chave: string) => {

        if (chave.length < 44) {
            console.log('Chave nfe tem 44 digitos');
            return
        }

        const res = await fetch(`/xml/api/getNFe?chave=${chave}`)
        const cert = await res.json()

        const extractData = parseXml(cert)
        console.log(extractData);

    }

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
    
                {/* Seção teste importar dados nfe */}
                {/* <div className={style.title}>
                    <h3>Importar Nfe</h3>
                    <p>Forneça a chave de acesso da Nfe com 44 dígitos para importar os valores da n:</p>
                    <input type="text" minLength={44} maxLength={44} onChange={(e) => setChave(e.target.value)}/>
                    <button onClick={() => handleImportNFe(chave)}>Get cert</button>
                </div> */}

                <div className={style.title}>
                    <h3>Fornecedor</h3>
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
                    ? (tabelaValid)|| !produtoIsValid
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