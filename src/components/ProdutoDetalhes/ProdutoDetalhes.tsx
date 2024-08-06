import { CalcularProvider, FatoresContext, ProdutoCadastro, useCalcular } from "@/app/(app)/calcular/context/CalcularContext"
import { IProdutoContext } from "@/hooks/useProduto"
import { svgsUtil } from "../SvgArray/SvgUtil"
import Config from "@/app/(app)/configurar/(Config)/Config"
import CheckBox from "@/app/(app)/configurar/(CheckBox)/CheckBox"
import useEditProduto from "@/hooks/useEditProduto"
import NumberInput from "../FatoresTable/FatoresTableBody/NumberInput/NumberInput"
import { Dispatch, KeyboardEvent, SetStateAction, useMemo, useRef, useState } from "react"
import Converter from "@/utils/typeConversion"

import style from './ProdutoDetalhes.module.scss'
import styleProduto from '../../app/(app)/calcular/Tabs/ProdutoTab/ProdutoTab.module.scss'
import { AnimatePresence, motion } from "framer-motion"
import { useFornecedorReturn } from "@/hooks/useFornecedor"
import { useNotification } from "@/app/(app)/(contexts)/NotificationContext"
import { getTabelasObject } from "@/utils/calculoTabelas"

const NUMBER_INPUT_PLACEHOLDER = '_'.repeat(50)

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

