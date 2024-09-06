import { CalcularProvider } from "../calcular/context/CalcularContext";
import { MediaQueryProvider } from "./MediaQueryContext";
import { ModalProvider } from "./ModalContext";
import { NotificationProvider } from "./NotificationContext";
import { SectionSelectProvider } from "./SectionSelectContext";

export default function GlobalProvider({children}: {children: React.ReactNode}) {
    return (
        <MediaQueryProvider>
            <NotificationProvider>
                <CalcularProvider>
                    <ModalProvider>
                        <SectionSelectProvider>
                        {children}
                        </SectionSelectProvider>
                    </ModalProvider>
                </CalcularProvider>
            </NotificationProvider>
        </MediaQueryProvider>
    )
}