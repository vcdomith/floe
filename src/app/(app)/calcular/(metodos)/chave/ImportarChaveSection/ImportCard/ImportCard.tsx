import { ChangeEvent, DragEvent, MouseEvent, useMemo, useState } from 'react'
import style from './ImportCard.module.scss'
import { svgsUtil, SvgUtilItems } from '@/components/SvgArray/SvgUtil'
import Highlight from '@/components/Highlight/Highlight'
import LogoSvg from '@/components/SvgArray/LogoSvg'
import { DocumentoData, DocumentoImportado } from '@/hooks/useDocumento'
import { AnimatePresence, motion } from 'framer-motion'
import useImportCard from '@/hooks/useImportCard'
import chaveFormatSplit from '@/utils/chaveFormat'
import { parseCTeXml } from '@/utils/parseXml'

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
                    <Xml />
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

const Chave = ({ documento }: { documento: DocumentoData }) => {

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

const Xml = () => {


    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {

        const file = e.dataTransfer.files?.[0]
        // console.log(fileList);

        if (file) {
            const reader = new FileReader()
            reader.onload = function (e) {
                const text = e.target?.result as string
                
                const data = parseCTeXml(text)

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
                
                const data = parseCTeXml(text)

                console.log(data);

            }
            reader.readAsText(file)
        }

    }

    return (
        <div 
            className={style.xml}
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
            <label 
                className={style.import}
                htmlFor="file"
                onDragOver={(e) => {
                    e.preventDefault()
                    // console.log(e)
                }}
                onDragLeave={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault()
                    handleDrop(e)
                }}
            >
                    Selecionar arquivo
            </label>

        </div>
    )

}

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
