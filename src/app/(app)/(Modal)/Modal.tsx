import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "../(contexts)/ModalContext";
import style from './Modal.module.scss'

export default function Modal() {

    const { modal, setModal } = useModal()

    return (
        <AnimatePresence>
        {modal&&
            <motion.div 
                className={style.wrapper}

                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                animate={{ opacity: 1, backdropFilter: 'blur(2px)'  }}
                exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            >

                <motion.section 
                    className={style.backdrop}
                    onClick={() => setModal(null)}
                />

                <div className={style.modal}>
                    {modal}
                </div>

            </motion.div>
        }
        </AnimatePresence>
    )

}