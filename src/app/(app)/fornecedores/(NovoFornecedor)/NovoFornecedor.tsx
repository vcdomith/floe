import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import style from './NovoFornecedor.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
import Config from '../../configurar/(Config)/Config'
import CheckBox from '../../configurar/(CheckBox)/CheckBox'
import useFornecedor from '@/hooks/useFornecedor'
import NumberInput from '@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput'
import React, { ChangeEvent, FormEvent, KeyboardEvent, useMemo, useRef, useState } from 'react'
import { cnpjFormatSplit, formatSplit } from '@/utils/documentosFormat'
import { IFornecedor } from '@/interfaces/IFornecedor'
import { Caret } from '@/hooks/useImportCard'
import { useNotification } from '../../(contexts)/NotificationContext'
import { useModal } from '../../(contexts)/ModalContext'
import ConfirmationDialog from '@/components/ConfirmationDialog/ConfirmationDialog'
import LogoSvg from '@/components/SvgArray/LogoSvg'
import Highlight from '@/components/Highlight/Highlight'
import { PostgrestError } from '@supabase/supabase-js'
import capitalize from '@/utils/capitalize'

// const formatCNPJ = (value: string) => {
//     // Remove non-numeric characters
//     value = value.replace(/\D/g, '');
    
//     // Apply the CNPJ mask: 00.000.000/0000-00
//     return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
// };

const CNPJ_SEGMENT_FORMAT = [2,3,3,4,2]

