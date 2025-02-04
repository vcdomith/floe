import { useModal } from '@/app/(app)/(contexts)/ModalContext'
import style from './ConfirmationDialog.module.scss'
import { useEffect, useRef, useState } from 'react'
import LogoSvg from '../SvgArray/LogoSvg'
import { UseSectionContext } from '@/hooks/useSectionContext'
import { svgsUtil } from '../SvgArray/SvgUtil'

interface ConfirmationDialogProps {
    title: React.ReactNode
    message?: React.ReactNode
    cancelHandler: () => void,
    confirmHandler: (() => void) | (() => Promise<void>),
}

export default function ConfirmationDialog (
    { title, message, cancelHandler, confirmHandler }: ConfirmationDialogProps
) {

    const confirmRef = useRef<HTMLButtonElement | null>(null)
    const cancelRef = useRef<HTMLButtonElement | null>(null)
    const [loading, setLoading] = useState(false)

    const { clearModal } = useModal()

    // console.log(confirmHandler.constructor.name, confirmHandler.constructor.name === 'AsyncFunction');

    const handleConfirm = async () => {

        try {
            
            setLoading(true)
            confirmRef.current!.disabled = true
            await confirmHandler() 

        } catch (error) {
            
            setLoading(false)
            console.error(error)

        }

        setLoading(false)
        clearModal()
        // confirmRef.current!.disabled = true
    }

    useEffect(() => {

        const handleEscapeCancel = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Escape') {
                clearModal()
                return
            }
            // if (e.key === 'Enter') {
            //     confirmHandler()
            // }
            if (e.key === 'ArrowRight') {
                confirmRef.current?.focus()
            }
            if (e.key === 'ArrowLeft') {
                cancelRef.current?.focus()
            }
        }

        window.addEventListener('keydown', handleEscapeCancel)

        return () => {
            window.removeEventListener('keydown', handleEscapeCancel)
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={style.dialog}>
            <span className={style.badge}>
                <SvgAviso />
                <h3>Aviso</h3>
                <button onClick={() => clearModal()}>{svgsUtil.delete}</button>
            </span>
            <div className={style.content}>
                <div className={style.texts}>
                <h3 className={style.title}>{title}</h3>
                <p className={style.message}>{message}</p>
                </div>
                <span className={style.buttons}>
                    <button 
                        className={style.cancel} 
                        onClick={() => cancelHandler()}
                        ref={cancelRef}
                    >Cancelar</button>
                    <button 
                        className={style.confirm} 
                        autoFocus
                        ref={el => {
                            if(el) {
                                confirmRef.current = el
                                el.focus()
                            }
                        }}
                        disabled={loading}
                        data-loading={loading}
                        onClick={() => handleConfirm()}>
                            {loading
                            ?
                            <>
                            <LogoSvg loop/>
                            <p>Cadastrando...</p>
                            </>
                            :
                            'Confirmar'
                            }
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