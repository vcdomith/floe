import { INotification } from "@/interfaces/INotification"
import { useNotification } from "../(contexts)/NotificationContext"
import { motion, AnimatePresence } from "framer-motion"

import style from './Notifications.module.scss'
import { forwardRef } from "react"

export default function Notifications() {

    const { notifications, addNotification, removeNotification } = useNotification()

    return (
        <motion.div
            className={style.notifications}
            // style={{ height: `${notifications.length*(98+16)}px` }}
            // style={{
            //     flex: 1,
            //     width: '100%'
            // }}
        >
        <AnimatePresence mode="popLayout">
        {Object.entries(notifications).map(([_, notification]) => 
            <Notification
                key={notification.id}
                notification={notification}
            />
        )}
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
            <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M462 433L250.5 67L144.75 250L39 433H462Z" stroke="black" strokeWidth="40" strokeLinejoin="bevel"/>
                <path d="M250 198V380" stroke="black" strokeWidth="40"/>
            </svg>
            <p>{mensagem}</p>
            <button 
                onClick={() => removeNotification(id)}
            >x</button>
        </motion.span>

    )

}
)