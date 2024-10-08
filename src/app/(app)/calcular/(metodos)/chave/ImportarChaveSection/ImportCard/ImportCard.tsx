import { MouseEvent, useState } from 'react'
import style from './ImportCard.module.scss'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import Highlight from '@/components/Highlight/Highlight'
import LogoSvg from '@/components/SvgArray/LogoSvg'
import { DocumentoData, DocumentoImportado } from '@/hooks/useDocumento'
import { AnimatePresence, motion } from 'framer-motion'
import useImportCard from '@/hooks/useImportCard'
import chaveFormatSplit from '@/utils/chaveFormat'

interface ImportCardProps {

    documento: DocumentoData

}

export default function ImportCard( { documento }: ImportCardProps ){

    const {
        documento: documentoNome,
        chave,
        loading,
        importado
    } = documento

    const {
        inputRef,

        splitChave,
        selectionActive,
        valid,

        handleSubmit,
        
        caret,
        handleInputChange,
        handleCaretEvent,
        handleDigitClick,
        resetCaret,
    } = useImportCard(documento)

    return (
        <form 
            className={style.importCard}
            onSubmit={(e) => handleSubmit(e)}
        >

            <span className={style.badge}>
                {svgsUtil.unitarioNota}
                <p>Importar valores da <Highlight>{documentoNome}</Highlight> através da chave de acesso:</p>
            </span>

            <span className={style.input}>
               
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
