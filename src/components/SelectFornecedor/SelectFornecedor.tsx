'use client'
import { relative } from "path"
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react"

const SelectFornecedor = () => {

	const [display, setDisplay] = useState(false)
    const fornecedoresControle = ['Mileno','Denlex','Imporiente']
    const [fornecedores, setFornecedores] = useState<string[]>(fornecedoresControle)

    const searchElementRef = useRef<HTMLInputElement>(null)

    const [search, setSearch] = useState('')

    const handleClick = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {

        e.preventDefault()

        searchElementRef.current?.focus()
        // if(document.activeElement === searchElementRef.current) return
        // console.log(document.activeElement)
        // console.log(searchElementRef.current)
        // console.log(document.activeElement === searchElementRef.current)
        // setDisplay(prev => !prev)

    }

    useEffect(() => {

        if(search.length > 0) {
            
            setFornecedores(fornecedoresControle.filter(fornecedor => fornecedor.includes(search)))
            return

        } else {
            setFornecedores(fornecedoresControle)
        }

    }, [search])

	return (
		<div>
            <div
                // onClick={(e) => handleClick(e)}
                style={{
                    border: '2px solid',
                    width: 'fit-content',
                    // position: 'relative',
                    overflow: "hidden",
                    height: `${display ? '135px' : '35px'}`,
                    transition: 'height 600ms ease'
                }}
            >
                <span
                    style={{
                        display: 'flex',
                        position: 'relative'
                    }}
                >
                    <input 
                        type="text" 
                        value={search} 
                        placeholder={display ? 'Buscar' : 'Selecione um fornecedor'} 
                        onChange={(e) => setSearch(e.target.value)} 
                        onFocus={() => setDisplay(true)}
                        onBlur={() => setDisplay(false)}
                        ref={searchElementRef}
                        style={{
                            border: 'none',
                            outline: 'none',
                            height: '35px',
                            position: 'relative'
                            // transition: 'height 600ms ease'
                        }}
                    />
                    {search&&
                    <button 
                    style={{
                        position: "absolute",
                        right: '35px',
                        top: '10%',
                        background: 'none',
                        outline: 'none',
                        border: 'none',
                    }}
                    >
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
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            searchElementRef.current?.blur()
                            setDisplay(prev => !prev)
                        }}
                        style={{
                            position: "absolute",
                            right: 0,
                            background: 'none',
                            outline: 'none',
                            border: 'none',
                        }}
                    >
                    <svg fill="#000000" width="30px"viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path 
                            d={`${display 
                                ? "M15.997 13.374l-7.081 7.081L7 18.54l8.997-8.998 9.003 9-1.916 1.916z"
                                : "M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z"
                            }`}
                        />
                    </svg>
                    </button>
                </span>

            <ul
                style={{
                    // position: 'absolute',
                    // top: 0,
                    listStyleType: 'none',
                    padding: 0,
                    height: `${display ? '100px' : 0}`
                }}
            >    
            {(
                (fornecedores.length > 0)
                ?
                    fornecedores.map(fornecedor => 
                    <li 
                        key={fornecedor}
                        onClick={() => {
                            
                            setSearch(fornecedor)
                            setDisplay(false)
                        }}
                        style={{

                        }}
                    >{fornecedor}</li>
                    )
                :
                    <li>Nenhuma correspondência encontrada</li>
            )
            }
            </ul>          
            </div>


		</div>
	)
}

export default SelectFornecedor