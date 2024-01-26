import { IFatores } from '@/interfaces/IFatores'
import './TableBody.scss'
import { IValores } from '@/interfaces/IValores'



interface TableBodyProps {

    valores: IValores[] | IFatores[]
    setState: (valores: any[]) => void 

}

const TableBody = ({ valores, setState }: TableBodyProps) => {

    const excluirLinha = (index: number) => {

        setState((valores).filter((valor, id) => index !== id))
    
    }

  return (
    <div className='tbody'>
        {}
            {valores.map((produto, index) => 
                <div  
                    className='tr'
                    key={index}
                >
                    {Object.values(produto).map((valor: string | number, index: number) => 
                        <div 
                            className='td'
                            key={index}
                        >{
                            (typeof valor === 'number')
                            ? valor.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 4})
                            : valor
                        }
                        </div>
                    )}
                    <>
                    
                    <svg 
                        width="25px" 
                        height="25px" 
                        viewBox="0 0 32 32" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                            <path 
                                d="M6.001 7.128L6 10.438l19.998-.005L26 7.124zM6.001 21.566L6 24.876l19.998-.006.002-3.308zM6.001 14.341L6 17.65l19.998-.004.002-3.309z"
                            />
                    </svg>
                    
                    <svg 
                        onClick={() => excluirLinha(index)}
                        width="25px" 
                        height="25px" 
                        viewBox="0 0 32 32" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                            <path 
                                d="M7.004 23.087l7.08-7.081-7.07-7.071L8.929 7.02l7.067 7.069L23.084 7l1.912 1.913-7.089 7.093 7.075 7.077-1.912 1.913-7.074-7.073L8.917 25z"
                            />
                    </svg>

                    </>
                    
                </div>
            
            )}
        </div>
  )
}

export default TableBody