import './TableHeader.scss'


interface TableHeaderProps {

    headers: string[]

}

const TableHeader = ({ headers }: TableHeaderProps) => {

  return (
    <div className='thead'>
        <div className='tr'>
            {headers.map(
                (header, index) => 
                  <div
                    className='th' 
                    key={index}>
                      {header}
                  </div>
            )}
        </div>
    </div>
  )
}

export default TableHeader