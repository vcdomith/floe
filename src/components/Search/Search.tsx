
import { ChangeEvent } from 'react'
import NumberInput from '../FatoresTable/FatoresTableBody/NumberInput/NumberInput'
import search from './Search.module.scss'

interface SearchProps {
    className?: string | string[]
    textInput?: boolean 
    searchParam: string
    setSearchParam: (searchParam: string) => void
}

const Search = ({ className, searchParam, setSearchParam, textInput }: SearchProps) => {

  return (
    <span
        className={`${search.search} ${className}`}
    >
        {searchParam.length > 0 
        
        ? <button className={search.clear} >
            <svg
            style={{opacity: `${searchParam.length > 0 ? '1' : '0'}`}}
            onClick={() => setSearchParam('')}
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
        : <svg 
            className={search.lupa}
            width="25px" 
            height="25px" 
            viewBox="-100 -300 2700 2700" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M1458.948 1305.626c104.637-136.95 167.527-307.187 167.527-492.388C1626.475 364.764 1261.711 0 813.238 0 364.764 0 0 364.764 0 813.238c0 448.473 364.764 813.237 813.238 813.237 185.201 0 355.547-62.89 492.496-167.527L1766.678 1920 1920 1766.678l-461.052-461.052Zm-645.71 103.986c-328.874 0-596.375-267.61-596.375-596.374 0-328.765 267.501-596.375 596.375-596.375 328.873 0 596.374 267.61 596.374 596.375s-267.501 596.374-596.374 596.374Z" fillRule="evenodd"/>
        </svg>
        }
        {!textInput
        ?
        <NumberInput 
        placeholder='Buscar'
        valor={searchParam}
        setValor={setSearchParam}
        className={search.input}
        onKeyDown={(e: KeyboardEvent) => {if(e.key === 'Escape') setSearchParam('')}}
        // required={false}
        // onBlur={() => setSearchParam('')}
        />
        :
        <div>
            <input 
                className={search.input}
                type="text"
                value={searchParam}
                onChange={(e) => setSearchParam(e.target.value.toUpperCase())}
                onKeyDown={(e) => {if(e.key === 'Escape') setSearchParam('')}}
                placeholder='Buscar'
             />
        </div>
        }
        
    
    </span>
  )
}

export default Search