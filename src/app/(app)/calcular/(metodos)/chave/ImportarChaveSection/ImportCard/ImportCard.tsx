
import useDocumento, { DocumentoData, DocumentoImportado, UseDocumento } from '@/hooks/useDocumento'
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
import { useChave } from '@/app/(app)/calcular/context/CalcularContext'
import { UseChaveContext } from '@/hooks/useChaveContext'

export default function ImportCard() {

    const {
        chave: { documentosContext: context }
    } = useChave()

    const { valid, documentos } = context

    const {
        // documentos,
        dragHover,
        setDragHover,
        handleChange,
        handleDrop,
    } = useImportCardDrag(context)

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

            <AnimatePresence>
            {dragHover&&
            <motion.section 
                className={style.overlay}

                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className={style.icon}>
                    {svgsUtil.unitarioNota}
                    {svgsUtil.plus}
                </div>
            </motion.section>
            }
            </AnimatePresence>

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
                // data-hover={dragHover}

                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <p><Highlight>arraste</Highlight> ou <Highlight>selecione</Highlight> arquivo .xml</p>
            </motion.label>
    
            <div 
                className={style.chave}
            >
                <span 
                    className={style.title}
                >
                    <p>digite a <Highlight>chave</Highlight> do documento para importar</p>
                </span>
                <Chave context={context} />
                <button 
                    className={style.importButton}
                    disabled={!valid}
                >Importar</button>
            </div>

            <ul 
                className={style.documentos}
            >
                <AnimatePresence mode='popLayout'>
                {Object.entries(documentos).map( ([tipo, documento], index) => 
                    <motion.div 
                        className={`${style.documento} ${documento === null&& style.empty}`}
                        key={index}
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
                            <p>{tipo}</p>
                            {(documento !== null)&& svgsUtil.check}
                        </span>
                      
                        <p>{(documento === null) ? '••••••' : documento.numero}</p>
                        
                    </motion.div>
                )}
                {/* {dragHover&&
                <motion.div 
                    className={`${style.documento} ${style.extra}`}

                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {svgsUtil.unitarioNota}
                    {svgsUtil.plus}
                </motion.div>
                } */}
        
                </AnimatePresence>
            </ul>
        </motion.div>
    )

}

const Chave = ({ context }: { context: UseDocumento }) => {

    const {dragHover} = useImportCardDrag(context)

    const { chave } = context

    const {
        inputRef,

        splitChave,
        selectionActive,
        
        caret,
        handleInputChange,
        handleCaretEvent,
        handleDigitClick,
        resetCaret,
    } = useImportCard(context)

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
                            className={`${style.digit}`}
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