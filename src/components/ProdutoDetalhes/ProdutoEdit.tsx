import { CalcularProvider, FatoresContext, ProdutoCadastro, useCalcular } from "@/app/(app)/calcular/context/CalcularContext"
import { IProdutoContext } from "@/hooks/useProduto"
import { svgsUtil } from "../SvgArray/SvgUtil"
import Config from "@/app/(app)/configurar/(Config)/Config"
import CheckBox from "@/app/(app)/configurar/(CheckBox)/CheckBox"
import useEditProduto from "@/hooks/useEditProduto"
import NumberInput from "../FatoresTable/FatoresTableBody/NumberInput/NumberInput"
import { Dispatch, KeyboardEvent, MouseEvent, SetStateAction, useEffect, useMemo, useRef, useState } from "react"
import Converter from "@/utils/typeConversion"

import style from './ProdutoDetalhes.module.scss'
import styleProduto from '../../app/(app)/calcular/Tabs/ProdutoTab/ProdutoTab.module.scss'
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { UseFornecedor } from "@/hooks/useFornecedor"
import { useNotification } from "@/app/(app)/(contexts)/NotificationContext"
import { getTabelasObject } from "@/utils/calculoTabelas"
import { useModal } from "@/app/(app)/(contexts)/ModalContext"
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog"
import { useMediaQuery } from "@/app/(app)/(contexts)/MediaQueryContext"

const NUMBER_INPUT_PLACEHOLDER = '_'.repeat(50)
const PRESERVE_ST_STATE = false

const fatoresConfigTextos: Record< 
    keyof FatoresContext, 
    { titulo: string, descricao: string } 
> = {
    base: {
        titulo: "Fator Base",
        descricao: "Fator que todos produtos do fornecedor usam"
    },
    fatorBaseNormal: {
        titulo: "Fator Base Normal",
        descricao: "Fator que os produtos sem ST usam"
    },
    fatorBaseST: {
        titulo: "Fator Base ST",
        descricao: "Fator que os produtos com ST usam"
    },
    transporte: {
        titulo: "Transporte",
        descricao: "Alíquota acrescentada devido ao frete"
    },
    st: {
        titulo: "ST",
        descricao: "Alíquota acrescentada devido a ST ICMS"
    },
    ipi: {
        titulo: "IPI",
        descricao: "Alíquota IPI aplicado ao produto"
    },
    desconto: {
        titulo: "Desconto",
        descricao: "Desconto aplicado ao produto"
    }
}

const disabledFields: (keyof FatoresContext)[] = [
    'base',
    'fatorBaseNormal',
    'fatorBaseST',
    'transporte',
    'st'
]

