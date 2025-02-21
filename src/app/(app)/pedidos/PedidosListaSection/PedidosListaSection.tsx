'use client'
import { ICadastro } from '@/interfaces/ICadastro'
import style from './PedidosListaSection.module.scss'
import Search from '@/components/Search/Search'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Dispatch, forwardRef, MutableRefObject, SetStateAction, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import capitalizeInner from '@/utils/capitalize'
import { usePathname } from 'next/navigation'
import Highlight from '@/components/Highlight/Highlight'
import LogoSvg from '@/components/SvgArray/LogoSvg'
import Config from '../../configurar/(Config)/Config'
import {Button, CalendarCell, CalendarGrid, DateInput, DateRangePicker, DateRangePickerProps, DateSegment, DateValue, Dialog, FieldError, Group, Heading, Label, Popover, RangeCalendar, Text, ValidationResult} from 'react-aria-components';
import { CalendarDate } from '@internationalized/date'
import { useNotification } from '../../(contexts)/NotificationContext'
import { FocusTrap } from 'focus-trap-react'

interface PedidosListaSectionProps {
    pedidos: ICadastro[]
    pedidosLength: number
}

export default function PedidosListaSection({ pedidos: pedidosInitial, pedidosLength }: PedidosListaSectionProps) {

    const path = usePathname().slice(1,).split('/')[1]

    const [pedidos, setPedidos] = useState(pedidosInitial)
    const [pedidosQuery, setPedidosQuery] = useState<ICadastro[]>([])

    const [modalDisplay, setModalDisplay] = useState(false)

    const [loadingMore, setLoadingMore] = useState(false)
    const [offset, setOffset] = useState(10)

    const [fornecedor, setFornecedor] = useState('')
    const [periodo, setPeriodo] = useState<Periodo | null>(null)
    console.log(periodo);

    const [searchParam, setSearchParam] = useState('')

    const pedidosDisplay = useMemo(() => {

        if (pedidosQuery.length > 0) {
            return pedidosQuery.filter( pedido => pedido.fornecedor?.includes(searchParam.toLowerCase()))
        }

        return pedidos?.filter( pedido => pedido.fornecedor?.includes(searchParam.toLowerCase()))

    }
    , [pedidos, searchParam, pedidosQuery])

    const handleLoadMore = async () => {

        setLoadingMore(true)

        const res = await fetch(`/pedidos/api/loadMore?offset=${offset}`)
        const pedidosExtra = await res.json()
        
        if(pedidosExtra) console.log(pedidosExtra);

        setPedidos( prev => [...prev, ...pedidosExtra] )
        setOffset( prev => prev + 10 )
        setLoadingMore(false)

    }

    return (

        <section className={style.pedidos}>

            <header className={style.header}>

            <div className={style.title}>
                    <h3>Pedidos</h3>
                    <p>
                        Selecione um pedido para conferir seus produtos e fatores:
                    </p>
                </div>

                <span className={style.links}>
                    <Link 
                        className={style.novo}
                        href={'/calcular/chave'}
                        prefetch
                    >
                        {svgsUtil.unitarioNota}
                        Importar
                    </Link>
                    <Link 
                        className={style.novo}
                        href={'/calcular/manual'}
                        prefetch
                    >
                        {svgsUtil.plus}
                        Calcular
                    </Link>
                </span>

                {/* 
                    <input type="text" placeholder='buscar' /> */
                }

                <span className={style.filters}>
                    <Search 
                        className={style.search} 
                        searchParam={searchParam} 
                        setSearchParam={setSearchParam} 
                        placeholder='Buscar lista'
                        textInput
                    />
                    <button 
                        className={style.filter}
                        onClick={() => setModalDisplay( prev => !prev )}
                        data-active={modalDisplay}
                        data-query-active={pedidosQuery.length > 0}
                    >
                        {svgsUtil.import}
                        <p>Filtrar</p>
                        {(pedidosQuery.length > 0)&&
                        <div className={style.active}></div>
                        }
                    </button>
                    {/* <DatePicker 
                        selected={date}
                        onChange={(date) => setDate(date)}
                        calendarClassName='date'
                    /> */}
                    <AnimatePresence>
                    {modalDisplay&&
                    <FiltroModal
                        modalDisplay={modalDisplay}
                        setModalDisplay={setModalDisplay}
                        setPedidosQuery={setPedidosQuery} 
                        fornecedor={fornecedor} 
                        setFornecedor={setFornecedor} 
                        periodo={periodo} 
                        setPeriodo={setPeriodo}
                    />
                    }
                    </AnimatePresence>
                </span>

            </header>

            <div className={style.content}>

                    <motion.div 
                        className={style.pedidosContainer}
                        initial={false}
                        layout
                        layoutRoot
                    >
                    <LayoutGroup>
                    {
                    (pedidosDisplay.length > 0)
                    ?
                    (pedidosDisplay.map( pedido => 
                        <PedidoLink 
                            key={pedido.id.toString()}
                            pedido={pedido}
                            path={path}
                        />
                    ))
                    :
                    <motion.div
                        className={style.noMatch}

                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
            
                        layout='position'
                        layoutScroll
                    >
                        <span className={style.info}>
                            {svgsUtil.unitarioNota}
                            <p>Nenhum <Highlight>pedido</Highlight> corresponde à pesquisa</p>
                        </span>

                    </motion.div>
                    }
                    
                    {
                    (pedidosDisplay.length === pedidos.length)&& 
                    pedidosDisplay.length < pedidosLength&&
                    <button
                        className={style.load}
                        onClick={() => handleLoadMore()}
                        disabled={loadingMore}
                    >{
                    (loadingMore)
                        ?
                            <>
                            <LogoSvg loop/>
                            Carregando...
                            </>
                        : 
                            'Carregar Mais'
                    }</button>
                    }

                    </LayoutGroup>
                    </motion.div>

            </div>

        </section>

    )

}

