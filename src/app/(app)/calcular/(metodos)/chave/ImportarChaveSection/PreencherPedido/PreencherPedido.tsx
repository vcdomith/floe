import { ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext";
import Config from "@/app/(app)/configurar/(Config)/Config";
import { svgsUtil } from "@/components/SvgArray/SvgUtil";
import style from './PreencherPedido.module.scss'
import NumberInput from "@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput";
import { useMemo, useState } from "react";
import { useModal } from "@/app/(app)/(contexts)/ModalContext";
import capitalize from "@/utils/capitalize";
import { NFeProduto } from "@/utils/parseXml";
import { IFornecedor } from "@/interfaces/IFornecedor";
import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog";
import Highlight from "@/components/Highlight/Highlight";

interface PreencherPedidoProps {
    produtos: NFeProduto[]
    fornecedor: IFornecedor
    confirmAction: (produtos: NFeProduto[]) => void
    cancelAction: () => void
}

export default function PreencherPedido({ produtos, fornecedor, confirmAction, cancelAction }: PreencherPedidoProps) {
    
    const [produtosPedido, setProdutosPedido] = useState(produtos)
    // console.log(produtos);
    // console.log(produtosPedido);

    function handleProdutoPedidoChange(index: number, field: keyof NFeProduto) {

        return (valor: string) => setProdutosPedido( prev => 
            prev.map( (produto, i) => 
                i === index 
                    ? {...produto, [field]: valor}
                    : produto
            )
        )

    }

    const { setModal, clearModal } = useModal()

    const handleConfirm = () => {

        setModal(
            <ConfirmationDialog 
                title={'Confirme para gerar a tabela'} 
                message={<>Os valores podem ser alterados novamente ao pressionar <Highlight>Gerar Tabela</Highlight> novamente</>}
                cancelHandler={clearModal} 
                confirmHandler={() => {
                    clearModal()
                    confirmAction(produtosPedido)
                }} 
            />
        )

    }

    const handleCancel = () => {

        setModal(
            <ConfirmationDialog 
                title={'Confirme para cancelar pedido'} 
                message={<>Se você sair antes de gerar a tabela os dados do pedio serão <Highlight>PERDIDOS</Highlight>, confirme para sair</>}
                cancelHandler={clearModal} 
                confirmHandler={() => {
                    cancelAction()
                }} 
            />
        )

    }

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

            <form 
                className={style.content}
                onSubmit={(e) => {
                    e.preventDefault()
                    handleConfirm()
                }}
            >

                <span className={style.tag}>
                    <h5>Pedido</h5>
                </span>
                
                <div className={`${style.fatores} ${style.dados}`}>
                    <Config 
                        svg={svgsUtil.fornecedor} 
                        title={'Fornecedor'} 
                        description={"Pedido do fornecedor"} 
                        input={
                            <input 
                                type="text" 
                                value={capitalize(fornecedor.nome)}
                                disabled
                            />
                        } 
                    />
                    {/* <Config 
                        svg={svgsUtil.unitarioNota} 
                        title={'Total Pedido'} 
                        description={"Valor total do pedido a ser utilizado no calculo"} 
                        input={
                            <NumberInput 
                                placeholder={""} 
                                valor={totalPedido} 
                                setValor={setTotalPedido}
                                required
                            />
                        } 
                    /> */}
                </div>

                <span className={style.tag}>
                    <h5>Produtos</h5>
                </span>

                {/* TODO - adicionar caso tenho usaComposto */}
                <div className={style.fatores}>
                    {produtos.map( (produto, index) => 
                        <Config 
                            key={produto.codigo}
                            svg={svgsUtil.produto} 
                            title={produto.codigo} 
                            description={produto.descricao} 
                            input={
                                <>
                                {(produto.quantidade).split('.')[0]}x
                                <NumberInput 
                                    placeholder={""} 
                                    label="unitario"
                                    valor={produtosPedido[index].unitarioPedido} 
                                    setValor={handleProdutoPedidoChange(index, 'unitarioPedido')} 
                                    required
                                />
                                {fornecedor.usaDesconto&&
                                <NumberInput 
                                    placeholder={""} 
                                    label="desconto"
                                    valor={produtosPedido[index].desconto} 
                                    setValor={handleProdutoPedidoChange(index, 'desconto')} 
                                    required
                                />
                                }
                                </>
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
                    onClick={() => handleCancel()}
                >
                    Cancelar
                </button>

                <button 
                    className={style.update}
                    onClick={() => handleConfirm()}
                >
                    Atualizar
                </button>

            </span>
        </div>
    )

}