import Container from "@/components/Container/Container";

export default function AppLayout({ children }: { children: React.ReactNode}) {

    return (
        <Container>
            {children}
        </Container>
    )

}