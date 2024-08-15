'use client'
import { motion, AnimatePresence } from "framer-motion";
import FornecedorTab from "../Tabs/FornecedorTab/FornecedorTab";
import PedidoTab from "../Tabs/PedidoTab/PedidoTab";
import ProdutoTab from "../Tabs/ProdutoTab/ProdutoTab";
import { useCalcular } from "../context/CalcularContext";

import style from './FatoresSection.module.scss'
import { useNotification } from "../../(contexts)/NotificationContext";

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
        updateFatoresTabela
    } = useCalcular()
    const {fornecedorData, fornecedorDiff, rollbackFornecedor, updateFornecedorControl} = fornecedorContext
    const {pedidoData, pedidoDiff, rollbackPedido, updatePedidoControl} = pedidoContext

    const {addNotification} = useNotification()

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
                <p>{`Fatores alterados em ${tab} não estão afetando os produtos!`}</p> 
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