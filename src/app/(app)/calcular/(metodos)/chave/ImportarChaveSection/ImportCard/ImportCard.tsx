import { ChangeEvent, DragEvent, forwardRef, MouseEvent, RefObject, useMemo, useRef, useState } from 'react'
import style from './ImportCard.module.scss'
import { svgsUtil, SvgUtilItems } from '@/components/SvgArray/SvgUtil'
import Highlight from '@/components/Highlight/Highlight'
import LogoSvg from '@/components/SvgArray/LogoSvg'
import { DocumentoData, DocumentoImportado } from '@/hooks/useDocumento'
import { AnimatePresence, motion } from 'framer-motion'
import useImportCard from '@/hooks/useImportCard'
import chaveFormatSplit from '@/utils/chaveFormat'
import { parseCTeXml, parseXml } from '@/utils/parseXml'
import { useNotification } from '@/app/(app)/(contexts)/NotificationContext'
import { useModal } from '@/app/(app)/(contexts)/ModalContext'
import { create } from 'lodash'
import { createPortal } from 'react-dom'
import ConfirmationDialog from '@/components/ConfirmationDialog/ConfirmationDialog'

interface ImportCardProps {

    tipo: 'chave' | 'xml'
    documento: DocumentoData

}

export default function ImportCard( { tipo, documento }: ImportCardProps ){

    const {
        documento: documentoNome,
        loading,
        importado
    } = documento

    const {
        valid,
        handleSubmit,
    } = useImportCard(documento)

    const svg = useMemo(() => `${tipo}Import`, [tipo])

    return (
        <form 
            className={style.importCard}
            onSubmit={(e) => handleSubmit(e)}
        >

            <span className={style.badge}>
                {svgsUtil[svg as keyof SvgUtilItems] as React.ReactNode}
                <p>Importar valores da <Highlight>{documentoNome}</Highlight> através da chave de acesso:</p>
            </span>

            <span className={style.input}>
                
                {(tipo === 'chave')&&
                    <Chave documento={documento}/>
                }

                {(tipo === 'xml')&&
                    <>
                    <Xml documento={documento}/>
                    {/* <Chave documento={documento} /> */}
                    </>
                }
                
            </span>

            <button 
                className={style.button}
                disabled={!valid || loading}
                type='submit'
            >
                {loading
                    ? <><LogoSvg loop />  Importando...</> 
                    : `Importar ${documentoNome}`
                }
            </button>

            {importado&&
            <Documento documento={importado}/>
            }

        </form>
    )

}

export const Chave = ({ documento }: { documento: DocumentoData }) => {

    const {
        documento: documentoNome,
        chave,
    } = documento

    const {
        inputRef,

        splitChave,
        selectionActive,
        
        caret,
        handleInputChange,
        handleCaretEvent,
        handleDigitClick,
        resetCaret,
    } = useImportCard(documento)

    return (
        <div className={style.format}>
            <input 
                className={style.input}
                type="text" 
                required
                minLength={44} 
                maxLength={44}
                value={chave}
                onChange={(e) => handleInputChange(e)}
                onClick={() => handleCaretEvent()}
                onKeyUp={() => handleCaretEvent()}
                onBlur={() => resetCaret()}

                ref={inputRef}
            />
            <span className={style.segments}>
                {splitChave?.map( (segment, indexSegment) => 
                    <span className={style.segment} key={indexSegment}>
                    {segment.split('').map( (digit, indexDigit) => {

                        const digitIndex = (indexSegment * 4) + indexDigit

                        return (
                            <div 
                            key={indexDigit}
                            className={`${style.digit} ${style[documentoNome]}`}
                            data-active={
                                selectionActive 
                                    ? (digitIndex >= caret.start && digitIndex < caret.end)
                                    : (digitIndex === caret.end)
                            }
                            data-caret={selectionActive ? false : (digitIndex + 1) === caret.end}
                            onClick={() => handleDigitClick(digitIndex)}
                        >{digit}</div>
                        )
                    })}
                    </span>
                )}
            </span>
        </div>
    )

}

interface DocumentosNodes {
    nfe: Document | null
    cte: Document | null

}

const appendToNode = (node: HTMLElement, content: Document ) => {
    node.innerHTML += JSON.stringify(content)
}

