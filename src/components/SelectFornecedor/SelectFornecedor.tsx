'use client'
import { relative } from "path"
import { ChangeEvent, KeyboardEvent, MouseEvent, MutableRefObject, RefObject, useEffect, useRef, useState } from "react"

import style from './SelectFornecedor.module.scss'
import { AnimatePresence, motion } from "framer-motion"

const SelectFornecedor = () => {

    const fornecedoresControle = ['Mileno','Denlex','Imporiente','GoldenRio', 'FWB', 'Yins', 'Molduleo', 'Bla', 'AC', "Fafafa"]

    const [fornecedor, setFornecedor] = useState('')

	const [display, setDisplay] = useState(false)
    const [search, setSearch] = useState('')
    const [fornecedores, setFornecedores] = useState<string[]>(fornecedoresControle)
    const [selectIndex, setSelectIndex] = useState(0)

    const searchElementRef = useRef<HTMLInputElement>(null)
    const fornecedoresRef = useRef<HTMLUListElement>(null)


    const handleClick = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {

        e.preventDefault()

        searchElementRef.current?.focus()
        // if(document.activeElement === searchElementRef.current) return
        // console.log(document.activeElement)
        // console.log(searchElementRef.current)
        // console.log(document.activeElement === searchElementRef.current)
        // setDisplay(prev => !prev)

    }

    const handleBlur = () => {

        setDisplay(false)

    } 

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {

        switch (e.code) {

            case 'ArrowUp':

                e.preventDefault()
                
                setSelectIndex(prev => {
                        if(prev === 0) return 0
                        return prev-1
                })  
                
                break;
                    
            case 'ArrowDown':

                e.preventDefault()

                setSelectIndex(prev => {
                    if(prev === (fornecedores.length-1)) return prev
                    return prev+1
                })

                break;

            case 'Enter':
        
                e.preventDefault()

                setFornecedor((fornecedoresRef.current?.childNodes[selectIndex] as HTMLLIElement).innerText)
                // searchElementRef.current?.blur()
                setDisplay(false)
                break;

            case 'Space':
                    
                e.preventDefault()

                setFornecedor((fornecedoresRef.current?.childNodes[selectIndex] as HTMLLIElement).innerText)
                // searchElementRef.current?.blur()
                setDisplay(false)
                
                break;

            case 'Escape':
                
                if(searchElementRef.current?.value !== '') { 
                    setSearch('')
                    break;
                }   
                
                // searchElementRef.current?.blur()
                setDisplay(false)
                break;
        
            default:
                break;
        }

    }

    useEffect(() => {
        // console.log(selectIndex);
        console.log(fornecedoresRef.current?.childNodes[selectIndex]);
        if(fornecedoresRef.current)
        (fornecedoresRef.current?.childNodes[selectIndex] as HTMLLIElement)
            .scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest'})
    }, [selectIndex])

    useEffect(() => {

        setSelectIndex(0)

        if(search.length > 0) {
            
            if (!display) setDisplay(true)

            setFornecedores(fornecedoresControle.filter(fornecedor => fornecedor.includes(search)))
            return

        } else {
            setFornecedores(fornecedoresControle)
        }

    }, [search])

    useEffect(() => {
        setSearch('')
    }, [display])

	return (
		<div
            className={style.wrapper}
            data-display={display}
        >
            <button
                className={style.select}
                onClick={(e) => {    
                    e.preventDefault()
                    setDisplay(prev => !prev)
                }}
            >
                <input
                    className={style.selectInput}
                    // readOnly 
                    required
                    // disabled={fornecedor ? true : false}
                    placeholder="Selecione um fornecedor"
                    type="text" 
                    contentEditable={false}
                    value={fornecedor}
                />
                <svg fill="#000000" width="30px"viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <path 
                        d={`${display 
                            ? "M15.997 13.374l-7.081 7.081L7 18.54l8.997-8.998 9.003 9-1.916 1.916z"
                            : "M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z"
                        }`}
                    />
                </svg>
                {/* <butto-n
                        // onClick={(e) => {
                        //     e.preventDefault()
                        //     setDisplay(prev => !prev)
                        //     searchElementRef.current?.focus()
                        // }}
                    >
                </button> */}
            </button>
            <AnimatePresence>
            {display&&
            <motion.div
                initial={{opacity: 1, height: 0}}
                animate={{opacity: 1, height: 'auto'}}
                exit={{opacity: 1, height: 0}}
                // onClick={(e) => handleClick(e)}
                className={style.options}
                tabIndex={-1}
            >
                <span
                    className={style.search}
                    tabIndex={-1}
                    style={{
                        display: 'flex',
                        position: 'relative'
                    }}
                >
                    <svg 
                        className={style.lupa}
                        width="25px" 
                        height="25px" 
                        viewBox="-100 -300 2700 2700" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M1458.948 1305.626c104.637-136.95 167.527-307.187 167.527-492.388C1626.475 364.764 1261.711 0 813.238 0 364.764 0 0 364.764 0 813.238c0 448.473 364.764 813.237 813.238 813.237 185.201 0 355.547-62.89 492.496-167.527L1766.678 1920 1920 1766.678l-461.052-461.052Zm-645.71 103.986c-328.874 0-596.375-267.61-596.375-596.374 0-328.765 267.501-596.375 596.375-596.375 328.873 0 596.374 267.61 596.374 596.375s-267.501 596.374-596.374 596.374Z" fillRule="evenodd"/>
                    </svg>
                    <input
                        // required 
                        type="text" 
                        value={search} 
                        placeholder={display ? 'Buscar' : 'Selecione um fornecedor'} 
                        onChange={(e) => setSearch(e.target.value)} 
                        // onFocus={() => setDisplay(true)}
                        // onBlur={() => handleBlur()}
                        ref={searchElementRef}
                        autoFocus
                        spellCheck={false}
                        onKeyDown={(e) => handleKeyDown(e)}
                    />
                    {search&&
                    <button>
                        <svg
                        style={{opacity: `${search.length > 0 ? '1' : '0'}`}}
                        onClick={() => setSearch('')}
                        width="25px" 
                        height="25px" 
                        viewBox="0 0 32 32" 
                        xmlns="http://www.w3.org/2000/svg"
                        >   
                            <path 
                                d="M7.004 23.087l7.08-7.081-7.07-7.071L8.929 7.02l7.067 7.069L23.084 7l1.912 1.913-7.089 7.093 7.075 7.077-1.912 1.913-7.074-7.073L8.917 25z"
                            />
                        </svg>
                    </button>
                    }
                </span>

            <ul
                ref={fornecedoresRef}
                className={style.list}
                tabIndex={-1}
                data-display={display}
            >
            <AnimatePresence initial={false} mode="popLayout">    
            {(
                (fornecedores.length > 0)
                ?
                    fornecedores.map((fornecedor, index) => 
                    <motion.li 
                    initial={{ opacity: 0 , x: -20}}
                    animate={{opacity: 1, x: 0}}
                    exit={{opacity: 0, x: 20}}

                        key={fornecedor}
                        className={style.fornecedor}
                        data-selected={selectIndex === index}
                        tabIndex={-1}
                        onMouseEnter={() => console.log(fornecedor)}
                        onClick={() => {
                            setFornecedor(fornecedor)
                            setDisplay(false)
                        }}
                    >{fornecedor}</motion.li>
                    )
                :
                    <motion.li
                    initial={{ opacity: 0 , x: -20}}
                    animate={{opacity: 1, x: 0}}
                    exit={{opacity: 0, x: 20}}
                    >Nenhuma correspondência encontrada</motion.li>
            )
            }
            </AnimatePresence>
            </ul>          
            </motion.div>
            }
            </AnimatePresence>


		</div>
	)
}

export default SelectFornecedor