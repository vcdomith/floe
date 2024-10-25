import { svgsUtil } from '@/components/SvgArray/SvgUtil'
import style from './NovoFornecedor.module.scss'
import { motion } from 'framer-motion'
import Config from '../../configurar/(Config)/Config'
import CheckBox from '../../configurar/(CheckBox)/CheckBox'
import useFornecedor from '@/hooks/useFornecedor'
import NumberInput from '@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput'

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

    return (
        <div className={style.novoFornecedor}>

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

            <ul className={style.content}>

                <span className={style.tag}>
                    <h5>Dados</h5>
                </span>

                <motion.div 
                    className={`${style.fatores} ${style.dados}`}

                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
                >
                    <Config 
                        svg={svgsUtil.fornecedor} 
                        title={'Fornecedor'} 
                        description={`Nome simplificado do fornecedor a ser cadastrado (valor único)`} 
                        input={
                            <input 
                                type='text'
                                value={nome}
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
                                valor={cnpj!} 
                                setValor={handleFornecedorChange('cnpj')}
                                minLength={14}
                                maxLength={14}
                            />
                        } 
                    />

                </motion.div>

                <span className={style.tag}>
                    <h5>Fatores</h5>
                </span>

                <motion.div 
                    className={style.fatores}

                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
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

                <span className={style.tag}>
                    <h5>Configurações</h5>
                </span>

                <motion.div 
                    className={style.fatores}

                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ type: 'spring', bounce: 0, restDelta: 0.5 }}
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
            </ul>

            <span className={style.buttons}>
                <button className={style.submit}>
                    {svgsUtil.plus}
                    Cadastrar Fornecedor
                </button>
            </span>
                        
        </div>
    )

}