export default function NovoFornecedor() {

    const {fornecedorData, setFornecedorData, handleFornecedorChange, resetFornecedor} = useFornecedor()
    const {
        nome,
        nomeFantasia,
        cnpj,
        fatorBase,
        fatorBaseNormal,
        fatorBaseST,
        usaTransporte,
        usaSt,
        usaDesconto,
        usaIpi,
        usaIpiProporcional,
        usaUnitarioPedido,
        usaComposto
    } = fornecedorData

    const { addNotification } = useNotification()
    const { modal, setModal, clearModal } = useModal()

    const [loading, setLoading] = useState(false)

    const cadastrarFornecedor = async () => {

        try {

            setLoading(true)

            const novoCadastro: IFornecedor = {
                ...fornecedorData,
                nome: nome.replaceAll(' ', '_').toLowerCase()
            }

            const response: Response = await fetch('/fornecedores/api/cadastrarFornecedor', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    fornecedor: novoCadastro,
                })
            })
            
            const json = await response.json()

            if (!response.ok) {
    
                addNotification({
                    tipo: 'erro',
                    mensagem: json
                })
                setLoading(false)
                return
            }

            addNotification({
                tipo: 'sucesso',
                mensagem: 'Cadastro realizado com sucesso!'
            })

            setLoading(false)
            clearModal()

        } catch (error) {

            console.log(error);
            setLoading(false)
            addNotification({
                tipo: 'erro',
                mensagem: JSON.stringify(error)
            })

        }

        setLoading(false)

    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        // if (modal.length > 1) return

        setModal(
            <ConfirmationDialog 
                title={<>Confirme se deseja salvar o fornecedor {nome}</>}
                message='Atenção: O fornecedor será salvo permanentemente!'
                cancelHandler={clearModal}
                confirmHandler={async () => cadastrarFornecedor()}
            />
        )
        

    }

    const fixedLengthCnpj = useMemo(() => cnpj!.padEnd(14, '_'), [cnpj])
    const cnpjSplit = useMemo(() => formatSplit(fixedLengthCnpj, CNPJ_SEGMENT_FORMAT), [fixedLengthCnpj])

    // const handleCnpjChange = () => {

    //     return (value: string) => setFornecedorData(prev => ({
    //         ...prev,
    //         cnpj: formatCNPJ(value)
    //     }))

    //     // const inputValue = e.target.value
    //     // const format = formatCNPJ(inputValue)
        
    //     // handleFornecedorChange('cnpj')

    // }

    return (
        <form 
            className={style.novoFornecedor}
            onSubmit={(e) => handleSubmit(e)}    
        >

            <section className={style.header}>
                <span className={style.badge}>
                    {svgsUtil.produto3D}
                    {/* <h3>{documento.tipo.toUpperCase()}</h3> */}
                    <div className={style.title}>
                        <h3>Novo Fornecedor</h3>
                        <span className={style.subTitle}>
                            <p>Cadastrar novo fornecedor para calcular pedidos</p>
                            {/* <p className={style.numero}>{svgsUtil.numero}{documento.numero}</p> */}
                        </span>
                    </div>
                </span>
            </section>

            <section 
                className={style.content}
            >
            <AnimatePresence>

                <span className={style.tag} key={1}>
                    <h5>Dados</h5>
                </span>

                <motion.div 
                    className={`${style.fatores} ${style.dados}`}
                    key={2}

                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Config 
                        svg={svgsUtil.fornecedor} 
                        title={'Fornecedor'} 
                        description={`Nome simplificado do fornecedor a ser cadastrado (valor único)`} 
                        input={
                            <input 
                                type='text'
                                value={nome}
                                required
                                onChange={(e) => handleFornecedorChange('nome')(e.target.value)}
                            />
                        } 
                    />
                    <Config 
                        svg={svgsUtil.unitarioNota} 
                        title={'Nome Fantasia'} 
                        description={`Nome fantasia fornecedor (completo da nota)`} 
                        input={
                            <input 
                                type='text'
                                value={nomeFantasia}
                                required
                                onChange={(e) => handleFornecedorChange('nomeFantasia')(e.target.value)}
                            />
                        } 
                    />
                    <Config 
                        svg={svgsUtil.unitarioNota} 
                        title={'CNPJ'} 
                        description={`CNPJ fornecedor`} 
                        input={
                            <Cnpj 
                                cnpj={cnpj!} 
                                handleFornecedorChange={handleFornecedorChange} 
                                cnpjSplit={cnpjSplit!}
                                fixed={fixedLengthCnpj}
                            />
                        } 
                    />

                </motion.div>

                <span className={style.tag} key={3}>
                    <h5>Fatores</h5>
                </span>

                <motion.div 
                    className={style.fatores}
                    key={4}

                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Config 
                        svg={svgsUtil.fornecedor} 
                        title={'Fator Base'} 
                        description={`Fator Base que todos produtos do fornecedor usam`} 
                        input={
                            <NumberInput 
                                required
                                placeholder={'x 1,00'} 
                                valor={fatorBase} 
                                setValor={handleFornecedorChange('fatorBase')}
                            />
                        } 
                    />
                    <Config 
                        svg={svgsUtil.unitarioNota} 
                        title={'Fator Normal'} 
                        description={`Fator que os produtos sem ST usam`} 
                        input={
                            <NumberInput
                                required 
                                placeholder={'x 1,00'} 
                                valor={fatorBaseNormal} 
                                setValor={handleFornecedorChange('fatorBaseNormal')}
                            />
                        } 
                    />
                    <Config 
                        svg={svgsUtil.unitarioNota} 
                        title={'Fator ST'} 
                        description={`Fator que os produtos com ST usam`} 
                        input={
                            <NumberInput 
                                required
                                placeholder={'x 1,00'} 
                                valor={fatorBaseST} 
                                setValor={handleFornecedorChange('fatorBaseST')}
                            />
                        } 
                    />

                </motion.div>

                <span className={style.tag} key={5}>
                    <h5>Configurações</h5>
                </span>

                <motion.div 
                    className={style.fatores}
                    key={6}

                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Config 
                        svg={svgsUtil.transporte} 
                        title={'Transporte'} 
                        description={'Usa transporte no calculo?'} 
                        input={
                            <CheckBox
                                name='transporte'
                                checked={usaTransporte} 
                                setChecked={handleFornecedorChange('usaTransporte')} 
                            />
                        }                           
                    />
                    <Config 
                        svg={svgsUtil.st} 
                        title={'ST'} 
                        description={'Usa ST no calculo?'} 
                        input={
                            <CheckBox
                                name='st' 
                                checked={usaSt} 
                                setChecked={handleFornecedorChange('usaSt')} 
                            />
                        }                              
                    />
                    <Config 
                        svg={svgsUtil.desconto} 
                        title={'Desconto'} 
                        description={'Usa desconto no calculo?'} 
                        input={
                            <CheckBox
                                name="desconto" 
                                checked={usaDesconto} 
                                setChecked={handleFornecedorChange('usaDesconto')} 
                            />
                        }                               
                    />
                    <Config 
                        svg={svgsUtil.ipi} 
                        title={'IPI'} 
                        description={'Usa IPI no calculo?'} 
                        input={
                            <CheckBox 
                                name="ipi"
                                checked={usaIpi} 
                                setChecked={handleFornecedorChange('usaIpi')} 
                            />
                        }                             
                    />
                    <Config
                        subConfig 
                        svg={svgsUtil.ipi} 
                        title={'IPI Universal'} 
                        description={'Usa IPI em todos produtos?'} 
                        input={
                            <CheckBox 
                                name="ipiUniversal"
                                checked={usaIpiProporcional} 
                                setChecked={handleFornecedorChange('usaIpiProporcional')}
                                disabled={!usaIpi}
                            />
                        }                             
                    />
                    <Config 
                        svg={svgsUtil.unitarioNota} 
                        title={'Unitário Pedido'} 
                        description={'Usa unitário do pedido no calculo?'} 
                        input={
                            <CheckBox 
                                name="unitarioPedido"
                                checked={usaUnitarioPedido} 
                                setChecked={handleFornecedorChange('usaUnitarioPedido')} 
                            />
                        }                                
                    />
                    <Config
                        subConfig 
                        svg={svgsUtil.composto} 
                        title={'Composto'} 
                        description={'Usa unitário composto no pedido?'} 
                        input={
                            <CheckBox 
                                name="composto"
                                checked={usaComposto} 
                                setChecked={handleFornecedorChange('usaComposto')} 
                                disabled={!usaUnitarioPedido}
                            />
                        }                              
                    />
                </motion.div>

            </AnimatePresence>
            </section>

            <span className={style.buttons}>
                <button 
                    className={style.submit}
                    type='submit'
                >
                    {loading
                        ?  <><LogoSvg loop/>Carregando</>
                        : 'Cadastrar Fornecedor'
                    }
                </button>
            </span>
                        
        </form>
    )

}

