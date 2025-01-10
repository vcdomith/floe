'use client'
import Link from "next/link";
import style from './MetodoSelect.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
import { svgsUtil } from "@/components/SvgArray/SvgUtil";
import { redirect, usePathname } from "next/navigation";
import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor";
import { Dispatch, FocusEvent, ReactNode, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import useDynamicState from "@/hooks/useDynamicState";
import { useRouter } from "next/navigation";
import capitalize from "@/utils/capitalize";

const METODOS = ['chave', 'manual'] as const
type Metodo = (typeof METODOS)[number]
const METODOS_DATA: Record<Metodo, {svg: ReactNode, desc: string}> = {
    chave: {
        svg: svgsUtil.documentImport,
        desc: 'Importe os documentos por chave ou por XML'
    },
    manual: {
        svg: svgsUtil.documentManual,
        desc: 'Calcular preços preenchendo dados manualmente'
    }
}
const IDS = METODOS.length

export default function MetodoSelect() {

    const path = usePathname().split('/').at(-1)
    // console.log(path);

    // const router = useRouter()
    // const [metodo, setMetodo] = useState(path?? 'chave')

    // if (metodo !== path) router.push(metodo)

    const [open, setOpen] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)

    // console.log(containerRef.current?.children);

    // const spring = { 
    //     type: "spring",
    //     mass: 0.5,
    //     damping: 11, 
    //     bounce: 0, 
    //     restDelta: 0.5,
    // }

    return (
        // <SelectFornecedor 
        //     fornecedoresControle={['chave', 'manual']} 
        //     fornecedor={path?? ''} 
        //     setFornecedor={setMetodo} 
        // />

        <div 
            className={style.container}
            ref={containerRef}
        >
            <button 
                className={style.metodo}
                data-open={open}
                onClick={() => setOpen( prev => !prev )}
            >
                <h2>{capitalize(path?? '')}</h2>
                {svgsUtil.expand(open)}
            </button>
            <span className={style.listContainer}>
                <AnimatePresence>
                {open&&
                    <MetodosLista 
                        path={path?? ''} 
                        setOpen={setOpen} 
                        containerRef={containerRef} 
                    />
                }
                </AnimatePresence>
            </span>
        </div>

        // <span className={style.select}>
        
        //     <div className={style.option}>
        //         <Link
        //             href={'/calcular/chave'}
        //             prefetch
        //             data-selected={path === 'chave'}
        //         >
        //             {svgsUtil.documentImport}
        //             <p>importar</p>
        //         </Link>
        //         {path === 'chave'&&
        //         <motion.div 
        //             className={style.background}
        //             layoutId="Metodo"
        //             transition={spring}
        //         ></motion.div>
        //         }
        //     </div>
        //     <div className={style.option}>
        //         <Link
        //             href={'/calcular/manual'}
        //             prefetch
        //             data-selected={path === 'manual'}
        //         >
        //             {svgsUtil.unitarioNota}
        //             <p>manual</p>
        //         </Link>
        //         {path === 'manual'&&
        //         <motion.div 
        //             className={style.background}
        //             layoutId="Metodo"
        //             transition={spring}
        //         ></motion.div>
        //         }
        //     </div>
        // </span>
    )

}
interface MetodosListaProps {
    path: string
    setOpen: (open: boolean) => void
    containerRef: RefObject<HTMLDivElement>
}
const MetodosLista = ({path, setOpen, containerRef}: MetodosListaProps) => {

    const [selectedId, setSelectedId] = useState<number | null>(null)
    const listRef = useRef<HTMLUListElement>(null)

    console.log(selectedId);

    const listElementChildren = listRef.current?.childNodes
    if (selectedId !== null && listElementChildren) {
        (listElementChildren[selectedId] as HTMLAnchorElement).focus()
    }
    
    useEffect(() => {

        function handleClickOutside(e: MouseEvent) {
            if( containerRef.current && !containerRef.current?.contains(e.target as Node) ) {
                setOpen(false)
            }
        }

        function handleKeyDown(e: KeyboardEvent) {

            switch (e.code) {
                
                case 'ArrowUp': {

                    e.preventDefault()
                    if (selectedId === 0) return

                    const newSelectedId = (selectedId === 0 || selectedId === null)
                        ? 0
                        : selectedId - 1

                    setSelectedId(newSelectedId)

                    break;
                }

                case 'ArrowDown': {

                    e.preventDefault()
                    if (selectedId === (IDS - 1)) return

                    const newSelectedId = (selectedId === (IDS-1))
                        ? selectedId
                        : (selectedId === null) 
                            ? 0 
                            : selectedId + 1

                    setSelectedId(newSelectedId)

                    break;
                }
                    
                case 'Escape': {
                    setOpen(false)
                }
            
                default:
                    break;
            }

        }

        document.addEventListener('click', handleClickOutside)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('click', handleClickOutside)
            document.removeEventListener('keydown', handleKeyDown)
        } 

    }, [selectedId])

    return (
        <motion.ul 
            className={style.list}

            initial={{ y: -10, opacity: 0, height: 0 }}
            animate={{ y: 0, opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            ref={listRef}

        >
            {METODOS.map((metodo, index) => 
                <Link
                    key={metodo}
                    href={metodo}
                    prefetch
                    data-selected={path === metodo}
                >   
                    {METODOS_DATA[metodo as keyof typeof METODOS_DATA].svg}
                    <div>
                        <h3>{capitalize(metodo)}</h3>
                        <p>
                            {METODOS_DATA[metodo as keyof typeof METODOS_DATA].desc}
                        </p>
                    </div>
                </Link>
            )}
        </motion.ul>
    )

} 