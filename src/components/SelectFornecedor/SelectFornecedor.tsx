'use client'
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
            <button
                onClick={(e) => handleClick(e)}
            >
                <input type="text" value={search} placeholder="Buscar" onChange={(e) => setSearch(e.target.value)} 
                    onFocus={() => setDisplay(true)}
                    onBlur={() => setDisplay(false)}
                    ref={searchElementRef}
                />
                
            <svg fill="#000000" width="30px"viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path 
                    d={`${display 
                        ? "M15.997 13.374l-7.081 7.081L7 18.54l8.997-8.998 9.003 9-1.916 1.916z"
                        : "M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z"
                    }`}
                />
            </svg>
          
            </button>

            {display
            ?(
                (fornecedores.length > 0)
                ?
                    fornecedores.map(fornecedor => 
                    <p key={fornecedor}>{fornecedor}</p>
                    )
                :
                    <p>Nenhuma correspondência encontrada</p>
            )
            :
                null
            }

		</div>
	)
}

export default SelectFornecedor