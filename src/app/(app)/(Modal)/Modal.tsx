import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "../(contexts)/ModalContext";
import style from './Modal.module.scss'

const BASE_Z_INDEX = 5000

export default function Modal() {

    const { modal, clearModal } = useModal()

    return (
        <AnimatePresence>
        {modal.map( (modal, index) => 
            <motion.div 
            key={index}
            className={style.wrapper}
            style={{ zIndex: BASE_Z_INDEX + index }}

            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(2px)'  }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.4 }}
        >

            <motion.section 
                className={style.backdrop}
                onClick={clearModal}
            />

            <div className={style.modal}>
                {modal}
            </div>

        </motion.div>
        )}
        </AnimatePresence>
    )

}