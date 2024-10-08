import {motion} from 'framer-motion'

import style from './AvisoFatoresDiferentes.module.scss'
import capitalize from '@/utils/capitalize'

export interface AvisoFatoresDiferentesProps {
    tab: 'pedido' | 'fornecedor' 
    cancelHandler: () => void
    confirmHandler: () => void
}

export default function AvisoFatoresDiferentes({tab, cancelHandler, confirmHandler}: AvisoFatoresDiferentesProps){
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