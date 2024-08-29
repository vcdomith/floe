import { CalcularProvider } from "../calcular/context/CalcularContext";
import { MediaQueryProvider } from "./MediaQueryContext";
import { ModalProvider } from "./ModalContext";
import { NotificationProvider } from "./NotificationContext";

export default function GlobalProvider({children}: {children: React.ReactNode}) {
    return (
        <MediaQueryProvider>
            <NotificationProvider>
                <CalcularProvider>
                    <ModalProvider>
                        {children}
                    </ModalProvider>
                </CalcularProvider>
            </NotificationProvider>
        </MediaQueryProvider>
    )
}