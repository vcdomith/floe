import { INotification } from "@/interfaces/INotification"
import { useNotification } from "../(contexts)/NotificationContext"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"

import style from './Notifications.module.scss'
import { forwardRef } from "react"

export default function Notifications() {

    const { notifications, addNotification, removeNotification } = useNotification()

    return (
        <motion.div
            className={style.notifications}
            // layout layoutRoot
            // style={{ height: `${notifications.length*(98+16)}px` }}
            // style={{
            //     flex: 1,
            //     width: '100%'
            // }}
        >
        <AnimatePresence mode="popLayout">
        <LayoutGroup>
        {Object.entries(notifications).map(([_, notification]) => 
            <Notification
                key={notification.id}
                notification={notification}
            />
        )}
        </LayoutGroup>
        </AnimatePresence>
        </motion.div>
    )

}

interface NotificationProps {

    notification: INotification

}
const Notification = forwardRef<HTMLSpanElement, NotificationProps>(
function Notification({notification}: NotificationProps, ref) {

    const { id, tipo, mensagem } = notification
    const { removeNotification } = useNotification()

    type TiposNotification = typeof tipo
    const icons: Record<TiposNotification, React.ReactNode> = {
        sucesso: <SvgSucesso />,
        erro: <SvgErro />,
        aviso: <SvgAviso />,
    }

    return (

        <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            ref={ref}
            layout

            className={`${style.notification} ${style[tipo]}`}
        >
            {/* <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M462 433L250.5 67L144.75 250L39 433H462Z" stroke="black" strokeWidth="40" strokeLinejoin="bevel"/>
                <path d="M250 198V380" stroke="black" strokeWidth="40"/>
            </svg> */}
            {icons[tipo]}
            <p>{mensagem}</p>
            <button
                className={style.dismiss} 
                onClick={() => removeNotification(id)}
            ><SvgExcluir /></button>
        </motion.span>

    )

}
)

const SvgExcluir = () => {
    return(
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M156 345L346 155" stroke="black" strokeWidth="40"/>
            <path d="M155 155L345 345" stroke="black" strokeWidth="40"/>
        </svg>
    )
}

const SvgSucesso = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M149 219.875L240.063 310.938L348 203" stroke="black" strokeWidth="40"/>
            <circle cx="250.5" cy="249.5" r="184.5" stroke="black" strokeWidth="40"/>
        </svg>
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

const SvgErro = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M146 148L351 353" stroke="black" strokeWidth="40"/>
            <path d="M351 148L146 353" stroke="black" strokeWidth="40"/>
            <rect x="66" y="65" width="369" height="369" rx="49" stroke="black" strokeWidth="40"/>
        </svg>
    )
}