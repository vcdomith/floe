import { motion, AnimatePresence } from "framer-motion";
import { ModalNode, useModal } from "../(contexts)/ModalContext";
import style from './Modal.module.scss'
import { FocusTrap } from "focus-trap-react";
import { forwardRef, ReactNode } from "react";

const BASE_Z_INDEX = 5000

export default function Modal() {

    const { modal: modalArray, clearModal } = useModal()

    console.log(modalArray.length);

    return (
        <AnimatePresence>
        {modalArray.map( (modal, index) => 
            <motion.div 
            key={index}
            className={style.wrapper}
            style={{ zIndex: BASE_Z_INDEX + index }}

            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(2px)'  }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.4 }}
        >

            <FocusTrap active>
                <ModalContent 
                    modal={modal} 
                    style={style} 
                    clearModal={clearModal}                
                />
            </FocusTrap>

        </motion.div>
        )}
        </AnimatePresence>
    )

}

interface ModalContentProps {
    modal: ModalNode
    style: {
        readonly [key: string]: string
    }
    clearModal: () => void
}

const ModalContent = forwardRef<HTMLElement, ModalContentProps>( function ModalContent({modal, style, clearModal}, ref) {
    return (
        <section ref={ref}>
            <motion.section 
                className={style.backdrop}
                onClick={(!modal.disableOutsideClick)
                        ? clearModal
                        : ()=>{}
                }
                />

            <div className={style.modal}>
                    {modal.modal}
            </div>
            
        </section>
    )
})