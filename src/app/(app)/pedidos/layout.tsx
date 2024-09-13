import { dbConnect } from '@/utils/db/supabase';
import style from './pedidos.module.scss';
import PedidosListaSection from './PedidosListaSection/PedidosListaSection';
import TabelaSection from '../calcular/TabelaSection/TabelaSection';
import PedidoDetalheSection from './PedidoDetalheSection/PedidoDetalheSection';

export default async function PedidosLayout({ children }: { children: React.ReactNode }) {

    const supabase = dbConnect()
    const { data: pedidos, error } = await supabase
        .from('cadastros')
        .select('*')
        .order('id', { ascending: false })

    return (
        <main className={style.main}>
            <PedidosListaSection pedidos={(pedidos !== null) ? pedidos : []}/>
            <PedidoDetalheSection>
                {children}
            </PedidoDetalheSection>
        </main>
    )


}