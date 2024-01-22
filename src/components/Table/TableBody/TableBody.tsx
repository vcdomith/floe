import { IFatores } from '@/interfaces/IFatores'
import './TableBody.scss'
import { IValores } from '@/interfaces/IValores'

interface TableBodyProps {

    valores: IValores[] | IFatores[]

}

const TableBody = ({ valores }: TableBodyProps) => {

  return (
    <div className='tbody'>
            {valores.map((produto, index) => 
                <div 
                    className={index === valores.length - 1 
                                        ? 'tr lastRow' 
                                        : 'tr'
                              } 
                    key={index}
                >
                    {Object.values(produto).map(
                        (valor: string | number, index: number) => 
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
                </div>
            
                )}
        </div>
  )
}

export default TableBody