interface PedidoLinkProps {
    pedido: ICadastro
    path: string
}

const PedidoLink = forwardRef<HTMLDivElement, PedidoLinkProps>(function FornecedorLink({ pedido, path }: PedidoLinkProps, ref) {

    return (
        <motion.div
            ref={ref}

            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}

            layout='position'
            layoutScroll
        >
            <Link 
                className={style.pedido}
                key={pedido.id} 
                href={`/pedidos/${pedido.id}`}
                data-selected={ path === pedido.id.toString() }
            >
                <span className={style.idContainer}>
                    {/* {svgsUtil.unitarioNota} */}
                    {svgsUtil.numero}
                    <p className={style.id}>
                        {/* {fornecedor.id.toString().padStart(4, '0')} */}
                        <span className={style.zero}>{'0'.repeat(4 - (pedido.id.toString().length))}</span>
                        {pedido.id.toString()}
                    </p>
                </span>
                <p className={style.fornecedor}>{pedido.fornecedor&& capitalizeInner(pedido.fornecedor)}</p>
                <span className={style.composto}>
                    <p className={style.data}>
                        {new Date(pedido.created_at).toLocaleString().split(',')[0]}
                    </p>
                    <p className={style.horas}>
                        {`as ${new Date(pedido.created_at).toLocaleString().split(',')[1]}h`}
                    </p>
                </span>
                {/* <p>{`${pedido.produtos.length} produtos`}</p> */}
            </Link>
        </motion.div>
    )

}) 
interface FiltroModalProps {

    modalDisplay: boolean
    setModalDisplay: (open: boolean) => void
    setPedidosQuery: (pedidos: ICadastro[]) => void

    fornecedor: string
    setFornecedor: (fornecedor: string) => void
    periodo: Periodo | null
    setPeriodo: Dispatch<SetStateAction<Periodo | null>>

}



interface Periodo {
    start: CalendarDate
    end: CalendarDate
}

