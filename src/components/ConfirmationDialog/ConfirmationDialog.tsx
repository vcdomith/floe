import { useModal } from '@/app/(app)/(contexts)/ModalContext'
import style from './ConfirmationDialog.module.scss'
import { useRef } from 'react'

interface ConfirmationDialogProps {
    title: string
    message?: string
    cancelHandler: () => void,
    confirmHandler: () => void,
}

export default function ConfirmationDialog (
    { title, message, cancelHandler, confirmHandler }: ConfirmationDialogProps
) {

    const confirmRef = useRef<HTMLButtonElement | null>(null)

    const { clearModal } = useModal()

    const handleConfirm = () => {
        confirmHandler()
        confirmRef.current!.disabled = true
        clearModal()
    }

    return (
        <div className={style.dialog}>
            <span className={style.badge}>
                <SvgAviso />
                <h3>Aviso</h3>
            </span>
            <div className={style.content}>
                <div className={style.texts}>
                <h3 className={style.title}>{title}</h3>
                <p className={style.message}>{message}</p>
                </div>
                <span className={style.buttons}>
                    <button className={style.cancel} onClick={() => cancelHandler()}>Cancelar</button>
                    <button 
                        className={style.confirm} 
                        ref={confirmRef}
                        onClick={() => handleConfirm()}>
                            Confirmar
                    </button>
                </span>
            </div>
        </div>
    )

}
const SvgAviso = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M462 433L250.5 67L144.75 250L39 433H462Z" stroke="black" strokeWidth="40" strokeLinejoin="bevel"/>
            <path d="M250 198V380" stroke="black" strokeWidth="40"/>
        </svg>
    )
}