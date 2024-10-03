import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react'
import style from './ImportCard.module.scss'
import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import Highlight from '@/components/Highlight/Highlight'
import LogoSvg from '@/components/SvgArray/LogoSvg'
import { DocumentoData } from '@/hooks/useDocumento'

interface ImportCardProps {

    documento: DocumentoData

}

interface Caret {
    start: number,
    end: number,
    direction: 'none' | 'foward' | 'backward'
}

//No caret shown
const CARET_INITIAL_STATE: Caret = {
    start: -1,
    end: -1,
    direction: 'none'
}

export default function ImportCard( { documento }: ImportCardProps ){

    const {
        documento: documentoNome,
        chave,
        setChave,
        loading,
        importarDocumento,
        importado
        
    } = documento

    const chaveFixedLength = useMemo(() => {
        let newString = chave
        while (newString.length < 44) {
            newString += '_'
        }
        return newString
    }, [chave])

    const valid = useMemo(() => {
        return chave.length === 44
    }, [chave])

    const splitChave = useMemo(() => {
        return chaveFixedLength.match(/.{1,4}/g)
    }, [chaveFixedLength])

    const [caret, setCaret] = useState(CARET_INITIAL_STATE)

    const inputRef = useRef<HTMLInputElement>(null)

    const handleCaretEvent = () => {

        if (inputRef.current) {

            const start = inputRef.current?.selectionStart!
            const end = inputRef.current?.selectionEnd!
            const direction = (inputRef.current?.selectionDirection! as 'none' | 'foward' | 'backward')

            setCaret({ start, end, direction })

        }
    }

    const resetCaret = () => {
        setCaret(CARET_INITIAL_STATE)
    }

    const handleInputChange = (e: 
        ChangeEvent<HTMLInputElement> ) => {

        if (/^[0-9]*$/.test(e.target.value)) {
            setChave(e.target.value)
            handleCaretEvent()
        }

    }

    const handleDigitClick = (index: number) => {

        if (inputRef.current) {

            if (index <= chave.length) {
                    
                inputRef.current.focus()
                inputRef.current.setSelectionRange((index + 1), (index + 1))
    
                setCaret({
                    start: index + 1,
                    end: index + 1,
                    direction: 'foward',
                })
    
                return
            }
    
            inputRef.current.focus()
            inputRef.current.setSelectionRange(chave.length + 1, chave.length + 1)

            setCaret({
                start: chave.length,
                end: chave.length,
                direction: 'foward',
            })
        }

        
    }

    const selection = useMemo(() => caret.end !== caret.start, [caret])

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        importarDocumento(chave)

    }

    return (
        <form 
            className={style.importCard}
            onSubmit={(e) => handleSubmit(e)}
        >

            <span className={style.badge}>
                {svgsUtil.unitarioNota}
                <p>Importar valores da <Highlight>{documentoNome}</Highlight> através da chave de acesso:</p>
                {/* <button onClick={() => handleClick()}>Importar {document}</button> */}
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
                        // disabled={valid}
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
                                            selection 
                                                ? (digitIndex >= caret.start && digitIndex < caret.end )
                                                : (digitIndex === caret.end)
                                        }
                                        data-caret={selection ? false : (digitIndex + 1) === caret.end}
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
                disabled={!valid}
                type='submit'
            >
                {loading
                    ? <><LogoSvg loop />  Importando...</> 
                    : `Importar ${documentoNome}`
                }
            </button>

            {importado&&
            <span className={style.importado}>
                {svgsUtil.unitarioNota}
                <div>
                    <h3>{importado.fornecedor}</h3>
                    <p>{importado.numero}</p>
                    <p>{importado.data.toLocaleString()}</p>
                    <p>{importado.chave}</p>
                </div>
            </span>
            }

        </form>
    )

}