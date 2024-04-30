import { INotification } from "@/interfaces/INotification"
import { useNotification } from "../(contexts)/NotificationContext"
import { motion, AnimatePresence } from "framer-motion"

export default function Notifications() {

    const { notifications, addNotification, removeNotification } = useNotification()

    return (
        <span
            style={{
                flex: 1,
                width: '100%'
            }}
        >
        <AnimatePresence>
        {Object.entries(notifications).map(([_, notification]) => 
            <Notification
                key={notification.id}
                notification={notification}
            />
        )}
        </AnimatePresence>
        </span>
    )

}

interface NotificationProps {

    notification: INotification

}

function Notification({notification}: NotificationProps) {

    const { id, tipo, mensagem } = notification
    const { removeNotification } = useNotification()

    return (

        <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            <p>{mensagem}</p>
            <button 
                onClick={() => removeNotification(id)}
            >x</button>
        </motion.span>

    )

}