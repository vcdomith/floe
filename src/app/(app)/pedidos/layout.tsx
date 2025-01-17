import { dbConnect } from '@/utils/db/supabase';
import style from './pedidos.module.scss';
import PedidosContextWrapper from './PedidosContextWrapper/PedidosContextWrapper';

export default async function PedidosLayout({ children }: { children: React.ReactNode }) {

    const supabase = dbConnect()
    const { data: pedidos, count: pedidosLength, error } = await supabase
        .from('cadastros')
        .select('*', { count: 'estimated' })
        .order('created_at', { ascending: false })
        .range(0, 9)

    return (
        <main className={style.main}>

            <PedidosContextWrapper 
                pedidos={pedidos} 
                pedidosLength={pedidosLength?? 0}
            >
                {children}
            </PedidosContextWrapper>
            {/* <PedidosListaSection pedidos={(pedidos !== null) ? pedidos : []}/>
           
            <PedidoDetalheSection>
                {children}
            </PedidoDetalheSection> */}
            
        </main>
    )

}

