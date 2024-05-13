'use client'
import { FormEvent, useMemo, useState } from "react"
import CheckBox from "./(CheckBox)/CheckBox"
import NumberInput from "@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput"
import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor"
import { IFornecedor } from "@/interfaces/IFornecedor"
import { dbConnect } from "@/utils/db/supabase"
import { useNotification } from "../(contexts)/NotificationContext"

import style from './configurar.module.scss'

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

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 600ms ease',
            }}
        >
            <p
                style={{
                    fontSize: '1.5rem',

                }}
            >{JSON.stringify(cadastroFornecedor)}</p>
            <span style={{
                display: 'flex',
                gap: '1rem',
            }}>
            <form
                className={style.form}
                onClick={() => setFocus(false)}
                name="fornecedor"
                onSubmit={(e) => handleSubmit(e)}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    border: '2px solid',
                    flex: `${focus ? 2 : 8}`,
                    transition: 'flex 1s ease-out',
                    borderRadius: '1rem',
                    padding: '2rem 4rem'
                }}
            >
                <span className={style.logo}>
                <svg width="50" height="50" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="355" cy="256.614" r="68" stroke="#E8D4B0" stroke-width="40"/>
                    <path d="M271 258H0" stroke="#E8D4B0" stroke-width="40" stroke-linejoin="round"/>
                    <path d="M500 258H441" stroke="#E8D4B0" stroke-width="40" stroke-linejoin="round"/>
                    <path d="M69.9496 0.571302C69.9497 26.7286 115.604 30.0417 115.4 68.9252C115.197 107.809 21 126.666 21 164.663C21 200.009 69.9497 216.388 69.9496 237.391" stroke="#E8D4B0" stroke-width="40" stroke-linejoin="round"/>
                    <path d="M241.452 262.571C241.451 288.729 195.797 292.042 196.001 330.925C196.205 369.809 290.401 388.666 290.401 426.663C290.401 462.009 241.451 478.388 241.452 499.391" stroke="#E8D4B0" stroke-width="40" stroke-linejoin="round"/>
                    <path d="M183.95 0.571302C183.95 26.7286 229.604 30.0417 229.4 68.9252C229.197 107.809 135 126.666 135 164.663C135 200.009 183.95 216.388 183.95 237.391" stroke="#E8D4B0" stroke-width="40" stroke-linejoin="round"/>
                    <path d="M131.452 262.571C131.451 288.729 85.7968 292.042 86.0007 330.925C86.2046 369.809 180.401 388.666 180.401 426.663C180.401 462.009 131.451 478.388 131.452 499.391" stroke="#E8D4B0" stroke-width="40" stroke-linejoin="round"/>
                </svg>
                    <h1
                        style={{
                            width: 'min-content'
                        }}
                    >Novo fornecedor:</h1>
                </span>
                {/* <span 
                    style={{
                        display: 'inline-flex',
                        alignItems: "center",
                        gap: '1rem',
                    }}
                >
                    <p>Fornecedor</p>
                    <SelectFornecedor />
                </span> */}
                <span>
                    <h3>Nome Fornecedor</h3>
                    <input 
                        type="text"
                        placeholder="Nome Fornecedor" 
                        required
                        value={nomeFornecedor}
                        onChange={(e) => setNomeFornecedor(e.target.value)}
                    />
                </span>
                <span>
                    <h3>Fatores:</h3>
                </span>
                <span>
                    <p>Fator Base</p>
                    <NumberInput 
                        placeholder={"ex: 1,00"} 
                        valor={fatorBase} 
                        setValor={setFatorBase}                        
                     />
                </span>
                <span>
                    <p>Fator Normal</p>
                    <NumberInput 
                        placeholder={"Fator Normal"} 
                        valor={fatorNormal} 
                        setValor={setFatorNormal}                        
                     />
                </span>
                <span>
                    <p>Fator ST</p>
                    <NumberInput 
                        placeholder={"Fator ST"} 
                        valor={fatorSt} 
                        setValor={setFatorSt}                        
                     />
                </span>
                <span>
                    <h3>Configurações:</h3>
                </span>
                <span>
                    <p>Usa Transporte?</p>
                    <CheckBox
                        checked={transporte}
                        setChecked={setTransporte}
                    />
                </span>
                <span>
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
                </span>
                <button type="submit">Enviar</button>
                {/* <input type="submit" hidden/> */}
            </form>
            <div
                onClick={() => setFocus(true)}
                style={{
                    border: '2px solid',
                    flex: `${focus ? 8 : 2 }`,
                    transition: 'flex 1s ease-out',
                    borderRadius: '1rem',
                    padding: '1rem'
                }}
            ></div>
            </span>
            <div>
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
            </div>
        </div>
    )

}