const FiltroModal = ({fornecedor, setFornecedor, periodo, setPeriodo, setModalDisplay, setPedidosQuery} : FiltroModalProps) => {

    const modalRef = useRef<HTMLDivElement>(null)
    const popoverRef = useRef<HTMLSpanElement>(null)

    const [loading, setLoading] = useState(false)
    // const [modalHeight, setModalHeight] = useState(0)
    // const [parentTop, setParentTop] = useState(0)
    const [overflowing, setOverflowing] = useState(false)
    const [overflowAmount, setOverflowAmount] = useState(0)


    const {addNotification} = useNotification()

    const periodoString = useMemo(() => {
        if (periodo === null) return null
        return `${periodo?.start.toString()}T00:00:00,${periodo?.end.toString()}T00:00:00`
    }, [periodo])

    useLayoutEffect(() => {
        const {height} = modalRef.current?.getBoundingClientRect()!;
        const {top} = modalRef.current?.parentElement?.getBoundingClientRect()!;
        // setModalHeight(height)
        // setParentTop(top)
        
        const overflowing = (height + (top + 32)) > (window.innerHeight - 34)
        const overflowAmount = (window.innerHeight - 34) - (height + top)
        setOverflowing(overflowing)
        setOverflowAmount(overflowAmount)

    }, [])

    const limparFiltros = () => {
        setPedidosQuery([])
        setModalDisplay(false)
        setFornecedor('')
        setPeriodo(null)
    }

    const pesquisaDb = async () => {

        if (fornecedor === '') return

        setLoading(true)

        try {
            
            const fetchString = `/pedidos/api/query?fornecedor=${fornecedor}${periodoString? "&periodo="+periodoString : ''}`

            // const res = await fetch(`/pedidos/api/query?fornecedor=${fornecedor}&periodo=${periodoString}`)
            const res = await fetch(fetchString)
            const pedidosPesquisa: ICadastro[] = await res.json()
            
            if (res.status === 500) {
                console.error(pedidosPesquisa)
                return
            }

            console.log(pedidosPesquisa);
            console.log('pequisadbtry');

            if (pedidosPesquisa.length === 0) {
                addNotification({
                    tipo: 'erro',
                    mensagem: 'Nenhum pedido foi encontrado com os parametros passados!'
                })
            } else {

                setPedidosQuery(pedidosPesquisa)
                setModalDisplay(false)

            }


        } catch (error) {
            
            console.error(error)
            // setLoadingQuery(false)

        } finally {

            setLoading(false)

        }

        // setLoadingQuery(false)

    }

    useEffect(() => {

        function handleClickOutside(e: MouseEvent) {
            if( modalRef.current && 
                !modalRef.current?.contains(e.target as Node) &&
                document.contains(e.target as Node) &&
                !popoverRef.current?.contains(e.target as Node)
            ) {
                console.log(popoverRef.current);
                console.log(popoverRef.current?.contains(e.target as Node));
                setModalDisplay(false)
            }
        }

        document.addEventListener('click', handleClickOutside)

        return () => {
            
            document.removeEventListener('click', handleClickOutside)

        }

    }, [])


    return (
        <motion.div 
            className={style.modal}
            ref={modalRef}
            data-overflowing={overflowing}
            style={{
                top: `calc(30px + 1rem - ${overflowing ? (overflowAmount + 32) : 0}px)`
            }}

            initial={{ y: -10, opacity: 0, height: 0 }}
            animate={{ y: 0, opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
        >
            <header className={style.header}>
                <h3>Filtrar</h3>
                <button 
                    onClick={() => setModalDisplay(false)}
                >
                    {svgsUtil.delete}
                </button>
            </header>
            <div className={style.filtros}>
                <Config
                    className={style.filtro}
                    svg={svgsUtil.fornecedor} 
                    title={'Fornecedor'} 
                    description={'Selecione o nome que deseja buscar em cadastros'} 
                    layout
                    input={
                        <input 
                            className={style.fornecedor}
                            type="text" 
                            value={fornecedor}
                            onChange={(e) => setFornecedor(e.target.value)}
                            spellCheck={false}
                            autoFocus
                        />
                    } 
                />
                <Config 
                    className={style.filtro}
                    svg={svgsUtil.data} 
                    title={'Período Cadastro'} 
                    description={'Selecione o período que deseja buscar os cadastros'} 
                    layout
                    input={<DatePickRange 
                        popoverRef={popoverRef}
                        value={periodo}
                        onChange={setPeriodo}
                    />} 
                />
            </div>
            <footer className={style.footer}>
                <button 
                    className={style.clear}
                    onClick={() => limparFiltros()}
                >Limpar</button>
                <button 
                    className={style.confirm} 
                    disabled={loading}
                    onClick={() => pesquisaDb()}>
                        {loading
                            ? <><LogoSvg loop/> Carregando...</>
                            : <>Aplicar</>
                        }
                    </button>
            </footer>
        </motion.div>
    )

}

//https://react-spectrum.adobe.com/react-aria/DatePicker.html

interface DatePickProps<T extends DateValue> extends DateRangePickerProps<T> {
    label?: string;
    description?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
    popoverRef?: MutableRefObject<HTMLSpanElement | null>
}

function DatePickRange<T extends DateValue>(
    {label, description, errorMessage, firstDayOfWeek, popoverRef, ...props }: DatePickProps<T>
) {

    return (
        <DateRangePicker className={style.datePicker} {...props}>
        <Label>{label}</Label>
        <Group className={style.inputWrapper}>
            <DateInput slot="start" className={style.dateInput}>
            {(segment) => <DateSegment segment={segment} className={style.segment} />}
            </DateInput>
            <span aria-hidden="true">→</span>
            <DateInput slot="end" className={style.dateInput}>
            {(segment) => <DateSegment segment={segment} className={style.segment} />}
            </DateInput>
            <Button className={style.expand}>{() => svgsUtil.expand(false)}</Button>
        </Group>
        {description && <Text slot="description">{description}</Text>}
        {/* <FieldError className={style.error}>{errorMessage}</FieldError> */}
        <FieldError className={style.error}>{(values) => 
            <span>{svgsUtil.aviso}{values.defaultChildren}</span>
        }</FieldError>
        <Popover
            className={style.popover}
            ref={popoverRef}
        >
            <Dialog className={style.dialog}>
            <RangeCalendar className={style.calendar} >
                <header className={style.header}>
                <Button slot="previous" className={style.prev}>{svgsUtil.expand(false)}</Button>
                <Heading className={style.month} />
                <Button slot="next" className={style.next}>{svgsUtil.expand(false)}</Button>
                </header>
                <CalendarGrid className={style.grid}>
                {(date) => <CalendarCell date={date} />}
                </CalendarGrid>
            </RangeCalendar>
            </Dialog>
        </Popover>
        </DateRangePicker>
    )

}