export const ProdutoEdit = ({ produto, editable = true }: 
    { 
        produto: ProdutoCadastro,
        editable?: boolean,
    }
) => {

    const {
        produtoEdit,
        controlledInputs, 
        handleProdutoChange,
        resetForm: resetProduto, 
        displayControl, 
        valid,
        updateTabela,
        removeProduto
    } = useEditProduto(produto)

    const {
        fatores
    } = produtoEdit

    const {
        codigo,
        ncm,
        st,
        unitarioPedido, 
        unitarioNota,
        unitarioComposto,
        composto1,
        composto2,
        ipi,
        desconto
    } = controlledInputs

    console.log(produto);

    const { addNotification } = useNotification()
    const { setModal, clearModal } = useModal()
    const { matches: isMobile } = useMediaQuery()

    const tabelas: [string, number][] = useMemo(() => 
        Object.entries(getTabelasObject(editable ? produtoEdit : produto))
    , [produtoEdit, produto])

    const [tabDisplayControl, setTabDisplayControl] = useState({
        atributos: false,
        fatores: false,
    })

    const {floatToString, stringToFloat} = Converter

    const compostoRef_1 = useRef<HTMLInputElement>(null)
    const compostoRef_2 = useRef<HTMLInputElement>(null)

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, field: keyof IProdutoContext) => {

        if(e.key === 'Enter') {
            
            const calculoUnitario: string = floatToString(stringToFloat(composto1) + stringToFloat(composto2))

            if (calculoUnitario === 'NaN' && field === 'unitarioComposto') {

                e.preventDefault()

                if (composto1 === '') {

                    compostoRef_1.current?.focus()
                    return

                } 

                if (composto2 === '') {

                    compostoRef_2.current?.focus()
                    return

                }

            }

            const valorCalculado = floatToString(
                stringToFloat(composto1) + 
                stringToFloat(composto2)
                , 2)

            handleProdutoChange('unitarioComposto')(valorCalculado)
            if (valorCalculado === 'NaN') e.preventDefault()
        } 

    }

    const handleTabClick = (e: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>, tab: keyof typeof tabDisplayControl) => {

        e.stopPropagation()
        setTabDisplayControl((prev) => ({
            ...prev,
            [tab]: !prev[tab]
        }))

    }

    const handleDelete = (id: string) => {

        // removeProduto(id)
        // addNotification({
        //     tipo: 'sucesso',
        //     mensagem: `Produto ${produto.codigo} excluído com sucesso!`
        // })
        // clearModal()

        setModal(
            <ConfirmationDialog 
                title={`Confirme a exclusão do produto ${produto.codigo}:`}
                message='Aviso: o produto será excluído permanentemente!' 
                cancelHandler={clearModal} 
                confirmHandler={() => {
                    addNotification({
                        tipo: 'sucesso',
                        mensagem: `Produto ${produto.codigo} excluído com sucesso!`,
                    })
                    removeProduto(id)
                }}                
            />
        )

    }

    useEffect(() => {

        const handleEscapeCancel = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Escape') {
                clearModal()
                return
            }
        }

        window.addEventListener('keydown', handleEscapeCancel)

        return () => {
            window.removeEventListener('keydown', handleEscapeCancel)
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={style.card}>

            <section className={style.header}>
                <span className={style.badge}>
                    {svgsUtil.produto3D}
                    <h3>Produto</h3>
                </span>
                <h3>{produto.codigo}</h3>
            </section>

            <section className={style.valores}>
                <span className={style.wrapper}>
                    {tabelas.map(([key, value]) => 
                        <div key={key} className={style.valor}>
                            <label>{key}</label>
                            <h3>{(value) ? value.toFixed(2) : '••••••'}</h3>
                        </div>
                    )}
                </span>
            </section>

            <section className={style.content}>

                <button className={style.tag} onClick={(e) => handleTabClick(e, 'atributos')}>
                    <h5>Atributos</h5>
                    <ExpandButton 
                        display={tabDisplayControl.atributos} 
                    />
                </button>

                <AnimatePresence>
                {tabDisplayControl.atributos&&
                <motion.div 
                    className={style.fatores}

                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
                >
                    <LayoutGroup>
                    <Config 
                        svg={svgsUtil.st} 
                        title={'ST:'} 
                        description={'Produto usa Subs. Trib.'}
                        input={
                            <CheckBox 
                                checked={st}
                                setChecked={handleProdutoChange('st')}
                                // disabled
                            />
                        }
                    />
                    <Config
                        svg={svgsUtil['codigo']} 
                        title={'Código'} 
                        description={'Código do Produto'}
                        input={
                            <input
                                className={style.codigo}
                                type="text" 
                                placeholder="_____________"
                                value={codigo}
                                onChange={(e) => handleProdutoChange('codigo')(e.target.value.toUpperCase())}
                                required
                                data-valid={codigo}
                            />
                        }
                    />
                    {displayControl.ncm&&
                    <Config
                        svg={svgsUtil['ncm']} 
                        title={'NCM'} 
                        description={'Código NCM (8 dígitos)'}
                        input={
                            <NumberInput 
                                placeholder={""} 
                                valor={ncm} 
                                setValor={handleProdutoChange('ncm')}
                                minLength={8}
                                maxLength={8}
                                className={style.codigo}
                            />
                        }
                    />
                    }
                    <Config
                        svg={svgsUtil['unitarioNota']} 
                        title={'Unit. Nota'} 
                        description={'Valor para calcular preços:'}
                        input={
                            // <input
                            //     className={style.codigo}
                            //     type="text" 
                            //     placeholder="_____________"
                            //     value={unitarioNota}
                            //     required
                            // />
                            <NumberInput 
                                placeholder={'______'} 
                                valor={unitarioNota} 
                                setValor={handleProdutoChange('unitarioNota')}  
                                required
                            />
                        }
                    />
                    {displayControl.unitarioPedido&&
                    <Config 
                        svg={svgsUtil.unitario} 
                        title={'Unitário (Pedido)'} 
                        description={'Valor para calcular preços:'}
                        input={
                            <NumberInput 
                                placeholder={'______'} 
                                valor={unitarioPedido} 
                                setValor={handleProdutoChange('unitarioPedido')}  
                                required
                            />
                        }
                    />
                    }
                    {displayControl.unitarioComposto&&
                    <div className={`${style.configWrapper} ${styleProduto.configWrapper} ${styleProduto.compostoWrapper}`}>
                        <Config 
                            svg={svgsUtil.composto} 
                            title={'Unitário (Composto)'} 
                            description={'Unitário calculado pela soma de dois valores:'}
                            input={
                                <NumberInput 
                                    placeholder={'______'} 
                                    valor={unitarioComposto} 
                                    setValor={handleProdutoChange('unitarioComposto')}
                                    disabled
                                    data-valid={(unitarioComposto) ? true : false}
                                    required
                                />
                            }
                        />
                        {/* Adicionar variante que depende se o produto tem ou não ST
                            -> Sem st (novo TODO): valor x 2
                            -> Com st (existente): valor1 + valor2 
                        */}
                        <div 
                            className={`${style.extra} ${styleProduto.composto}`} 
                            onKeyDown={(e) => handleKeyDown(e, 'unitarioComposto')}
                        >
                            <span> 
                                <div>
                                    <label htmlFor="">Composto 1</label>
                                    <NumberInput 
                                        placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                        valor={composto1} 
                                        setValor={handleProdutoChange('composto1')} 
                                        required
                                        refProp={compostoRef_1}
                                    />
                                </div>        
                                <p>+</p>
                                <div>
                                    <label htmlFor="">Composto 2</label>
                                    <NumberInput 
                                        placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                        valor={composto2} 
                                        setValor={handleProdutoChange('composto2')} 
                                        required
                                        refProp={compostoRef_2}
                                    />
                                </div>
                            </span>
                            <button type='submit' hidden></button>                        
                        </div>
                    </div>
                    }
                </LayoutGroup>
                </motion.div>
                }
                </AnimatePresence>

                <button className={style.tag} onClick={(e) => handleTabClick(e, 'fatores')}>
                    <h5>Fatores</h5>
                    <ExpandButton 
                        display={tabDisplayControl.fatores} 
                    />
                </button>
                <AnimatePresence>
                {tabDisplayControl.fatores&&
                <motion.div 
                    className={style.fatores}

                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
                >
                    <LayoutGroup>
                    <Config
                        svg={svgsUtil.base} 
                        title={fatoresConfigTextos.base.titulo} 
                        description={fatoresConfigTextos.base.descricao}
                        input={
                            <input
                                type="text" 
                                placeholder="_____________"
                                value={fatores.base}
                                // onChange={handleFatorChange('base')}
                                required
                                disabled
                            />
                        }
                    />
                    {(st)
                    ?
                    <Config
                        svg={svgsUtil.fatorBaseST} 
                        title={fatoresConfigTextos.fatorBaseST.titulo} 
                        description={fatoresConfigTextos.fatorBaseST.descricao}
                        input={
                            <input
                                type="text" 
                                placeholder="_____________"
                                value={fatores.fatorBaseST}
                                // onChange={handleFatorChange('fatorBaseST')}
                                required
                                disabled
                            />
                        }
                    />
                    :
                    <Config
                        svg={svgsUtil.base} 
                        title={fatoresConfigTextos.fatorBaseNormal.titulo} 
                        description={fatoresConfigTextos.fatorBaseNormal.descricao}
                        input={
                            <input
                                type="text" 
                                placeholder="_____________"
                                value={fatores.fatorBaseNormal}
                                // onChange={handleFatorChange('fatorBaseNormal')}
                                required
                                disabled
                            />
                        }
                    />
                    }
                    {displayControl.fatorTransportePedido&&
                    <Config
                        svg={svgsUtil.transporte} 
                        title={fatoresConfigTextos.transporte.titulo} 
                        description={fatoresConfigTextos.transporte.descricao}
                        input={
                            <input
                                type="text" 
                                placeholder="_____________"
                                value={fatores.transporte}
                                // onChange={handleFatorChange('transporte')}
                                required
                                disabled
                            />
                        }
                    />
                    }
                    {displayControl.fatorSTPedido&&
                    <Config
                        svg={svgsUtil.st} 
                        title={fatoresConfigTextos.st.titulo} 
                        description={fatoresConfigTextos.st.descricao}
                        input={
                            <input
                                type="text" 
                                placeholder="_____________"
                                value={fatores.st}
                                // onChange={handleFatorChange('st')}
                                required
                                disabled
                            />
                        }
                    />
                    }
                    {displayControl.ipi&&
                    <Config
                        svg={svgsUtil.ipi} 
                        title={fatoresConfigTextos.ipi.titulo} 
                        description={fatoresConfigTextos.ipi.descricao}
                        input={
                            // <input
                            //     className={style.codigo}
                            //     type="text" 
                            //     placeholder="_____________"
                            //     value={ipi}
                            //     onChange={handleProdutoChange('ipi')}
                            //     required
                            // />
                            <NumberInput 
                                placeholder={'______'} 
                                valor={ipi} 
                                setValor={handleProdutoChange('ipi')}
                                required                  
                            />
                        }
                    />
                    }
                    {displayControl.desconto&&
                    <Config
                        svg={svgsUtil.desconto} 
                        title={fatoresConfigTextos.desconto.titulo} 
                        description={fatoresConfigTextos.desconto.descricao}
                        input={
                            // <input
                            //     className={style.codigo}
                            //     type="text" 
                            //     placeholder="_____________"
                            //     value={desconto}
                            //     onChange={handleProdutoChange('desconto')}
                            //     required
                            // />
                            <NumberInput 
                                placeholder={'______'} 
                                valor={desconto} 
                                setValor={handleProdutoChange('desconto')}
                                required                  
                            />
                        }
                    />
                    }
                </LayoutGroup>
                </motion.div>
                }
                </AnimatePresence>

            </section>

            <span className={style.buttons}>

                <button 
                    className={style.delete}
                    onClick={() => handleDelete(produto.id)}
                >
                    <SvgExcluir/>
                    {!isMobile&&
                    <p>Excluir</p>
                    }
                </button>

                <button 
                    className={style.discard}
                    onClick={() => resetProduto(PRESERVE_ST_STATE)}
                >
                    Descartar
                </button>

                <button 
                    className={style.update}
                    disabled={!valid}
                    onClick={() => {
                        addNotification({
                            tipo: 'sucesso',
                            mensagem: `Produto ${codigo} atualizado com sucesso!`,
                        })
                        updateTabela(produto.id, produtoEdit)
                    }}
                >
                    Atualizar
                </button>

            </span>

        </div>
    )
}

export default ProdutoEdit

const ExpandButton = (
    { display }: 
    { display: boolean }
) => {

    return(
        <div 
            // className={`${style.button} ${style.expand}`} 
            // onClick={() => setDisplay(prev => !prev)} 
        >
            <svg width="20" height="20" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                    d={`${display
                        ? "M376 314L250 188L124 314" 
                        : "M376 187L250 313L124 187"
                    }`}  
                    strokeWidth="50"/>
            </svg>             
        </div>
    )

}

const SvgExcluir = () => {
    return(
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M130 193L130 400L370 400L370 193" stroke="black" strokeWidth="40"/>
        <path d="M71 139L430 139" stroke="black" strokeWidth="40"/>
        <path d="M174 99L326 99" stroke="black" strokeWidth="40"/>
        <path d="M207 193L207 350" stroke="black" strokeWidth="40"/>
        <path d="M291 193L291 350" stroke="black" strokeWidth="40"/>
        </svg>
 
    )
}