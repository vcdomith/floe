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

    const {fornecedorContext, produtoCadastro, valid, submitForm} = useCalcular()
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
                    <p>Selecione o fornecedor para acessar os fatores e configurações para calcular as tabelas:</p>
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
                    <p>Selecione o fornecedor para acessar os fatores e configurações para calcular as tabelas:</p>
                </div>
            
                <div className={style.tabContainer}>
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
                disabled={!valid}
            >Adicionar produto</button>
        </section>
    )

}

const SvgProduto = () => {
    return(
        <svg width="30" height="30" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M29.7784 404.32C38.2784 410.82 153.778 495.32 198.278 459.32C242.778 423.32 5.27837 290.82 29.7784 204.32C49.3784 135.12 150.278 180.487 198.278 211.82" stroke="#591C4A" strokeWidth="40"/>
        <path d="M474.07 98.893C465.57 92.393 350.07 7.89299 305.57 43.893C261.07 79.893 498.57 212.393 474.07 298.893C454.47 368.093 353.57 322.726 305.57 291.393" stroke="#591C4A" strokeWidth="40"/>
        <circle cx="250" cy="250" r="69" stroke="#591C4A" strokeWidth="40"/>
        </svg>
    )
}