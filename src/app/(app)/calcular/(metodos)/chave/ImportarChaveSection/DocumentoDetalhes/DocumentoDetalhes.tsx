import { DocumentoImportado } from '@/hooks/useDocumento'
import style from './DocumentoDetalhes.module.scss'

export default function DocumentoDetalhes({documento}: {documento: DocumentoImportado}) {

    return (
        <div>
            {Object.entries(documento).map(([key, value], index) => 
                <span key={index}>
                    <h2>{key}</h2>
                    <p>{JSON.stringify(value)}</p>
                </span>
            )}
        </div>
    )

}