const CARET_INITIAL_STATE: Caret = {
    start: -1,
    end: -1,
    direction: 'none'
}

function Cnpj({cnpj, handleFornecedorChange, fixed } :{ cnpj: string, handleFornecedorChange: <T>(field: keyof IFornecedor) => (valor: T) => void, cnpjSplit: string[], fixed: string}) {

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
            handleFornecedorChange('cnpj')(e.target.value)
            handleCaretEvent()
        }

    }

    const handleDigitClick = (index: number) => {

        if (inputRef.current) {

            if (index <= cnpj.length) {
                    
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
            inputRef.current.setSelectionRange(cnpj.length + 1, cnpj.length + 1)

            setCaret({
                start: cnpj.length,
                end: cnpj.length,
                direction: 'foward',
            })
        }

        
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {

        if (inputRef.current && e.ctrlKey && e.key === 'c') {
            inputRef.current?.select()
            inputRef.current?.setSelectionRange(caret.start, caret.end)
            navigator.clipboard.writeText(inputRef.current?.value)
        }

    }

    const selectionActive = useMemo(() => caret.end !== caret.start, [caret])
    const valid = useMemo(() => !fixed.includes('_'), [fixed])

    let formatCount = 1
    let formatIndex = 0
    let addFormat = false

    return (
        <div className={style.cnpj}>
            {/* <NumberInput 
                placeholder={'_____'} 
                required
                valor={cnpj!} 
                setValor={handleFornecedorChange('cnpj')}
                minLength={14}
                maxLength={14}
            /> */}
            <input 
                className={style.input}
                type="text" 
                required
                minLength={14} 
                maxLength={14}
                value={cnpj}
                onChange={(e) => handleInputChange(e)}
                onClick={() => handleCaretEvent()}
                onKeyUp={() => handleCaretEvent()}
                onKeyDown={(e) => handleKeyDown(e)}
                onBlur={() => resetCaret()}

                ref={inputRef}
            />
            <span 
                className={style.format}
                data-valid={valid}
            >
                {fixed.split('').map( (digit, index) => {

                    addFormat = false
                    if (formatCount === CNPJ_SEGMENT_FORMAT[formatIndex]) {
                        formatIndex++
                        formatCount = 0
                        addFormat = true
                    }
                    formatCount++

                    return (
                        <React.Fragment
                            key={index}
                        >
                        <span 
                            className={`${style.digit}`}
                            data-active={
                                selectionActive 
                                    ? (index >= caret.start && index < caret.end)
                                    : (index === caret.end)
                            }
                            data-caret={selectionActive ? false : (index + 1) === caret.end}
                            data-fill={digit === '_'}
                            onClick={() => handleDigitClick(index)}
                        >
                            {digit}
                        </span>
                        {(addFormat && index !== fixed.length - 1)&& 
                            <strong>
                                {index !== 7
                                ? '.'
                                : '/'
                                }
                            </strong>
                        }
                        </React.Fragment>
                    )

                })}
                {/* {cnpjSplit?.map( (segment, indexSegment) => {
                    let segmentLength = segment.length
                    console.log(indexSegment, segmentLength);
                    return <>
                        {segment.split('').map( (digit, indexDigit) => {

                            const digitIndex = (indexSegment * segmentLength) + indexDigit
                            // const digitIndex = (indexSegment * segmentLength) + indexDigit
                            
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
                        {(indexSegment !== 2)
                            ? (indexSegment !== cnpjSplit.length - 1) 
                                ?<strong>.</strong>
                                : null
                            :<strong>/</strong>
                        }
                    </> 
                    })} */}
            </span>
        </div>
    )

}