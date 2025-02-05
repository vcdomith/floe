import capitalizeInner from "@/utils/capitalize";
import { dbConnect } from "@/utils/db/supabase";
import { notFound, redirect } from "next/navigation";
import { svgsUtil } from "@/components/SvgArray/SvgUtil";
import { keyBy } from "lodash";
import capitalize from "@/utils/capitalize";
import CheckBox from "../../configurar/(CheckBox)/CheckBox";
import { SetStateAction } from "react";
import Config from "../../configurar/(Config)/Config";
import { IFornecedor } from "@/interfaces/IFornecedor";
import style from './fornecedor.module.scss'
import { formatSplit } from "@/utils/documentosFormat";
import Tab from "@/components/Tab/Tab";

export const dynamicParams = false

export async function generateStaticParams() {

    const supabase = dbConnect()
    const { data: fornecedores, error } = await supabase.from('fornecedores').select('nome')

    const fornecedoresParams = fornecedores
        ?.map( ({ nome }) => ({
        fornecedor: nome
    })) || [{ fornecedor: '' }]

    const test = fornecedoresParams.some(
        fornecedor => fornecedor.fornecedor.includes('%20')
    )
    // console.log(fornecedoresParams, test);

    return fornecedoresParams

}

async function disabledSetCheck() {
    'use server'
    return
}

const supabase = dbConnect()

type Params = Promise<{ fornecedor: string }>

export default async function Fornecedor( { params }: { params: Params }) {

    const { fornecedor: fornecedorParam } = await params 

    const { data: fornecedor, error } = await supabase
        .from('fornecedores')
        .select('*')
        .eq('nome', fornecedorParam.replaceAll('%20', ' '))
        .single()

    if (error) {
        console.error('Error fetching data', error)
        return <p>{JSON.stringify(error)}</p>
    }

    console.log(fornecedor);

    return (
        <div className={style.container}>
            {(fornecedorParam !== undefined)
            // ? `Fornecedor ${capitalize(JSON.stringify(fornecedor[0]) ?? '')}`
            ? (
                <div className={style.wrapper}>
                    <span className={style.tag}>
                    <h5>Dados</h5>
                    </span>
                    <DadosSection fornecedor={fornecedor} />

                    <span className={style.tag}>
                    <h5>Fatores</h5>
                    </span>
                    <FatoresSection fornecedor={fornecedor} />

                    <span className={style.tag}>
                    <h5>Configurações</h5>
                    </span>
                    <ConfigSection fornecedor={fornecedor}/>
                </div>
            )
            : 'Nenhum fornecedor escolhido'
            }
            
        </div>
    )

}

const CNPJ_SEGMENT_FORMAT = [2,3,3,4,2]

const DadosSection = ({fornecedor}: {fornecedor: IFornecedor}) => {

    const {
        nome,
        nomeFantasia,
        cnpj,
        fatorBase,
        fatorBaseNormal,
        fatorBaseST,
    } = fornecedor

    let initial = ''
    const cnpjFormat = formatSplit(cnpj!, CNPJ_SEGMENT_FORMAT)?.reduce( (acc, val, index) => {
        if (index === 0) return acc + val
        if (index === 3) return acc + '/' + val
        return acc + '.' + val
    }, initial)

    return (
        <section className={`${style.content} ${style.dados}`}>
            <Config 
                svg={svgsUtil.fornecedor} 
                title={'Fornecedor'} 
                description={`Nome simplificado do fornecedor`} 
                input={
                    // <input
                    //     type="text"
                    //     value={nome}
                    //     disabled
                    // />
                    <p>{capitalize(nome)}</p>
                }                           
            />
            <Config 
                svg={svgsUtil.unitarioNota} 
                title={'Nome Fantasia'} 
                description={`Nome fantasia fornecedor (completo da nota)`} 
                input={
                    // <input
                    //     type="text"
                    //     value={nomeFantasia}
                    //     disabled
                    // />
                    <p>{nomeFantasia}</p>
                }                           
            />
            <Config 
                svg={svgsUtil.unitarioNota} 
                title={'CNPJ'} 
                description={`CNPJ fornecedor`} 
                input={
                    // <input
                    //     type="text"
                    //     value={cnpjFormat}
                    //     disabled
                    // />
                    <p>{cnpjFormat}</p>
                }                           
            />
        </section>
    )

}

const FatoresSection = ({fornecedor}: {fornecedor: IFornecedor}) => {

    const {
        fatorBase,
        fatorBaseNormal,
        fatorBaseST
    } = fornecedor

    return (
        <section className={style.content}>
            <Config 
                svg={svgsUtil.unitarioNota} 
                title={'Fator Base'} 
                description={`Fator Base que todos produtos do fornecedor usam`}
                input={
                    <input
                        type="text"
                        value={fatorBase}
                        disabled
                    />
                }                           
            />
            <Config 
                svg={svgsUtil.unitarioNota} 
                title={'Fator Normal'} 
                description={`Fator que os produtos sem ST usam`} 
                input={
                    <input
                        type="text"
                        value={fatorBaseNormal}
                        disabled
                    />
                }                           
            />
            <Config 
                svg={svgsUtil.unitarioNota} 
                title={'Fator ST'} 
                description={`Fator que os produtos com ST usam`} 
                input={
                    <input
                        type="text"
                        value={fatorBaseST}
                        disabled
                    />
                }                           
            />
        </section>
    )

}

const ConfigSection = ({fornecedor}: {fornecedor: IFornecedor}) => {

    const {
        usaTransporte,
        usaSt,
        usaDesconto,
        usaIpi,
        usaComposto,
        usaIpiProporcional,
        usaUnitarioPedido
    } = fornecedor

    return (
        <section className={style.content}>
            <Config 
                svg={svgsUtil.transporte} 
                title={'Transporte'} 
                description={'Usa transporte no calculo?'} 
                input={
                    <CheckBox
                        checked={usaTransporte} 
                        setChecked={disabledSetCheck}
                        disabled 
                    />
                }                           
            />
            <Config 
                svg={svgsUtil.st} 
                title={'ST'} 
                description={'Usa ST no calculo?'} 
                input={
                    <CheckBox 
                        checked={usaSt} 
                        setChecked={disabledSetCheck}
                        disabled 
                    />
                }                              
            />
            <Config 
                svg={svgsUtil.desconto} 
                title={'Desconto'} 
                description={'Usa desconto no calculo?'} 
                input={
                    <CheckBox 
                        checked={usaDesconto} 
                        setChecked={disabledSetCheck}
                        disabled 
                    />
                }                               
            />
            <Config 
                svg={svgsUtil.ipi} 
                title={'IPI'} 
                description={'Usa IPI no calculo?'} 
                input={
                    <CheckBox 
                        checked={usaIpi} 
                        setChecked={disabledSetCheck}
                        disabled  
                    />
                }                             
            />
            <Config 
                subConfig
                svg={svgsUtil.ipi} 
                title={'IPI Proporcional'} 
                description={'Usa IPI proporcional ao fator base no calculo dos produtos?'} 
                input={
                    <CheckBox 
                        checked={usaIpiProporcional} 
                        setChecked={disabledSetCheck}
                        disabled 
                    />
                }                             
            />
            <Config 
                svg={svgsUtil.unitarioNota} 
                title={'Unitário Pedido'} 
                description={'Usa unitário do pedido no calculo?'} 
                input={
                    <CheckBox 
                        checked={usaUnitarioPedido} 
                        setChecked={disabledSetCheck}
                        disabled 
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
                        checked={usaComposto} 
                        setChecked={disabledSetCheck}
                        disabled 
                    />
                }                              
            />
        </section>
    )

}