export const Xml = ({ documento }: { documento: DocumentoData }) => {

    const [documentos, setDocumentos] = useState<DocumentoImportado[]>([])
    const [documentosNodes, setDocumentosNodes] = useState<DocumentosNodes>({
        nfe: null,
        cte: null,
    })

    const [ hover, setHover ] = useState(false)
    const { addNotification } = useNotification()

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {

        const file = e.dataTransfer.files?.[0]

        if (file.name.split('.').at(-1) !== 'xml') {
            addNotification({
                tipo: 'erro',
                mensagem: `Arquivo tipo .${file.name.split('.').at(-1)} não é compatível, use um arquivo .xml`
            })
        }

        if (file) {
            const reader = new FileReader()
            reader.onload = function (e) {
                const text = e.target?.result as string
                
                const { data, documento, node } = parseXml(text)

                setDocumentosNodes(prev => ({
                    ...prev,
                    [documento.tipo.toLowerCase()]: node
                }))
                // const documento: DocumentoImportado = {
                //     tipo: 'CTe',
                //     fornecedor: data.transportador,
                //     numero: data.nCTe,
                //     chave: data.chaveCTe,
                //     data: new Date(),
                // }

                setDocumentos(prev => [
                    ...prev,
                    documento
                ])

                console.log(data);

            }
            reader.readAsText(file)
        }

    }
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0]
        // console.log(fileList);

        if (file) {
            const reader = new FileReader()
            reader.onload = function (e) {
                const text = e.target?.result as string
                
                const { data, documento } = parseXml(text)

                // const documento: DocumentoImportado = {
                //     tipo: 'CTe',
                //     fornecedor: data.transportador,
                //     numero: data.nCTe,
                //     chave: data.chaveCTe,
                //     data: new Date(),
                // }

                setDocumentos(prev => [
                    ...prev,
                    documento
                ])

                console.log(data);

            }
            reader.readAsText(file)
        }

    }

    const { setModal } = useModal()

    return (
        <motion.div 
            className={style.xml}
            layout
            onDragOver={(e) => {
                e.preventDefault()
                setHover(true)
                // console.log(e)
            }}
            onDragLeave={(e) => {
                e.preventDefault()
                setHover(false)
            }}
            onDrop={(e) => {
                e.preventDefault()
                setHover(false)
                handleDrop(e)
            }}
            data-hover={hover}
            // onDragEnter={}
        >
{/* 
            <span className={style.title}>
                {svgsUtil.xmlImport}
                <p>Procure um arquivo XML em seu sistema ou arraste para importar seus dados:</p>
            </span> */}
            <input
                className={style.file} 
                type="file" 
                accept  ='.xml' 
                name="file" 
                id="file" 
                onChange={(e) => handleChange(e)}
            />
            <motion.label 
                className={style.import}
                htmlFor="file"
                data-hover={hover}

                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <p><Highlight>arraste</Highlight> ou <Highlight>selecione</Highlight> arquivo .xml</p>
            </motion.label>
            <Chave documento={documento} />
            <ul 
                className={style.documentos}
            >
                <AnimatePresence mode='popLayout'>
                {documentos.map( documento => 
                    <motion.div 
                        className={style.documento}
                        key={documento.chave}
                        data-hover={hover}
                        onClick={ () => {
                            setModal( <div/> )
                            // console.log(divRef.current);
                            console.log(documentosNodes)
                            appendToNode(
                                document.body, 
                                (documentosNodes[documento.tipo.toLowerCase() as keyof DocumentosNodes])!
                            )
                        }}

                        initial={{ opacity: 0, scale: '1.5' }}
                        animate={{ opacity: 1, scale: '1' }}
                        exit={{ opacity: 0 }}
                    >
                        {svgsUtil.unitarioNota}
                        <span className={style.tipo}>
                            <p>{documento.tipo}</p>
                            {svgsUtil.check}
                        </span>
                        <p>{documento.numero}</p>
                    </motion.div>
                )}
                {hover&&
                <motion.div 
                    className={`${style.documento} ${style.extra}`}

                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {svgsUtil.unitarioNota}
                    {svgsUtil.plus}
                </motion.div>
                }
                {/* {(hover)
                ?
                <motion.div 
                    className={style.hover}

                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {hover&& svgsUtil.produto3D}
                    <p>Solte para importar o documento</p>
                </motion.div>
                :
                <>
                {documentos.map( documento => 
                    <div 
                        className={style.documento}
                        key={documento.chave}
                    >
                        {svgsUtil.unitarioNota}
                        <p>{documento.tipo}</p>
                        <p>{documento.numero}</p>
                    </div>
                )}
                {hover&&
                <div 
                    className={`${style.documento} ${style.extra}`}
                >
                    {svgsUtil.plus}
                </div>
                }
                </>

                } */}
                </AnimatePresence>
            </ul>
        </motion.div>
    )

}

{/* <input
className={style.file} 
type="file" 
accept  ='.xml' 
name="file" 
id="file" 
onChange={(e) => handleChange(e)}
/>
<motion.label 
className={style.import}
htmlFor="file"

initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
>
    Selecionar arquivo
</motion.label> */}

const Documento = ({ documento }: { documento: DocumentoImportado }) => {

    const { fornecedor, numero, data, chave } = documento
    const [display, setDisplay] = useState(false)

    const handleTabClick = (e: MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation()
        setDisplay( prev => !prev )
    }

    return (
        <motion.div 
            className={style.imported}

            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <span 
                className={style.tab} 
                onClick={(e) => handleTabClick(e)}
                data-display={display}
            >
                {svgsUtil.unitarioNota}                
                <p>Documento Importado</p>
                {svgsUtil.expand(display)}
            </span>
            <AnimatePresence>
            {display&&
            <motion.div 
                className={style.info}

                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
            >
                <h4>{fornecedor}</h4>
                <span>
                    {svgsUtil.numero}
                    <p>{numero}</p>
                </span>
                <span>
                    {svgsUtil.data}
                    <p>{data.toLocaleString()}</p>
                </span>
                <span>
                    {svgsUtil.chave}
                    <div className={style.chave}>
                        {chaveFormatSplit(chave)?.map( (segment, index) => 
                            <p key={parseInt(segment)+index}>{segment}</p>
                        )}
                    </div>
                </span>
            </motion.div>
            }
            </AnimatePresence>
        </motion.div>
    )

}
