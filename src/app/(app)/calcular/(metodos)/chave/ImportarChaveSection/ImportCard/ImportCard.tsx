
import { DocumentoData, DocumentoImportado } from '@/hooks/useDocumento'
import style from './ImportCard.module.scss'
import Highlight from '@/components/Highlight/Highlight'
import { AnimatePresence, motion } from 'framer-motion'
import { ChangeEvent, DragEvent, useState } from 'react'
import { useNotification } from '@/app/(app)/(contexts)/NotificationContext'
import { parseXml } from '@/utils/parseXml'
import { useModal } from '@/app/(app)/(contexts)/ModalContext'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import useImportCardDrag from './useImportCardDrag'
import useImportCard from '@/hooks/useImportCard'

interface ImportCardProps {
    documento: DocumentoData
}

export default function ImportCard({documento}: ImportCardProps) {

    const {
        documentos,
        dragHover,
        setDragHover,
        handleChange,
        handleDrop,
    } = useImportCardDrag()

    return (
        <motion.div 
            className={style.importCard}
            layout
            onDragOver={(e) => {
                e.preventDefault()
                setDragHover(true)
                // console.log(e)
            }}
            onDragLeave={(e) => {
                if (e.target !== e.currentTarget) return
                e.preventDefault()
                setDragHover(false)
            }}
            onDrop={(e) => {
                e.preventDefault()
                setDragHover(false)
                handleDrop(e)
            }}
            data-hover={dragHover}
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
                data-hover={dragHover}

                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <p><Highlight>arraste</Highlight> ou <Highlight>selecione</Highlight> arquivo .xml</p>
            </motion.label>
    
            <div 
                className={style.chave}
                data-hover={dragHover}
            >
                <span 
                    className={style.title}
                    data-hover={dragHover}
                >
                    <p>digite a <Highlight>chave</Highlight> do documento para importar</p>
                </span>
                <Chave documento={documento} />
                <button 
                    className={style.importButton}
                    data-hover={dragHover}
                >Importar</button>
            </div>


            <ul 
                className={style.documentos}
            >
                <AnimatePresence mode='popLayout'>
                {documentos.map( documento => 
                    <motion.div 
                        className={style.documento}
                        key={documento.chave}
                        data-hover={dragHover}
                        onClick={ () => {
                            // console.log(divRef.current);
                            // console.log(documentosNodes)
                        }}

                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
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
                {dragHover&&
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
        
                </AnimatePresence>
            </ul>
        </motion.div>
    )

}

const Chave = ({ documento }: { documento: DocumentoData }) => {

    const {
        documento: documentoNome,
        chave,
    } = documento

    const {dragHover} = useImportCardDrag()

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
        <div 
            className={style.format}
            data-hover={dragHover}
        >
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