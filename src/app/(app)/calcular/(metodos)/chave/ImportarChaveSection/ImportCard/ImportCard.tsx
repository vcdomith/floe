
import useDocumento, { DocumentoData, DocumentoImportado, UseDocumento } from '@/hooks/useDocumento'
import style from './ImportCard.module.scss'
import Highlight from '@/components/Highlight/Highlight'
import { AnimatePresence, motion } from 'framer-motion'
import React, { ChangeEvent, DragEvent, useMemo, useState } from 'react'
import { useNotification } from '@/app/(app)/(contexts)/NotificationContext'
import { CTeData, parseXml } from '@/utils/parseXml'
import { useModal } from '@/app/(app)/(contexts)/ModalContext'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import useImportCardDrag from './useImportCardDrag'
import useImportCard, { Caret } from '@/hooks/useImportCard'
import { useChave } from '@/app/(app)/calcular/context/CalcularContext'
import { UseChaveContext } from '@/hooks/useChaveContext'
import LogoSvg from '@/components/SvgArray/LogoSvg'
import { dbConnect } from '@/utils/db/supabase'
import DocumentoDetalhes from '../DocumentoDetalhes/DocumentoDetalhes'

export default function ImportCard() {

    const {
        chave: { context: {fornecedorContext: { setFornecedorData }}, documentosContext: context, gerarFatoresFornecedor }
    } = useChave()

    const {
        chave,
        valid: chaveValid,
        loading, 
        documentos, 
        importarDocumento
    } = context

    const {
        // documentos,
        dragHover,
        setDragHover,
        handleChange,
        handleDrop,
    } = useImportCardDrag(context)

    const { setModal } = useModal()

    const valid = useMemo(() => {
        const documentosValid = (
            documentos.cte?.chave !== chave && documentos.nfe?.chave !== chave)
        return (chaveValid && documentosValid)
    }, [documentos, chaveValid, chave])

    const handleDocumentoClick = (documento: DocumentoImportado) => {

        if (documento === null) return

        setModal(
            <DocumentoDetalhes documento={documento}/>
        )

    }

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
                <p><Highlight>arraste</Highlight> ou <Highlight>selecione</Highlight> arquivo</p>
                <h5>XML</h5>
            </motion.label>
    
            <form 
                className={style.chave}
                onSubmit={async (e) => {
                    e.preventDefault()
                    const data = await importarDocumento(chave)
                    console.log('data_import_card', data);
                    if(data !== undefined) {
                        // URGENTE - Gera fatores aqui e depois quando gera a tabela, definir onde será feito esse processo!
                        const fatores = await gerarFatoresFornecedor(data.pedido.cnpj)
                        console.log(fatores);
                        if(!fatores) return
                        setFornecedorData({
                            ...fatores,
                            cnpj: data.pedido.cnpj
                        })
                    }
                }}
            >
                <span 
                    className={style.title}
                >
                    <p>digite a <Highlight>chave</Highlight> do documento para importar</p>
                </span>
                <Chave context={context} />
                {/* <button 
                    className={style.importButton}
                    disabled={!valid}
                    onClick={() => importarDocumento(chave)}
                >Importar</button> */}
                <button 
                    className={style.importButton}
                    disabled={!valid || loading}
                    type='submit'
                >
                    {loading
                        ? <><LogoSvg loop />  Importando...</> 
                        : `Importar`
                    }
                </button>
            </form>

            <ul 
                className={style.documentos}
            >
                {/* <AnimatePresence> */}
                {Object.entries(documentos).filter(([tipo, _]) => tipo !== 'pedido').map( ([tipo, documento], index) => 
                    <motion.div 
                        className={`${style.documento} ${documento === null&& style.empty}`}
                        key={index}
                        onClick={ () => handleDocumentoClick(documento) }

                        // initial={false}
                        // // initial={{ opacity: 0 }}
                        // animate={{ opacity: 1 }}
                        // exit={{ opacity: 0 }}
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
        
                {/* </AnimatePresence> */}
            </ul>
        </motion.div>
    )

}

const Chave = ({ context }: { context: UseDocumento }) => {

    const {dragHover} = useImportCardDrag(context)

    const { chave } = context

    const {
        inputRef,
        handleKeyDown,

        splitChave,
        selectionActive,
        
        caret,
        handleInputChange,
        handleCaretEvent,
        handleDigitClick,
        resetCaret,
    } = useImportCard(context)

    // const segmentsDisplay = useMemo(() => 
    //     splitChave?.map( (segment, indexSegment) => 
    //         <span className={style.segment} key={indexSegment}>
    //         {segment.split('').map( (digit, indexDigit) => {

    //             const digitIndex = (indexSegment * 4) + indexDigit

    //             return (
    //                 <div 
    //                 key={indexDigit}
    //                 className={`${style.digit}`}
    //                 data-active={
    //                     selectionActive 
    //                         ? (digitIndex >= caret.start && digitIndex < caret.end)
    //                         : (digitIndex === caret.end)
    //                 }
    //                 data-caret={selectionActive ? false : (digitIndex + 1) === caret.end}
    //                 onClick={() => handleDigitClick(digitIndex)}
    //             >{digit}</div>
    //             )
    //         })}
    //         </span>
    // ), [caret, selectionActive])

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
                onKeyDown={(e) => handleKeyDown(e)}
                onBlur={() => resetCaret()}

                ref={inputRef}
            />
            <span className={style.segments}>
                {/* {splitChave?.map( (segment, indexSegment) => 
                    <ChaveSegment
                        key={indexSegment} 
                        segment={segment} 
                        indexSegment={indexSegment} 
                        selectionActive={selectionActive} 
                        caret={caret} 
                        handleDigitClick={handleDigitClick}                     />
                )} */}
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
                {/* {segmentsDisplay} */}
            </span>
        </div>
    )

}

// interface ChaveSegmentProps {
//     segment: string
//     indexSegment: number
//     selectionActive: boolean
//     caret: Caret
//     handleDigitClick: (index: number) => void
// }

// const ChaveSegment = React.memo(function ChaveSegment({ segment, indexSegment, selectionActive, caret, handleDigitClick }: ChaveSegmentProps) {

//     const segmentDisplay = useMemo(() => segment.split(''), [segment])

//     return (
//         <span className={style.segment}>
//             {segmentDisplay.map((digit, indexDigit) =>
//                 <ChaveDigit 
//                     key={indexDigit}
//                     segment={segment}
//                     indexSegment={indexSegment}
//                     digit={digit}
//                     indexDigit={indexDigit} 
//                     selectionActive={selectionActive}
//                     caret={caret} 
//                     handleDigitClick={handleDigitClick}
//                     />
//             )}
//         </span>
//     )

// })

// interface ChaveDigitProps extends ChaveSegmentProps {
//     digit: string
//     indexDigit: number
// }

// const ChaveDigit = React.memo(function ChaveDigit({caret, digit, indexDigit, indexSegment, selectionActive, handleDigitClick}: ChaveDigitProps) {

//     const digitIndex = useMemo(() => (indexSegment * 4) + indexDigit, [indexDigit, indexSegment])

//     return (
//         <div 
//             key={indexDigit}
//             className={`${style.digit}`}
//             data-active={
//                 selectionActive 
//                     ? (digitIndex >= caret.start && digitIndex < caret.end)
//                     : (digitIndex === caret.end)
//             }
//             data-caret={selectionActive ? false : (digitIndex + 1) === caret.end}
//             onClick={() => handleDigitClick(digitIndex)}
//         >{digit}</div>
//     )

// })