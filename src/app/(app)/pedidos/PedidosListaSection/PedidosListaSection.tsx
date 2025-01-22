'use client'
import { ICadastro } from '@/interfaces/ICadastro'
import style from './PedidosListaSection.module.scss'
import Search from '@/components/Search/Search'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { forwardRef, MutableRefObject, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import capitalizeInner from '@/utils/capitalize'
import { usePathname } from 'next/navigation'
import { useBackgroundSync } from '../../(contexts)/BackgroundSyncContext'
import Highlight from '@/components/Highlight/Highlight'
import LogoSvg from '@/components/SvgArray/LogoSvg'
import { debounce } from 'lodash'
import { FocusTrap } from 'focus-trap-react'
import Config from '../../configurar/(Config)/Config'
import {Button, Calendar, CalendarCell, CalendarGrid, DateInput, DatePicker, DatePickerProps, DateRangePicker, DateRangePickerProps, DateSegment, DateValue, Dialog, FieldError, Group, Heading, Label, Popover, PopoverProps, RangeCalendar, Text, ValidationResult} from 'react-aria-components';

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
    const [loadingQuery, setLoadingQuery] = useState(false)
    const [offset, setOffset] = useState(10)

    const [searchParam, setSearchParam] = useState('')

    const pedidosDisplay = useMemo(() => {

        if (pedidosQuery.length > 0) return pedidosQuery

        return pedidos?.filter( pedido => pedido.fornecedor?.includes(searchParam.toLowerCase()))

    }
    , [pedidos, searchParam, pedidosQuery])

    console.log(modalDisplay);

    // const handleSearch = useCallback(
    //     debounce((searchParam: string) => {
    //         setSearchParam(searchParam)
    //     }, 300),
    //     [setSearchParam]
    // )

    const handleSearch = (searchParam: string) => {

        setSearchParam(searchParam)
        setPedidosQuery([])

        // console.log(
        //     pedidos?.filter( pedido => pedido.fornecedor?.includes(searchParam.toLowerCase())).length === 0
        // );
        // if (pedidos?.filter( pedido => pedido.fornecedor?.includes(searchParam.toLowerCase())).length === 0) {

        //     console.log('inner');
        //     debouncedQuery(searchParam)

        // }

    }

    const pesquisaDb = async (fornecedor: string) => {

        if (fornecedor === '') return

        setLoadingQuery(true)

        try {
            
            const res = await fetch(`/pedidos/api/query?fornecedor=${fornecedor}`)
            const pedidosPesquisa: ICadastro[] = await res.json()
            
            if (res.status === 500) {
                console.error('Error')
                return
            }

            console.log(pedidosPesquisa);
            console.log('pequisadbtry');

            setPedidosQuery(pedidosPesquisa)


        } catch (error) {
            
            console.error(error)
            // setLoadingQuery(false)

        } finally {

            setLoadingQuery(false)

        }

        // setLoadingQuery(false)

    }

    const debouncedQuery = useCallback(
        debounce((fornecedor: string) => {
            pesquisaDb(fornecedor)
        }, 1000),
        [pesquisaDb]
    )

    const handleLoadMore = async () => {

        setLoadingMore(true)

        const res = await fetch(`/pedidos/api/loadMore?offset=${offset}`)
        const pedidosExtra = await res.json()
        
        if(pedidosExtra) console.log(pedidosExtra);

        setPedidos( prev => [...prev, ...pedidosExtra] )
        setOffset( prev => prev + 10 )
        setLoadingMore(false)

    }

    const [date, setDate] = useState<Date | null>(new Date())

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
                        setSearchParam={handleSearch} 
                        placeholder='Buscar lista'
                        textInput
                    />
                    <button 
                        className={style.filter}
                        onClick={() => setModalDisplay( prev => !prev )}
                        data-active={modalDisplay}
                    >
                        {svgsUtil.import}
                        <p>Filtrar</p>
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
                        
                        <div className={style.query}>
                            <p>Não encontrou o pedido?</p>
                            <button
                                onClick={() => pesquisaDb(searchParam)}
                            >
                                {svgsUtil.import}
                                <p>Pesquisar db</p>
                            </button>
                        </div>

                    </motion.div>
                    }

                    {(pedidosDisplay.length > 0 && searchParam)&&
                        <div className={style.query}>
                            <p>Não encontrou o pedido?</p>
                            <button
                                onClick={() => pesquisaDb(searchParam)}
                            >
                                {svgsUtil.import}
                                <p>Pesquisar db</p>
                            </button>
                        </div>
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

                    {loadingQuery&&
                        <span>
                            <LogoSvg loop/>
                            Carregando...
                        </span>
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

}

const FiltroModal = ({modalDisplay, setModalDisplay} : FiltroModalProps) => {

    const modalRef = useRef<HTMLDivElement>(null)
    const datePickerRef1 = useRef(null)
    const datePickerRef2 = useRef(null)

    const [fornecedor, setFornecedor] = useState('')
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(new Date())

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

    const popoverRef = useRef<HTMLSpanElement>(null)

    return (
        <motion.div 
            className={style.modal}
            ref={modalRef}

            initial={{ y: -10, opacity: 0, height: 0 }}
            animate={{ y: 0, opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
        >
            <header className={style.header}>
                <h3>Filtrar</h3>
                <button onClick={() => setModalDisplay(false)}>
                    {svgsUtil.delete}
                </button>
            </header>
            <div className={style.filtros}>
                {/* <Config 
                    svg={svgsUtil.fornecedor} 
                    title={'Fornecedor'} 
                    description={'Filtrar por nome de fornecedor'} 
                    input={
                        <input type="text" />
                    } 
                />
                <Config 
                    svg={svgsUtil.data} 
                    title={'Data'} 
                    description={'Filtrar por período de cadastro'} 
                    input={
                        <input type="text" />
                    } 
                /> */}
                <span>
                    <p>fornecedor</p>
                    <input 
                        type="text" 
                        value={fornecedor}
                        onChange={(e) => setFornecedor(e.target.value)}
                    />
                </span>
                <span>
                    <p>Perído cadastro</p>
                    <span>
                        {/* <input type="date" /> */}
                        <DatePickRange label='de:' popoverRef={popoverRef}/>
                        {/* <DatePick label='até:' popoverRef={popoverRef}/> */}
                        {/* <p>a</p> */}
                       
                        {/* <input 
                            value={date}
                            onChange={(e) => console.log(e.target.value, typeof e.target.value)}
                            type="date" 
                        /> */}
                    </span>
                </span>                    
            </div>
            <footer className={style.footer}>
                <button className={style.clear}>Limpar</button>
                <button className={style.confirm}>Aplicar</button>
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
        // <DatePicker className={style.datePicker}>
        //     <Label>{label}</Label>
        //     <Group className={style.inputWrapper}>
        //         <DateInput className={style.dateInput}>
        //         {(segment) => <DateSegment segment={segment} className={style.segment}/>}
        //         </DateInput>
        //         <Button className={style.expand}>{() => svgsUtil.expand(false)}</Button>
        //     </Group>
        //     {description && <Text slot="description">{description}</Text>}
        //     <FieldError>{errorMessage}</FieldError>
        //     <Popover 
        //         className={style.popover}
        //         ref={popoverRef}
        //     >
        //         <Dialog className={style.dialog}>
        //         <Calendar className={style.calendar}>
        //             <header className={style.header}>
        //             <Heading className={style.month} />
        //             <Button slot="previous">◀</Button>
        //             <Button slot="next">▶</Button>
        //             </header>
        //             <CalendarGrid className={style.grid}>
        //             {(date) => <CalendarCell date={date} className={style.date}/>}
        //             </CalendarGrid>
        //         </Calendar>
        //         </Dialog>
        //     </Popover>
        // </DatePicker>
        <DateRangePicker className={style.datePicker} {...props}>
        <Label>{label}</Label>
        <Group className={style.inputWrapper}>
            <DateInput slot="start" className={style.dateInput}>
            {(segment) => <DateSegment segment={segment} className={style.segment} />}
            </DateInput>
            <span aria-hidden="true">-</span>
            <DateInput slot="end" className={style.dateInput}>
            {(segment) => <DateSegment segment={segment} className={style.segment} />}
            </DateInput>
            <Button className={style.expand}>{() => svgsUtil.expand(false)}</Button>
        </Group>
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
        <Popover
            className={style.popover}
            ref={popoverRef}
        >
            <Dialog className={style.dialog}>
            <RangeCalendar className={style.calendar} >
                <header className={style.header}>
                <Button slot="previous">◀</Button>
                <Heading />
                <Button slot="next">▶</Button>
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