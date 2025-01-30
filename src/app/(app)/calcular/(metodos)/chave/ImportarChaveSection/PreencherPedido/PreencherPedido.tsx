import { ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext";
import Config from "@/app/(app)/configurar/(Config)/Config";
import { svgsUtil } from "@/components/SvgArray/SvgUtil";
import style from './PreencherPedido.module.scss'
import NumberInput from "@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput";
import { useMemo, useState } from "react";
import { useModal } from "@/app/(app)/(contexts)/ModalContext";

interface PreencherPedidoProps {
    produtos: ProdutoCadastro[]
    fornecedor: string
    confirmAction: (produtos: ProdutoCadastro[]) => void
}

export default function PreencherPedido({ produtos, fornecedor }: PreencherPedidoProps) {

    
    
    const [produtosPedido, setProdutosPedido] = useState(produtos)
    console.log(produtos);
    console.log(produtosPedido);

    function handleProdutoPedidoChange(index: number, field: keyof ProdutoCadastro) {

        return (valor: string) => setProdutosPedido( prev => 
            prev.map( (produto, i) => 
                i === index 
                    ? {...produto, [field]: valor}
                    : produto
            )
        )
    }

    const [totalPedido, setTotalPedido] = useState('')

    const { clearModal } = useModal()

    return (
        <div className={style.card}>

            <section className={style.header}>
                <span className={style.badge}>
                    {svgsUtil.produto3D}
                    <p>Preencha os dados do pedido para gerar a tabela</p>
                </span>
            </section>

            {/* <section className={style.content}>

                <button className={style.tag}>
                    <h5>Pedido</h5>
                </button>
                
                <div className={style.fatores}>
                    <Config 
                        svg={svgsUtil.fornecedor} 
                        title={'Fornecedor'} 
                        description={"Pedido do fornecedor"} 
                        input={
                            <input 
                                type="text" 
                                value={fornecedor}
                                disabled
                            />
                        } 
                    />
                    <Config 
                        svg={svgsUtil.unitarioNota} 
                        title={'Total Pedido'} 
                        description={"Valor total do pedido a ser utilizado no calculo"} 
                        input={
                            <NumberInput 
                                placeholder={"total"} 
                                valor={totalPedido} 
                                setValor={setTotalPedido}
                            />
                        } 
                    />
                </div>
                
            </section> */}

            <form className={style.content}>

                <span className={style.tag}>
                    <h5>Pedido</h5>
                </span>
                
                <div className={style.fatores}>
                    <Config 
                        svg={svgsUtil.fornecedor} 
                        title={'Fornecedor'} 
                        description={"Pedido do fornecedor"} 
                        input={
                            <input 
                                type="text" 
                                value={fornecedor}
                                disabled
                            />
                        } 
                    />
                    <Config 
                        svg={svgsUtil.unitarioNota} 
                        title={'Total Pedido'} 
                        description={"Valor total do pedido a ser utilizado no calculo"} 
                        input={
                            <NumberInput 
                                placeholder={""} 
                                valor={totalPedido} 
                                setValor={setTotalPedido}
                            />
                        } 
                    />
                </div>

                <span className={style.tag}>
                    <h5>Produtos</h5>
                </span>

                <div className={style.fatores}>
                    {produtos.map( (produto, index) => 
                        <Config 
                            key={produto.id}
                            svg={svgsUtil.produto} 
                            title={produto.codigo} 
                            description={'Preencha o unitario pedido'} 
                            input={
                                <NumberInput 
                                    placeholder={""} 
                                    valor={produtosPedido[index].unitario} 
                                    setValor={handleProdutoPedidoChange(index, 'unitario')} 
                                />
                            } 
                        />
                    )
                    }
                </div>

                <button type="submit" hidden></button>

            </form>

            <span className={style.buttons}>

                {/* <button 
                    className={style.delete}
                    onClick={() => handleDelete(produto.id)}
                >
                    <SvgExcluir/>
                    {!isMobile&&
                    <p>Excluir</p>
                    }
                </button> */}

                <button 
                    className={style.discard}
                    onClick={() => clearModal()}
                >
                    Descartar
                </button>

                <button 
                    className={style.update}
                    onClick={() => {}}
                >
                    Atualizar
                </button>

            </span>
        </div>
    )

}