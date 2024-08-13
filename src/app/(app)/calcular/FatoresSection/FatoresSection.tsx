'use client'
import { motion, AnimatePresence } from "framer-motion";
import FornecedorTab from "../Tabs/FornecedorTab/FornecedorTab";
import PedidoTab from "../Tabs/PedidoTab/PedidoTab";
import ProdutoTab from "../Tabs/ProdutoTab/ProdutoTab";
import { useCalcular } from "../context/CalcularContext";

import style from './FatoresSection.module.scss'

interface FatoresSectionProps {

    fornecedores: string[] | undefined

}

export default function FatoresSection({ fornecedores }: FatoresSectionProps) {

    const {
        fornecedorContext, 
        fatoresControl: {
            fornecedorControl,
            updateFornecedorControl
        },
        produtoIsValid, 
        submitForm, 
        tabelaValid
    } = useCalcular()
    const {fornecedorData: {nome}} = fornecedorContext

    // const formIsValid: boolean = produtoCadastros
    // ? Object.values(produtoCadastros!).some( (element) => element === '' )
    // : false
    // console.log(formIsValid);
    // produtoCadastros&& console.log( Object.values(produtoCadastros) );

    return (
        <section className={style.fatores}>
            <div className={style.content}>
    
                <div className={style.title}>
                    <h3>Fornecedor</h3>
                    <AnimatePresence initial={false}>
                    {(nome === '')&&
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
                    fornecedores={fornecedores}
                    />
                </div>
                }

                <AnimatePresence>
                {(nome !== '')
                ?
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, delayChildren: 0.5 }}
                >
                <div className={style.title}>
                    <h3>Fatores</h3>
                    {/* <p>Selecione o fornecedor para acessar os fatores e configurações para calcular as tabelas:</p> */}
                </div>
            
                <div className={style.tabContainer}>
                    {/* {(displayControl.transporte || displayControl.st)&& <PedidoTab />} */}
                    <PedidoTab />
                    <ProdutoTab />
                </div>
                </motion.div>
                :
                ''
                }
                </AnimatePresence>

            </div>
            <button 
                className={style.submit} 
                onClick={() => submitForm()} 
                disabled={(tabelaValid)|| !produtoIsValid}
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