import { FatoresContext, ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext"
import { IProdutoContext } from "@/hooks/useProduto"
import { svgsUtil } from "../SvgArray/SvgUtil"
import Config from "@/app/(app)/configurar/(Config)/Config"
import CheckBox from "@/app/(app)/configurar/(CheckBox)/CheckBox"

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
        descricao: "Alíquita acrescentada devido ao frete"
    },
    st: {
        titulo: "ST",
        descricao: "Alíquiota acrescentada devido a ST ICMS"
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

export const ProdutoDetalhes = ({ produto, handleProdutoChange, style }: 
    { 
        produto: ProdutoCadastro, 
        handleProdutoChange: <T>(field: keyof IProdutoContext) => (valor: T) => void,
        style: { readonly [key: string]: string }
    }
) => {
    return (
        <div
            id={`fatores${produto.id}`} 
            style={{ width: 'fit-content'}}
        >
            <div className={style.popoverWrap}>

                <span className={style.header}>
                    {svgsUtil.produto3D}
                    <h3>Produto</h3>
                    <h3>{produto.codigo}</h3>
                </span>

                <div className={style.atributos}>
                    <Config 
                        svg={svgsUtil.st} 
                        title={'ST:'} 
                        description={''}
                        input={
                            <CheckBox 
                                checked={produto.st}
                                setChecked={handleProdutoChange('st')}
                                disabled
                            />
                        }
                    />
                    <Config
                        svg={svgsUtil['unitario']} 
                        title={'Unitário'} 
                        description={''}
                        input={
                            <input
                                className={style.codigo}
                                type="text" 
                                placeholder="_____________"
                                value={produto.unitario}
                                required
                                disabled
                            />
                        }
                    />
                    <Config
                        svg={svgsUtil['ncm']} 
                        title={'NCM'} 
                        description={''}
                        input={
                            <input
                                className={style.codigo}
                                type="text" 
                                placeholder="_____________"
                                value={produto.ncm}
                                required
                                disabled
                            />
                        }
                    />
                    <Config
                        svg={svgsUtil['unitarioNota']} 
                        title={'Unit. Nota'} 
                        description={''}
                        input={
                            <input
                                className={style.codigo}
                                type="text" 
                                placeholder="_____________"
                                value={produto.unitarioNota}
                                required
                                disabled
                            />
                        }
                    />
                    
                </div>

                <div className={style.title}>
                    <h5>Fatores</h5>
                </div>
                <div className={style.fatores}>
                {Object.entries(produto.fatores)
                    .filter( ([key, value]) => (value !== '1' || key === 'base'))
                    .map(([key, value]) => 
                        <Config
                            key={key} 
                            svg={svgsUtil[key as keyof FatoresContext]} 
                            title={fatoresConfigTextos[key as keyof FatoresContext].titulo} 
                            description={fatoresConfigTextos[key as keyof FatoresContext].descricao}
                            input={
                                <input
                                    className={style.codigo}
                                    type="text" 
                                    placeholder="_____________"
                                    value={value}
                                    required
                                    disabled
                                />
                            }
                        />
                    )
                }
                </div>

            </div>
        </div>
    )
}

export default ProdutoDetalhes