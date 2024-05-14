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
import Loading from "./loading"
import Config from "./(Config)/Config"

export default function Configurar() {

    const supabase = useMemo(() => dbConnect(), [])

    const { notifications, addNotification } = useNotification()

    // State cadastro
    const [cadastroFornecedor, setCadastroFornecedor] = useState<IFornecedor>()
    
    // State Controle Inputs
    const [nomeFornecedor, setNomeFornecedor] = useState('')
    const [fatorBase, setFatorBase] = useState('')
    const [fatorNormal, setFatorNormal] = useState('')
    const [fatorSt, setFatorSt] = useState('')
    const [transporte, setTransporte] = useState(true)
    const [st, setSt] = useState(true)
    const [desconto, setDesconto] = useState(false)
    const [ipi, setIpi] = useState(false)
    const [unitarioNota, setUnitarioNota] = useState(false)

    const [fornecedoresDB, setFornecedoresDB] = useState<IFornecedor[]>()

    const [focus, setFocus] = useState(false)

    const [valid, setValid] = useState(false)
    const [validation, setValidation] = useState(true)

    function capitalize(string: string):string {

        const captalizedFirstLetter = string[0].toUpperCase()
        const lowercasePart = string.slice(1,)
        return `${captalizedFirstLetter + lowercasePart}`

    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        const novoCadastro: IFornecedor = {
            nome: nomeFornecedor.trim().toLowerCase(),
            fatorBase: fatorBase,
            fatorNormal: fatorNormal,
            fatorST: fatorSt,
            transporte: transporte,
            st: st,
            desconto: desconto,
            ipi: ipi,
            unitarioNota: unitarioNota,
        }

        setCadastroFornecedor(novoCadastro as IFornecedor)       

        try {
            
            let { data: fornecedor, error } = await supabase
                .from('fornecedores')
                .insert([{...novoCadastro}])

            if(error) {
                addNotification({ tipo: 'erro', mensagem: `${error.details}`})
                return
            }
            addNotification({ tipo: 'sucesso', mensagem: `Cadastro do fornecedor ${capitalize(novoCadastro.nome)} feito com sucesso!`})
            

        } catch (error) {
            
            console.error(error)
            addNotification({ tipo: 'erro', mensagem: `${error}`})

        }
      

    }

    const resetForm = () => {

        setNomeFornecedor('')
        setFatorBase('')
        setFatorNormal('')
        setFatorSt('')
        setTransporte(true)
        setSt(true)
        setDesconto(false)
        setIpi(false)
        setUnitarioNota(false)

    }

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

    const [cadastrados, setCadastrados] = useState<string[]>([])

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
                // localStorage.setItem('fornecedores', JSON.stringify(cadastrados))
    
            } catch (error) {
    
                addNotification({ tipo: 'erro', mensagem: `${error}`})
    
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
            }}>
            <form
                className={style.form}
                onClick={() => setFocus(false)}
                name="fornecedor"
                onSubmit={(e) => handleSubmit(e)}
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
                    >Novo Fornecedor:</h1>
                </span>
              
                <div>

                    <div className={style.input}>
                        <h3>Nome Fornecedor:</h3>
                        <input 
                            type="text"
                            placeholder="Nome Fornecedor"
                            spellCheck={false} 
                            required
                            value={nomeFornecedor}
                            data-valid={validation}
                            onChange={(e) => {

                                setNomeFornecedor(() => {

                                    const newValue = e.target.value
                                    const valueCheck = newValue.trim().toLowerCase()

                                    cadastrados.includes(valueCheck)
                                    ? setValidation(false)
                                    : setValidation(true)

                                    return newValue
                                })                                

                            }} 
                        />
                    </div>
                    <div>
                        {/* svg validação */}
                        <p style={{ margin: 0 }}>{validation ? '' : 'Já existe!'}</p>
                    </div> 
                    
                </div>

                <div className={style.inputs}>
                    
                    <div className={style.fatores}>

                        <h3>Fatores:</h3>
                        <div className={style.input}>
                            <p>Fator Base</p>
                            <NumberInput 
                                placeholder={"ex: 1,00"} 
                                valor={fatorBase} 
                                setValor={setFatorBase}                        
                            />
                        </div>
                        <div className={style.input}>
                            <p>Fator Normal</p>
                            <NumberInput 
                                placeholder={"Fator Normal"} 
                                valor={fatorNormal} 
                                setValor={setFatorNormal}                        
                            />
                        </div>
                        <div className={style.input}>
                            <p>Fator ST</p>
                            <NumberInput 
                                placeholder={"Fator ST"} 
                                valor={fatorSt} 
                                setValor={setFatorSt}                        
                            />
                        </div>

                    </div>
                    
                    <div className={style.config}>

                        <h3>Configurações:</h3>

                        <div className={style.inputs}>
                            {/* <span>
                                <p>Usa Transporte?</p>
                                <CheckBox
                                    checked={transporte}
                                    setChecked={setTransporte}
                                />
                            </span> */}
                            <Config 
                                svg={<SvgFornecedor/>} 
                                title={'Transporte'} 
                                description={'Usa transporte no calculo?'} 
                                checked={transporte} 
                                setChecked={setTransporte}                                
                            />
                            <Config 
                                svg={<SvgTransporte/>} 
                                title={'ST'} 
                                description={'Usa ST no calculo?'} 
                                checked={st} 
                                setChecked={setSt}                                
                            />
                            <Config 
                                svg={<SvgTransporte/>} 
                                title={'Desconto'} 
                                description={'Usa desconto no calculo?'} 
                                checked={desconto} 
                                setChecked={setDesconto}                                
                            />
                            <Config 
                                svg={<SvgTransporte/>} 
                                title={'IPI'} 
                                description={'Usa IPI no calculo?'} 
                                checked={ipi} 
                                setChecked={setIpi}                                
                            />
                            <Config 
                                svg={<SvgTransporte/>} 
                                title={'Unitário Nota'} 
                                description={'Usa unitário da nota no calculo?'} 
                                checked={unitarioNota} 
                                setChecked={setUnitarioNota}                                
                            />
                            {/* <span>
                                <p>Usa ST?</p>
                                <CheckBox
                                    checked={st}
                                    setChecked={setSt}
                                />
                            </span>
                            <span>
                                <p>Usa Desconto?</p>
                                <CheckBox
                                    checked={desconto}
                                    setChecked={setDesconto}
                                />
                            </span>
                            <span>
                                <p>Usa IPI?</p>
                                <CheckBox
                                    checked={ipi}
                                    setChecked={setIpi}
                                />
                            </span>
                            <span>
                                <p>Usa unitário nota?</p>
                                <CheckBox
                                    checked={unitarioNota}
                                    setChecked={setUnitarioNota}
                                />
                            </span> */}
                        </div>

                    </div>
                </div>

                <span className={style.buttons}>
                    <button type='submit'>Salvar Fornecedor</button>
                    <button type='reset' onClick={() => resetForm()}>Limpar</button>
                </span>

            </form>
            <div
                onClick={() => setFocus(true)}
                style={{
                    border: '2px solid',
                    width: '100%',
                    // flex: `${focus ? 8 : 2 }`,
                    transition: 'flex 1s ease-out',
                    borderRadius: '1rem',
                    padding: '1rem'
                }}
            >
            <button
                onClick={() => getFornecedores()}
            >Carregar fornecedores</button>
            
                {fornecedoresDB?.map(({nome, fatorBase, fatorNormal, fatorST, transporte, st, desconto, ipi, unitarioNota}) =>
                    <Suspense key={nome} fallback={<Loading />}> 
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
                        </div>
                    </Suspense>
                )}
            </div>
            </span>
            {/* <div>
                <button
                    onClick={() => getFornecedores()}
                >Carregar fornecedores</button>
                {fornecedoresDB?.map(({nome, fatorBase, fatorNormal, fatorST, transporte, st, desconto, ipi, unitarioNota}) => 
                    <div key={nome} style={{ border: '2px solid' }}>
                        <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>nome:</p><p style={{ margin: 0 }}>{nome}</p></span>
                        <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>fatorBase:</p><p style={{ margin: 0 }}>{fatorBase}</p></span>
                        <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>fatorNormal:</p><p style={{ margin: 0 }}>{fatorNormal}</p></span>
                        <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>fatorST:</p><p style={{ margin: 0 }}>{fatorST}</p></span>
                        <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>transporte:</p><p style={{ margin: 0 }}>{transporte ? 'Sim' : 'Não'}</p></span>
                        <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>st:</p><p style={{ margin: 0 }}>{st ? 'Sim' : 'Não'}</p></span>
                        <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>desconto:</p><p style={{ margin: 0 }}>{desconto ? 'Sim' : 'Não'}</p></span>
                        <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>ipi:</p><p style={{ margin: 0 }}>{ipi ? 'Sim' : 'Não'}</p></span>
                        <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>unitarioNota:</p><p style={{ margin: 0 }}>{unitarioNota ? 'Sim' : 'Não'}</p></span>
                    </div>
                )}
            </div> */}
        </div>
    )

}