export const ProdutoDetalhes = ({ produto }: 
    { 
        produto: ProdutoCadastro,
    }
) => {

    const {produtoEdit, 
    handleProdutoChange, 
    handleCompostoChange, 
    handleFatorChange, 
    resetProduto, 
    displayControl, 
    valid} = useEditProduto(produto)

    const {
        id,
        codigo,
        ncm,
        st,
        unitario, 
        unitarioNota,
        composto,
        fatores
    } = produtoEdit

    const tabelas = useMemo(() => Object.entries(getTabelasObject(produtoEdit)), [produtoEdit])

    const [displayAtributos, setDisplayAtributos] = useState(true)
    const [displayFatores, setDisplayFatores] = useState(false)

    const {floatToString, stringToFloat} = Converter

    const compostoRef_1 = useRef<HTMLInputElement>(null)
    const compostoRef_2 = useRef<HTMLInputElement>(null)

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, field: keyof IProdutoContext) => {

        if(e.key === 'Enter') {
            
            const calculoUnitario: string = floatToString(stringToFloat(composto[0]) + stringToFloat(composto[1]))

            if (calculoUnitario === 'NaN' && field === 'unitarioComposto') {

                e.preventDefault()

                if (composto[0] === '') {

                    compostoRef_1.current?.focus()
                    return

                } 

                if (composto[1] === '') {

                    compostoRef_2.current?.focus()
                    return

                }

            }

            const valorCalculado = floatToString(
                stringToFloat(composto[0]) + 
                stringToFloat(composto[1])
                , 2)

            // setProdutoData(prev => ({...prev, [field]: valorCalculado}))
            handleProdutoChange('unitario')(valorCalculado)
            if (valorCalculado === 'NaN') e.preventDefault()
        } 

    }

    return (
        <div className={style.card}>

            <section className={style.header}>
                {svgsUtil.produto3D}
                <h3>Produto</h3>
                <h3>{produto.codigo}</h3>
            </section>

            <section className={style.valores}>
                <span className={style.wrapper}>
                    {tabelas.map(([key, value]) => 
                        <div key={key} className={style.valor}>
                            <label>{key}</label>
                            <h3>{value}</h3>
                        </div>
                    )}
                </span>
            </section>

            <section className={style.content}>

                <span className={style.tag} onClick={() => setDisplayAtributos(prev => !prev)}>
                    <h5>Atributos</h5>
                    <ExpandButton 
                        display={displayAtributos} 
                        setDisplay={setDisplayAtributos}                        
                    />
                </span>

                <AnimatePresence>
                {displayAtributos&&
                <motion.div 
                    className={style.fatores}

                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
                >
                    <Config 
                        svg={svgsUtil.st} 
                        title={'ST:'} 
                        description={''}
                        input={
                            <CheckBox 
                                checked={st}
                                setChecked={handleProdutoChange('st')}
                                disabled
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
                            />
                        }
                    />
                    }
                    <Config
                        svg={svgsUtil['unitarioNota']} 
                        title={'Unit. Nota'} 
                        description={''}
                        input={
                            <input
                                className={style.codigo}
                                type="text" 
                                placeholder="_____________"
                                value={unitarioNota}
                                required
                                disabled
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
                                valor={unitario} 
                                setValor={handleProdutoChange('unitario')}  
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
                            description={'Unitário calculado pelo soma de dois valores:'}
                            input={
                                <NumberInput 
                                    placeholder={'______'} 
                                    valor={unitario} 
                                    setValor={handleProdutoChange('unitario')}
                                    disabled
                                    data-valid={(unitario) ? true : false}
                                    required
                                />
                            }
                        />
                        {/* Adicionar variante que depende se o produto tem ou não ST
                            -> Sem st (novo TODO): valor x 2
                            -> Com st (existente): valor1 + valor2 
                        */}
                        <div className={`${style.extra} ${styleProduto.composto}`} 
                        // onSubmit={(e) => handleProdutoSubmit('composto', e, fatorBase)}
                        onKeyDown={(e) => handleKeyDown(e, 'unitarioComposto')}
                        >
                            <span> 
                                <div>
                                    <label htmlFor="">Composto 1</label>
                                    <NumberInput 
                                        placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                        valor={composto[0]} 
                                        setValor={handleCompostoChange(0)} 
                                        required
                                        refProp={compostoRef_1}
                                    />
                                </div>        
                                <p>+</p>
                                <div>
                                    <label htmlFor="">Composto 2</label>
                                    <NumberInput 
                                        placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                        valor={composto[1]} 
                                        setValor={handleCompostoChange(1)} 
                                        required
                                        refProp={compostoRef_2}
                                    />
                                </div>
                            </span>
                            <button type='submit' hidden></button>                        
                        </div>
                    </div>
                    }
                </motion.div>
                }
                </AnimatePresence>

                <span className={style.tag} onClick={() => setDisplayFatores(prev => !prev)}>
                    <h5>Fatores</h5>
                    <ExpandButton 
                        display={displayFatores} 
                        setDisplay={setDisplayFatores}                        
                    />
                </span>
                <AnimatePresence>
                {displayFatores&&
                <motion.div 
                    className={style.fatores}

                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
                >
                {/* TODO: Separar cada fator unitariamente, controlados pelo displayControl */}
                {(Object.entries(fatores) as [keyof FatoresContext, string][])
                    .filter( ([key, value]) => (value !== '1' || key === 'base'))
                    .map(([key, value]) => 
                        <Config
                            key={key} 
                            svg={svgsUtil[key]} 
                            title={fatoresConfigTextos[key].titulo} 
                            description={fatoresConfigTextos[key].descricao}
                            input={
                                <input
                                    className={style.codigo}
                                    type="text" 
                                    placeholder="_____________"
                                    value={fatores[key]}
                                    onChange={handleFatorChange(key)}
                                    required
                                    disabled={disabledFields.includes(key)}
                                />
                            }
                        />
                    )
                }
                </motion.div>
                }
                </AnimatePresence>

            </section>

            <span className={style.buttons}>
                <button 
                    className={style.discard}
                    onClick={() => resetProduto()}
                >
                    Descartar
                </button>
                <button 
                    className={style.update}
                    disabled={!valid}
                    onClick={() => alert('ataliza')}
                >
                    Atualizar
                </button>
            </span>

        </div>
    )
}

export default ProdutoDetalhes

const ExpandButton = (
    { display, setDisplay }: 
    { display: boolean, setDisplay: Dispatch<SetStateAction<boolean>> }
) => {

    return(
        <button 
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
        </button>
    )

}