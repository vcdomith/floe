'use client'
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react"
import CheckBox from "./(CheckBox)/CheckBox"
import NumberInput from "@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput"
import SelectFornecedor from "@/components/SelectFornecedor/SelectFornecedor"
import { IFornecedor } from "@/interfaces/IFornecedor"
import { dbConnect } from "@/utils/db/supabase"
import { useNotification } from "../(contexts)/NotificationContext"

import style from './configurar.module.scss'
import Config from "./(Config)/Config"
import Loading from "../cadastros/loading"
import capitalize from "@/utils/capitalize"
import { motion, AnimatePresence } from "framer-motion"
import useFornecedor from "@/hooks/useFornecedor"
import { useModal } from "../(contexts)/ModalContext"
import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog"
import { svgsUtil } from "@/components/SvgArray/SvgUtil"

export default function Configurar() {

    const supabase = useMemo(() => dbConnect(), [])

    const { addNotification } = useNotification()
    const { setModal, clearModal } = useModal()

    // State cadastro
    const [cadastroFornecedor, setCadastroFornecedor] = useState<IFornecedor>()
     
    const {fornecedorData, setFornecedorData, handleFornecedorChange, resetFornecedor} = useFornecedor()
    const {
        nome,
        fatorBase,
        fatorBaseNormal,
        fatorBaseST,
        usaTransporte,
        usaSt,
        usaDesconto,
        usaIpi,
        usaUnitarioPedido,
        usaComposto
    } = fornecedorData

    const [fornecedoresDB, setFornecedoresDB] = useState<IFornecedor[]>()
    const [cadastrados, setCadastrados] = useState<string[]>([])

    const [focus, setFocus] = useState(false)

    // TODO change from state to const
    const [valid, setValid] = useState(false)
    const [validation, setValidation] = useState(true)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        if(!validation) {
            addNotification({ 
                tipo: 'erro', 
                mensagem: `Não foi possível realizar o cadastro, fornecedor ${nome} já está cadastrado!`
            })
            return
        }

        setModal(
            <ConfirmationDialog 
                title={`Confirme para salvar o fornecedor ${capitalize(nome)}:`}
                message="Alerta: o fornecedor será salvo permanentemente!" 
                cancelHandler={clearModal} 
                confirmHandler={cadastrarFornecedor}                
            />
        )

        // const novoCadastro: IFornecedor = {...fornecedorData, nome: nome.trim().toLowerCase()}
        // setCadastroFornecedor(novoCadastro)       

        // try {
            
        //     let { data: fornecedor, error } = await supabase
        //         .from('fornecedores')
        //         .insert([{...novoCadastro}])

        //     if(error) {
        //         addNotification({ tipo: 'erro', mensagem: `${error.details}`})
        //         return
        //     }
        //     addNotification({ tipo: 'sucesso', mensagem: `Cadastro do fornecedor ${capitalize(novoCadastro.nome)} feito com sucesso!`})
        //     resetForm()
        //     // revalidateTag()
            

        // } catch (error) {
            
        //     console.error(error)
        //     addNotification({ tipo: 'erro', mensagem: `${error}`})

        // }
      

    }

    const cadastrarFornecedor = async () => {

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
            addNotification({ 
                tipo: 'sucesso', 
                mensagem: `Cadastro do fornecedor ${capitalize(novoCadastro.nome)} feito com sucesso!`
            })
            resetFornecedor()            

        } catch (error) {
            
            console.error(error)
            addNotification({ 
                tipo: 'erro', 
                mensagem: `${error}`
            })

        }

    }

    const getFornecedores = async () => {
        
        try {
            
            let { data: fornecedores, error } = await supabase
                .from('fornecedores')
                .select()

            setFornecedoresDB(fornecedores as IFornecedor[])

        } catch (error) {

            addNotification({ 
                tipo: 'erro', 
                mensagem: `${error}`
            })

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
                height: 'calc(100dvh - 6rem)',

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
                                minLength={3}
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

                                }} 
                            />
                        </div>
                        <div className={style.warning} >
                            <AnimatePresence>
                            {validation||
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}   
                                    exit={{ opacity: 0 }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M462 433L250.5 67L144.75 250L39 433H462Z" stroke="black" strokeWidth="40" strokeLinejoin="bevel"/>
                                        <path d="M250 198V380" stroke="black" strokeWidth="40"/>
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
                                    required                        
                                />
                            </div>
                            <div className={style.input}>
                                <p>Fator Base Normal</p>
                                <NumberInput 
                                    name='fatorBaseNormal'
                                    placeholder={"x 1,00"} 
                                    valor={fatorBaseNormal} 
                                    setValor={handleFornecedorChange('fatorBaseNormal')}  
                                    required                      
                                />
                            </div>
                            <div className={style.input}>
                                <p>Fator Base ST</p>
                                <NumberInput 
                                    name='fatorBaseST'
                                    placeholder={"x 1,00"} 
                                    valor={fatorBaseST} 
                                    setValor={handleFornecedorChange('fatorBaseST')}
                                    required
                                />
                            </div>

                        </div>

                    </div>
                    
                    <div className={style.config}>

                        <h3>Configurações:</h3>

                        <div className={style.configInputs}>  
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
                        </div>

                    </div>
                </div>

                <span className={style.buttons}>
                    <button type='submit' >Salvar Fornecedor</button>
                    <button type='reset' onClick={() => {
                        resetFornecedor()
                        setValidation(true)
                    }}>Limpar</button>
                </span>

            </form>
            <div
                // onClick={() => setFocus(true)}
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
                {fornecedoresDB?.map(({nome, fatorBase, fatorBaseNormal, fatorBaseST, usaTransporte, usaSt, usaDesconto, usaIpi, usaUnitarioPedido, usaComposto }) =>
                        <div key={nome} style={{ border: '2px solid', padding: '1rem', borderRadius: '1rem' }}>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>nome:</p><p style={{ margin: 0 }}>{nome}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>fatorBase:</p><p style={{ margin: 0 }}>{fatorBase}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>fatorNormal:</p><p style={{ margin: 0 }}>{fatorBaseNormal}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>fatorST:</p><p style={{ margin: 0 }}>{fatorBaseST}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>transporte:</p><p style={{ margin: 0 }}>{usaTransporte ? 'Sim' : 'Não'}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>st:</p><p style={{ margin: 0 }}>{usaSt ? 'Sim' : 'Não'}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>desconto:</p><p style={{ margin: 0 }}>{usaDesconto ? 'Sim' : 'Não'}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>ipi:</p><p style={{ margin: 0 }}>{usaIpi ? 'Sim' : 'Não'}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>unitarioPedido:</p><p style={{ margin: 0 }}>{usaUnitarioPedido ? 'Sim' : 'Não'}</p></span>
                            <span style={{ display: 'flex'}}><p style={{ margin: 0 }}>composto:</p><p style={{ margin: 0 }}>{usaComposto ? 'Sim' : 'Não'}</p></span>
                        </div>
                )}
                </Suspense>
            </div>
            </span>
        </div>
    )

}