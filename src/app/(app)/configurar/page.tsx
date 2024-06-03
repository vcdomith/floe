'use client'
import { FormEvent, RefObject, SetStateAction, Suspense, useEffect, useMemo, useRef, useState } from "react"
import CheckBox from "./(CheckBox)/CheckBox"
import NumberInput from "@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput"
import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor"
import { IFornecedor } from "@/interfaces/IFornecedor"
import { dbConnect } from "@/utils/db/supabase"
import { useNotification } from "../(contexts)/NotificationContext"

import style from './configurar.module.scss'
import LogoSvg from "@/components/SvgArray/LogoSvg"
// import Loading from "./loading"
import Config from "./(Config)/Config"
import Loading from "../cadastros/loading"
import capitalize from "@/utils/capitalize"
import { motion, AnimatePresence } from "framer-motion"
import useFornecedor from "@/hooks/useFornecedor"
import { revalidatePath } from "next/cache"
// import { submitForm } from "./formAction"

import { revalidateTag as revalidate } from "next/cache";

export default function Configurar() {

    const supabase = useMemo(() => dbConnect(), [])

    const { notifications, addNotification } = useNotification()

    // State cadastro
    const [cadastroFornecedor, setCadastroFornecedor] = useState<IFornecedor>()
    
    // State Controle Inputs
    // const [nomeFornecedor, setNomeFornecedor] = useState('')
    // const [fatorBase, setFatorBase] = useState('')
    // const [fatorNormal, setFatorNormal] = useState('')
    // const [fatorSt, setFatorSt] = useState('')
    // const [transporte, setTransporte] = useState(true)
    // const [st, setSt] = useState(true)
    // const [desconto, setDesconto] = useState(false)
    // const [ipi, setIpi] = useState(false)
    // const [unitarioNota, setUnitarioNota] = useState(false)
    // const [composto, setComposto] = useState(false)
     
    const {fornecedorData, setFornecedorData, handleFornecedorChange, resetForm} = useFornecedor()

    const {
        nome,
        fatorBase,
        fatorNormal,
        fatorST,
        transporte,
        st,
        desconto,
        ipi,
        unitarioNota,
        composto
    } = fornecedorData

    const [fornecedoresDB, setFornecedoresDB] = useState<IFornecedor[]>()
    const [cadastrados, setCadastrados] = useState<string[]>([])

    const [focus, setFocus] = useState(false)

    const [valid, setValid] = useState(false)
    const [validation, setValidation] = useState(true)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        if(!validation) {
            addNotification({ tipo: 'erro', mensagem: `Não foi possível realizar o cadastro, fornecedor ${nome} já está cadastrado!`})
            return
        }

        const novoCadastro: IFornecedor = {...fornecedorData, nome: nome.trim().toLowerCase()}
        setCadastroFornecedor(novoCadastro)       

        try {
            
            let { data: fornecedor, error } = await supabase
                .from('fornecedores')
                .insert([{...novoCadastro}])

            if(error) {
                addNotification({ tipo: 'erro', mensagem: `${error.details}`})
                return
            }
            addNotification({ tipo: 'sucesso', mensagem: `Cadastro do fornecedor ${capitalize(novoCadastro.nome)} feito com sucesso!`})
            resetForm()
            // revalidateTag()
            

        } catch (error) {
            
            console.error(error)
            addNotification({ tipo: 'erro', mensagem: `${error}`})

        }
      

    }

    // const resetForm = () => {

    //     setNomeFornecedor('')
    //     setFatorBase('')
    //     setFatorNormal('')
    //     setFatorSt('')
    //     setTransporte(true)
    //     setSt(true)
    //     setDesconto(false)
    //     setIpi(false)
    //     setUnitarioNota(false)
    //     setComposto(false)
    //     setValidation(true)

    // }

    const getFornecedores = async () => {
        
        try {
            
            let { data: fornecedores, error } = await supabase
                .from('fornecedores')
                .select()

            setFornecedoresDB(fornecedores as IFornecedor[])

        } catch (error) {

            addNotification({ tipo: 'erro', mensagem: `${error}`})

        }

    } 

    const [loadingFornecedores, setLoadingFornecedores] = useState(true)
    const [selectedFornecedor, setSelectedFornecedor] = useState('')
    const setCapitalizedFornecedor = (value: string) => {
        setSelectedFornecedor(capitalize(value))
    }

    useEffect(() => {

        async function fetchCadastros(){

            try {
                
                let { data: fornecedores, error } = await supabase
                    .from('fornecedores')
                    .select('nome')

                const cadastradosDB: string[] | undefined = fornecedores?.map(item => item.nome)
                console.log(cadastrados);

                if(cadastradosDB)
                setCadastrados(cadastradosDB)
                // localStorage.setItem('fornecedores', JSON.stringify(cadastradosDB))
            
            } catch (error) {
                
                addNotification({ tipo: 'erro', mensagem: `${error}`})
                
            } finally {
                
                setLoadingFornecedores(false)

            }
        }

        fetchCadastros()

    }, [])

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 600ms ease',
            }}
        >
            <span style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                transform: `${focus ? 'translateX(-40%)' : 'translateX(0%)'}`,
                transition: 'transform 800ms ease',
                height: 'calc(100vh - 6rem)',

            }}>
            <form
                className={style.form}
                onClick={() => setFocus(false)}
                name="fornecedor"
                onSubmit={(e) => handleSubmit(e)}
                // action={submitForm}
                onInvalid={() => setValid(false)}
            >
                <span className={style.logo}>
                <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="355" cy="256.614" r="68" stroke="#E8D4B0" strokeWidth="40"/>
                    <path d="M271 258H0" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                    <path d="M500 258H441" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                    <path d="M69.9496 0.571302C69.9497 26.7286 115.604 30.0417 115.4 68.9252C115.197 107.809 21 126.666 21 164.663C21 200.009 69.9497 216.388 69.9496 237.391" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                    <path d="M241.452 262.571C241.451 288.729 195.797 292.042 196.001 330.925C196.205 369.809 290.401 388.666 290.401 426.663C290.401 462.009 241.451 478.388 241.452 499.391" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                    <path d="M183.95 0.571302C183.95 26.7286 229.604 30.0417 229.4 68.9252C229.197 107.809 135 126.666 135 164.663C135 200.009 183.95 216.388 183.95 237.391" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                    <path d="M131.452 262.571C131.451 288.729 85.7968 292.042 86.0007 330.925C86.2046 369.809 180.401 388.666 180.401 426.663C180.401 462.009 131.451 478.388 131.452 499.391" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
                </svg>
                    <h1
                        style={{
                            width: 'min-content'
                        }}
                    >Cadastro Fornecedor</h1>
                    <span>
                        <p>Cadastre primeiro os fornecedores para acessar suas configurações e fatores no cálculo de tabelas do produtos</p>
                    </span>
                </span>
              
                <div className={style.inputs}>

                    <div className={style.fornecedor}>

                        <div className={`${style.input} ${style.nomeInput}`}>
                            <h3>Fornecedor:</h3>
                            <input
                                name='nome'
                                type="text"
                                placeholder="Nome Fornecedor"
                                spellCheck={false} 
                                required
                                value={nome}
                                data-valid={validation}
                                onChange={(e) => {

                                    setFornecedorData((prev: IFornecedor) => {
                                        
                                        const newValue = e.target.value
                                        const valueCheck = newValue.trim().toLowerCase()

                                        cadastrados.includes(valueCheck)
                                        ? setValidation(false)
                                        : setValidation(true)

                                        return {...prev, ['nome']: newValue}
                                        
                                    })

                                    // setNomeFornecedor(() => {

                                    //     const newValue = e.target.value
                                    //     const valueCheck = newValue.trim().toLowerCase()

                                    //     cadastrados.includes(valueCheck)
                                    //     ? setValidation(false)
                                    //     : setValidation(true)

                                    //     return newValue
                                    // })                                

                                }} 
                            />
                        </div>
                        <div
                            className={style.warning} 
                            // style={{
                            //     height: '17.6px'
                            // }}
                        >
                            <AnimatePresence>
                            {validation||
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}   
                                    exit={{ opacity: 0 }}

                                    // style={{
                                    //     display: 'flex',
                                    //     gap: '0.5rem',
                                    // }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M462 433L250.5 67L144.75 250L39 433H462Z" stroke="black" stroke-width="40" stroke-linejoin="bevel"/>
                                        <path d="M250 198V380" stroke="black" stroke-width="40"/>
                                    </svg>
                                    <p 
                                        // style={{ margin: 0, display: "flex", alignContent: 'center', gap: '0.3rem' }}
                                    >O fornecedor <strong>{capitalize(nome)}</strong> já está cadastrado</p>
                                </motion.span>
                            }
                            </AnimatePresence>
                        </div> 
                        
                        <div className={style.fatores}>

                            <h3>Fatores:</h3>
                            <div className={style.input}>
                                <p>Fator Base</p>
                                <NumberInput 
                                    name='fatorBase'
                                    placeholder={"x 1,00"} 
                                    valor={fatorBase} 
                                    setValor={handleFornecedorChange('fatorBase')}                        
                                />
                            </div>
                            <div className={style.input}>
                                <p>Fator Normal</p>
                                <NumberInput 
                                    name='fatorNormal'
                                    placeholder={"x 1,00"} 
                                    valor={fatorNormal} 
                                    setValor={handleFornecedorChange('fatorNormal')}                        
                                />
                            </div>
                            <div className={style.input}>
                                <p>Fator ST</p>
                                <NumberInput 
                                    name='fatorST'
                                    placeholder={"x 1,00"} 
                                    valor={fatorST} 
                                    setValor={handleFornecedorChange('fatorST')}                        
                                />
                            </div>

                        </div>

                    </div>

                {/* <div className={style.inputs}> */}
                    
                    {/* <div className={style.fatores}>

                        <h3>Fatores:</h3>
                        <div className={style.input}>
                            <p>Fator Base</p>
                            <NumberInput 
                                placeholder={"x 1,00"} 
                                valor={fatorBase} 
                                setValor={setFatorBase}                        
                            />
                        </div>
                        <div className={style.input}>
                            <p>Fator Normal</p>
                            <NumberInput 
                                placeholder={"x 1,00"} 
                                valor={fatorNormal} 
                                setValor={setFatorNormal}                        
                            />
                        </div>
                        <div className={style.input}>
                            <p>Fator ST</p>
                            <NumberInput 
                                placeholder={"x 1,00"} 
                                valor={fatorSt} 
                                setValor={setFatorSt}                        
                            />
                        </div>

                    </div> */}
                    
                    <div className={style.config}>

                        <h3>Configurações:</h3>

                        <div className={style.configInputs}>  
                        <Config 
                            svg={<SvgFornecedor/>} 
                            title={'Transporte'} 
                            description={'Usa transporte no calculo?'} 
                            input={
                                <CheckBox
                                    name='transporte'
                                    checked={transporte} 
                                    setChecked={handleFornecedorChange('transporte')} 
                                />
                            }                           
                        />
                        <Config 
                            svg={<SvgST/>} 
                            title={'ST'} 
                            description={'Usa ST no calculo?'} 
                            input={
                                <CheckBox
                                    name='st' 
                                    checked={st} 
                                    setChecked={handleFornecedorChange('st')} 
                                />
                            }                              
                        />
                        <Config 
                            svg={<SvgPercent/>} 
                            title={'Desconto'} 
                            description={'Usa desconto no calculo?'} 
                            input={
                                <CheckBox
                                    name="desconto" 
                                    checked={desconto} 
                                    setChecked={handleFornecedorChange('desconto')} 
                                />
                            }                               
                        />
                        <Config 
                            svg={<SvgIPI/>} 
                            title={'IPI'} 
                            description={'Usa IPI no calculo?'} 
                            input={
                                <CheckBox 
                                    name="ipi"
                                    checked={ipi} 
                                    setChecked={handleFornecedorChange('ipi')} 
                                />
                            }                             
                        />
                        {ipi&&
                        <Config 
                            svg={<SvgIPI/>} 
                            title={'IPI Proporcional'} 
                            description={'Usa IPI proporcional ao fator base?'}
                            input={
                                <CheckBox 
                                    name="ipiProporcional"
                                    checked={ipi} 
                                    setChecked={handleFornecedorChange('ipi')}
                                />
                            }                              
                        />
                        }
                        <Config 
                            svg={<SvgUnitarioNota/>} 
                            title={'Unitário Nota'} 
                            description={'Usa unitário da nota no calculo?'} 
                            input={
                                <CheckBox 
                                    name="unitarioNota"
                                    checked={unitarioNota} 
                                    setChecked={handleFornecedorChange('unitarioNota')} 
                                />
                            }                                
                        />
                        <Config 
                            svg={<SvgComposto/>} 
                            title={'Composto'} 
                            description={'Usa unitário composto no pedido?'} 
                            input={
                                <CheckBox 
                                    name="composto"
                                    checked={composto} 
                                    setChecked={handleFornecedorChange('composto')} 
                                />
                            }                              
                        />
                        </div>

                    </div>
                </div>

                <span className={style.buttons}>
                    <button type='submit' >Salvar Fornecedor</button>
                    <button type='reset' onClick={() => resetForm()}>Limpar</button>
                </span>

            </form>
            <div
                onClick={() => setFocus(true)}
                style={{
                    border: '2px solid',
                    width: '100%',
                    flex: 2,
                    // flex: `${focus ? 8 : 2 }`,
                    transition: 'flex 1s ease-out',
                    borderRadius: '1rem',
                    padding: '1rem',
                    overflowY: 'scroll',
                }}
            >

               <SelectFornecedor
                    loading={loadingFornecedores} 
                    fornecedoresControle={cadastrados} 
                    fornecedor={selectedFornecedor} 
                    setFornecedor={setCapitalizedFornecedor}                
                />
            <button
                onClick={() => getFornecedores()}
            >Carregar fornecedores</button>
            
            <Suspense fallback={<Loading />}> 
                {fornecedoresDB?.map(({nome, fatorBase, fatorNormal, fatorST, transporte, st, desconto, ipi, unitarioNota, composto }) =>
                        <div key={nome} style={{ border: '2px solid', padding: '1rem', borderRadius: '1rem' }}>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>nome:</p><p style={{ margin: 0 }}>{nome}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>fatorBase:</p><p style={{ margin: 0 }}>{fatorBase}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>fatorNormal:</p><p style={{ margin: 0 }}>{fatorNormal}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>fatorST:</p><p style={{ margin: 0 }}>{fatorST}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>transporte:</p><p style={{ margin: 0 }}>{transporte ? 'Sim' : 'Não'}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>st:</p><p style={{ margin: 0 }}>{st ? 'Sim' : 'Não'}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>desconto:</p><p style={{ margin: 0 }}>{desconto ? 'Sim' : 'Não'}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>ipi:</p><p style={{ margin: 0 }}>{ipi ? 'Sim' : 'Não'}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>unitarioNota:</p><p style={{ margin: 0 }}>{unitarioNota ? 'Sim' : 'Não'}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>composto:</p><p style={{ margin: 0 }}>{composto ? 'Sim' : 'Não'}</p></span>
                        </div>
                )}
                </Suspense>
            </div>
            </span>
        </div>
    )

}

