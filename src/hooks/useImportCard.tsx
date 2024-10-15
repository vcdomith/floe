import { ChangeEvent, Dispatch, FormEvent, RefObject, SetStateAction, useMemo, useRef, useState } from "react"
import useDocumento, { DocumentoData, UseDocumento } from "./useDocumento"
import chaveFormatSplit from "@/utils/chaveFormat"
import { useChave } from "@/app/(app)/calcular/context/CalcularContext"

export interface UseImportCard {

    chaveFixedLength: string
    valid: boolean
    splitChave: RegExpMatchArray | null | undefined

    inputRef: RefObject<HTMLInputElement>

    caret: Caret
    handleCaretEvent: () => void
    resetCaret: () => void
    handleInputChange: (e: ChangeEvent<HTMLInputElement> ) => void
    handleDigitClick: (index: number) => void
    selectionActive: boolean

    handleSubmit: (e: FormEvent<HTMLFormElement>) => void

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

export default function useImportCard(context: UseDocumento): UseImportCard {

    // const {
    //     chave,
    //     setChave,
    //     importarDocumento,
    //     importado
    // } = documento

    const {
        chave,
        setChave,
        importarDocumento
    } = context

    const chaveFixedLength = useMemo(() => {
        let newString = chave
        while (newString.length < 44) {
            newString += '_'
        }
        return newString
    }, [chave])

    const valid = useMemo(() => {
        return (
            chave.length === 44 
            // &&
            // chave !== importado?.chave
        )
    }, [chave])

    const splitChave = useMemo(() => {
        return chaveFormatSplit(chaveFixedLength)
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

    return {
        chaveFixedLength,
        valid,
        splitChave,

        inputRef,

        caret,
        handleCaretEvent,
        resetCaret,
        handleInputChange,
        handleDigitClick,
        selectionActive: selection,

        handleSubmit,
    }

}