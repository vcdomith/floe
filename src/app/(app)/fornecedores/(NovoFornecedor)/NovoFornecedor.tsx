import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import style from './NovoFornecedor.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
import Config from '../../configurar/(Config)/Config'
import CheckBox from '../../configurar/(CheckBox)/CheckBox'
import useFornecedor from '@/hooks/useFornecedor'
import NumberInput from '@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput'
import { ChangeEvent, FormEvent } from 'react'

const formatCNPJ = (value: string) => {
    // Remove non-numeric characters
    value = value.replace(/\D/g, '');
    
    // Apply the CNPJ mask: 00.000.000/0000-00
    return value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

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
        usaIpiUniversal,
        usaUnitarioPedido,
        usaComposto
    } = fornecedorData

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('Submit');
    }

    const handleCnpjChange = () => {

        return (value: string) => setFornecedorData(prev => ({
            ...prev,
            cnpj: formatCNPJ(value)
        }))

        // const inputValue = e.target.value
        // const format = formatCNPJ(inputValue)
        
        // handleFornecedorChange('cnpj')

    }

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

            {//TODO - wrap elementos em um form
            }

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
                            <NumberInput 
                                placeholder={'_____'} 
                                required
                                valor={cnpj!} 
                                setValor={handleCnpjChange()}
                                minLength={14}
                                maxLength={14}
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
                                checked={usaIpiUniversal} 
                                setChecked={handleFornecedorChange('usaIpiUniversal')}
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
                    {/* {svgsUtil.plus} */}
                    Cadastrar Fornecedor
                </button>
            </span>
                        
        </form>
    )

}