const SvgTransporte = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M319 250.138C319 287.77 288.108 318.276 250 318.276C211.892 318.276 181 287.77 181 250.138C181 212.506 211.892 182 250 182C288.108 182 319 212.506 319 250.138Z" stroke="#E8D4B0" strokeWidth="40"/>
            <path d="M66.0002 37C65.8815 73.6116 128.701 87.2314 128.5 157.5C128.299 227.769 66.0002 233.828 66.0002 302.5C66.0002 366.381 115.74 431.925 116.223 463" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M433.5 463C433.619 426.388 370.8 412.769 371 342.5C371.201 272.231 433.5 266.172 433.5 197.5C433.5 133.619 383.76 68.0749 383.277 37" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
        </svg>
    )
}

const SvgFornecedor = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M463 437.5C426.388 437.619 412.769 374.8 342.5 375C272.231 375.201 266.172 437.5 197.5 437.5C133.619 437.5 68.0749 387.76 37 387.277" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M463 342.5C426.388 342.619 412.769 279.8 342.5 280C272.231 280.201 266.172 342.5 197.5 342.5C133.619 342.5 68.0749 292.76 37 292.277" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M169 144L50.5 181.5C101.414 241.835 195.827 310.885 236.5 322.284L328.5 279C395 264.5 411.5 183.5 444 134.5L169 144Z" fill="none" stroke="#E8D4B0" strokeWidth="40" strokeLinejoin="bevel"/>
            <path d="M271 142V99.4808M271 99.4808V43L202 70.9231L271 99.4808Z" stroke="#E8D4B0" strokeWidth="40"/>
        </svg>
    )
}
const SvgST = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M214 311L298 395L214 479" stroke="black" strokeWidth="40"/>
            <path d="M298 189L214 105L298 21" stroke="black" strokeWidth="40"/>
            <path d="M156 105C76 105 12 118.5 115 221.5C218 324.5 76 275.67 76 315.294C76 325.8 78.0692 336.203 82.0896 345.909C86.11 355.615 92.0028 364.434 99.4315 371.862C106.86 379.291 115.679 385.184 125.385 389.204C135.091 393.225 145.494 395.294 156 395.294H270.11" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
            <path d="M354.11 395.294C434.11 395.294 498.11 381.794 395.11 278.794C292.11 175.794 434.11 224.624 434.11 185C434.11 174.494 432.041 164.091 428.02 154.385C424 144.679 418.107 135.86 410.679 128.431C403.25 121.003 394.431 115.11 384.725 111.09C375.019 107.069 364.616 105 354.11 105L240 105" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
        </svg>
    )
}
const SvgPercent = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M411.039 361C411.039 388.614 389.092 411 362.02 411C334.947 411 313 388.614 313 361C313 333.386 334.947 311 362.02 311C389.092 311 411.039 333.386 411.039 361Z" stroke="black" strokeWidth="40"/>
            <path d="M190.961 131C190.961 158.614 168.136 181 139.98 181C111.825 181 89 158.614 89 131C89 103.386 111.825 81 139.98 81C168.136 81 190.961 103.386 190.961 131Z" stroke="black" strokeWidth="40"/>
            <path d="M69 431C249.5 431 69 250.5 249.5 250.5C430 250.5 249.5 61 431 61" stroke="black" strokeWidth="40"/>
        </svg>
    )
}
const SvgIPI = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M90.7028 148L66 438H131.5H197L172.297 148H131.5H90.7028Z" stroke="black" strokeWidth="40"/>
            <path d="M441.685 320.685C365.914 244.914 362.156 399.378 286.803 324.024C236.834 274.055 220.001 323.494 192.357 340.5" stroke="black" strokeWidth="40"/>
            <path d="M197 439H435V314" stroke="black" strokeWidth="40"/>
            <path d="M129 70.1853C206.332 -7.14683 206.332 147.517 283.664 70.1853C360.996 -7.14683 364.852 151.373 442.613 73.6127" stroke="black" strokeWidth="40"/>
        </svg>
    )
}
const SvgUnitarioNota = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M87.8767 246.979C-2.61686 155.99 178.37 155.99 87.8767 65L421.877 65C512.37 155.99 331.383 155.99 421.877 246.979C512.37 337.969 326.871 342.506 417.866 434L83.866 434C-7.12898 342.506 178.37 337.969 87.8767 246.979Z" stroke="black" strokeWidth="40" strokeLinejoin="round"/>
            <line x1="160" y1="159" x2="339" y2="159" stroke="black" strokeWidth="40"/>
            <line x1="177" y1="257" x2="356" y2="257" stroke="black" strokeWidth="40"/>
            <line x1="153" y1="351" x2="332" y2="351" stroke="black" strokeWidth="40"/>
        </svg>
    )
}
const SvgComposto = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M179 250C179 277.614 156.614 300 129 300C101.386 300 79 277.614 79 250C79 222.386 101.386 200 129 200C156.614 200 179 222.386 179 250Z" stroke="black" strokeWidth="40"/>
            <path d="M420 250C420 277.614 397.614 300 370 300C342.386 300 320 277.614 320 250C320 222.386 342.386 200 370 200C397.614 200 420 222.386 420 250Z" stroke="black" strokeWidth="40"/>
            <path d="M249.589 87C330.688 171.845 168.489 171.008 249.589 255.853C330.688 340.698 168.04 348.685 249.589 434" stroke="black" strokeWidth="40"/>
            <path d="M216.5 83H60C37.9086 83 20 100.909 20 123V376C20 398.091 37.9086 416 60 416H186" stroke="black" strokeWidth="40"/>
            <path d="M307.5 83H440C462.091 83 480 100.909 480 123V376C480 398.091 462.091 416 440 416H282" stroke="black" strokeWidth="40"/>
        </svg>
    )
}