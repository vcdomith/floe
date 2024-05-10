'use client'
import { FormEvent, useMemo, useState } from "react"
import CheckBox from "./(CheckBox)/CheckBox"
import NumberInput from "@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput"
import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor"
import { IFornecedor } from "@/interfaces/IFornecedor"
import { dbConnect } from "@/utils/db/supabase"
import { useNotification } from "../(contexts)/NotificationContext"

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
                flexDirection: 'column'
            }}
        >
            <p
                style={{
                    fontSize: '1.5rem',

                }}
            >{JSON.stringify(cadastroFornecedor)}</p>
            <form
                name="fornecedor"
                onSubmit={(e) => handleSubmit(e)}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    border: '2px solid',
                }}
            >
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
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: "center",
                        gap: '1rem',
                    }}
                >
                    <p>Fornecedor</p>
                    <input 
                        type="text" 
                        required
                        value={nomeFornecedor}
                        onChange={(e) => setNomeFornecedor(e.target.value)}
                    />
                </span>
                <span>
                    <p>Fator Base</p>
                    <NumberInput 
                        placeholder={"Fator Base"} 
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
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: "center",
                        gap: '1rem',
                    }}
                >
                    <p>Usa Transporte?</p>
                    <CheckBox
                        checked={transporte}
                        setChecked={setTransporte}
                    />
                </span>
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: "center",
                        gap: '1rem',
                    }}
                >
                    <p>Usa ST?</p>
                    <CheckBox
                        checked={st}
                        setChecked={setSt}
                    />
                </span>
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: "center",
                        gap: '1rem',
                    }}
                >
                    <p>Usa Desconto?</p>
                    <CheckBox
                        checked={desconto}
                        setChecked={setDesconto}
                    />
                </span>
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: "center",
                        gap: '1rem',
                    }}
                >
                    <p>Usa IPI?</p>
                    <CheckBox
                        checked={ipi}
                        setChecked={setIpi}
                    />
                </span>
                <span
                    style={{
                        display: 'inline-flex',
                        alignItems: "center",
                        gap: '1rem',
                    }}
                >
                    <p>Usa unitário nota?</p>
                    <CheckBox
                        checked={unitarioNota}
                        setChecked={setUnitarioNota}
                    />
                </span>
                <button type="submit">Enviar</button>
                {/* <input type="submit" hidden/> */}
            </form>
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