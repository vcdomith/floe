import { INotification, newNotification } from "@/interfaces/INotification";
import { useContext, useState } from "react";
import { createContext } from "react";

interface NotificationContextProps {

    notifications: INotification[]
    addNotification: ({ tipo, mensagem }: newNotification) => void
    removeNotification: (notificationToRemoveId: number) => void

}

export const NotificationContext = createContext<NotificationContextProps | undefined>(undefined)
NotificationContext.displayName = 'Notifications'

export const useNotification = () => {
    const context = useContext(NotificationContext)
    if (!context) throw new Error('useNotification must be used within a NotificationProvider')
    return context
}

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {

    const [notifications, setNotifications] = useState<INotification[]>([]);

    const addNotification = ({ tipo, mensagem }: newNotification ) => {
        const newNotification: INotification= { 
            id: new Date().getTime(),
            tipo: tipo,  
            mensagem: mensagem,
            timer: setTimeout(() => removeNotification(newNotification.id), 10000) // Remove after 10 seconds
        }
        if(notifications.some( notification => notification.mensagem === newNotification.mensagem )) {
            console.log(`Notification with %c"${newNotification.mensagem}"%c already deployed`, 'color: #ffa600', 'color: initial');
            return
        }
        setNotifications(prevNotifications => [...prevNotifications, newNotification]);
    };

    const removeNotification = (notificationToRemoveId: number) => {
        setNotifications(prevNotifications =>
            prevNotifications.filter(notification => notification.id !== notificationToRemoveId)
        )   
    };

    return <NotificationContext.Provider 
        value={{
            notifications, 
            addNotification,
            removeNotification
        }}
    >
        {children}
    </NotificationContext.Provider>

}