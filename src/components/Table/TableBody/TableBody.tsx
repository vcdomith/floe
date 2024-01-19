import { IFatores } from '@/interfaces/IFatores'
import './TableBody.scss'
import { IValores } from '@/interfaces/IValores'

interface TableBodyProps {

    valores: IValores[] | IFatores[]

}

const TableBody = ({ valores }: TableBodyProps) => {
  return (
    <tbody >
            {valores.map((produto, index) => 
                <tr 
                    className={index === valores.length - 1 
                                        ? 'lastRow' 
                                        : ''
                              } 
                    key={index}
                >
                    {Object.values(produto).map(
                        (valor, index) => 
                        <td 
                            className='first'
                            key={index}
                        >{valor}</td>
                    )}
                    {/* for (const valor of valores) {
                        for (const dado of Object.values(valor)) {
                            console.log(dado);
                        }
                        } */}
                    {/* <td >{(produto.unitario).toFixed(2)}</td>
                    <td>{(produto.tabela1).toFixed(2)}</td>
                    <td>{(produto.tabela2).toFixed(2)}</td>
                    <td >{(produto.tabela3).toFixed(2)}</td> */}
                </tr>
            
                )}
        </tbody>
  )
}

export default TableBody