const SvgTransporte = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M319 250.138C319 287.77 288.108 318.276 250 318.276C211.892 318.276 181 287.77 181 250.138C181 212.506 211.892 182 250 182C288.108 182 319 212.506 319 250.138Z" stroke="#E8D4B0" stroke-width="40"/>
<path d="M66.0002 37C65.8815 73.6116 128.701 87.2314 128.5 157.5C128.299 227.769 66.0002 233.828 66.0002 302.5C66.0002 366.381 115.74 431.925 116.223 463" stroke="#E8D4B0" stroke-width="40" stroke-linejoin="round"/>
<path d="M433.5 463C433.619 426.388 370.8 412.769 371 342.5C371.201 272.231 433.5 266.172 433.5 197.5C433.5 133.619 383.76 68.0749 383.277 37" stroke="#E8D4B0" stroke-width="40" stroke-linejoin="round"/>
        </svg>
    )
}
const SvgFornecedor = () => {
    return (
        <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M463 437.5C426.388 437.619 412.769 374.8 342.5 375C272.231 375.201 266.172 437.5 197.5 437.5C133.619 437.5 68.0749 387.76 37 387.277" stroke="#E8D4B0" stroke-width="40" stroke-linejoin="round"/>
<path d="M463 342.5C426.388 342.619 412.769 279.8 342.5 280C272.231 280.201 266.172 342.5 197.5 342.5C133.619 342.5 68.0749 292.76 37 292.277" stroke="#E8D4B0" stroke-width="40" stroke-linejoin="round"/>
<path d="M169 144L50.5 181.5C101.414 241.835 195.827 310.885 236.5 322.284L328.5 279C395 264.5 411.5 183.5 444 134.5L169 144Z" fill="none" stroke="#E8D4B0" stroke-width="40" stroke-linejoin="bevel"/>
<path d="M271 142V99.4808M271 99.4808V43L202 70.9231L271 99.4808Z" stroke="#E8D4B0" stroke-width="40"/>
        </svg>
    )
}