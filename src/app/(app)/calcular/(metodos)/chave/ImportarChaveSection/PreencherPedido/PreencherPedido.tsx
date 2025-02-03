import { ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext";
import Config from "@/app/(app)/configurar/(Config)/Config";
import { svgsUtil } from "@/components/SvgArray/SvgUtil";
import style from './PreencherPedido.module.scss'
import styleProduto from '../../../../Tabs/ProdutoTab/ProdutoTab.module.scss'
import NumberInput from "@/components/FatoresTable/FatoresTableBody/NumberInput/NumberInput";
import { KeyboardEvent, useMemo, useRef, useState } from "react";
import { useModal } from "@/app/(app)/(contexts)/ModalContext";
import capitalize from "@/utils/capitalize";
import { NFeProduto } from "@/utils/parseXml";
import { IFornecedor } from "@/interfaces/IFornecedor";
import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog";
import Highlight from "@/components/Highlight/Highlight";
import Converter from "@/utils/typeConversion";
import { IProdutoContext } from "@/hooks/useProduto";

interface PreencherPedidoProps {
    produtos: NFeProduto[]
    fornecedor: IFornecedor
    confirmAction: (produtos: NFeProduto[]) => void
    cancelAction: () => void
}

const NUMBER_INPUT_PLACEHOLDER = '_'.repeat(50)

interface RefMap {
    ref1: HTMLInputElement | null
    ref2: HTMLInputElement | null
}

export default function PreencherPedido({ produtos, fornecedor, confirmAction, cancelAction }: PreencherPedidoProps) {
    
    const [produtosPedido, setProdutosPedido] = useState(produtos)
    console.log(produtos);
    console.log(produtosPedido);
    const produtosRef = useRef<RefMap[]>(produtos.map( () => ({ref1: null, ref2: null}) ))

    const {stringToFloat, floatToString} = Converter

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

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, field: keyof NFeProduto, index: number) => {
    
            const composto1 = produtosPedido[index].composto1
            const composto2 = produtosPedido[index].composto2

            if(e.key === 'Enter') {
    
                const calculoUnitario: string = floatToString(stringToFloat(composto1) + stringToFloat(composto2))
    
                if (field === 'composto1' || field === 'composto2') {
    
                    if (calculoUnitario === 'NaN') {
                
                        e.preventDefault()
        
                        if (composto1 === '') {
                            produtosRef.current[index].ref1?.focus()
                            return
                        } 
        
                        if (composto2 === '') {
                            produtosRef.current[index].ref2?.focus()
                            return
                        }
        
                    }
                    
                    const valorCalculado = floatToString(
                        stringToFloat(composto1) + 
                        stringToFloat(composto2)
                        , 2)
    
                    handleProdutoPedidoChange(index, 'unitarioPedido')(valorCalculado)
                    if (valorCalculado === 'NaN') e.preventDefault()
                }
    
    
                // if ( field === 'ipi') {
    
                //     e.preventDefault()
    
                //     if (ipiProporcional === '') {
                //         ipiProporcionalRef.current?.focus()
                //         return
                //     }
    
                //     const valorCalculado = floatToString(
                //         stringToFloat(ipiProporcional) / stringToFloat(fatores.base)
                //     )
    
                //     handleProdutoChange('ipi')(valorCalculado)
                //     if (valorCalculado === 'NaN') e.preventDefault()
    
                // }
    
            } 
    
        }

    return (
        <div className={style.card}>

            <section className={style.header}>
                <span className={style.badge}>
                    {svgsUtil.produto3D}
                    <p>Preencha os dados do pedido para gerar a tabela</p>
                </span>
            </section>

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
                </div>

                <span className={style.tag}>
                    <h5>Produtos</h5>
                </span>

                <div className={style.fatores}>
                    {produtos.map( (produto, index) => 
                        (!fornecedor.usaComposto)
                        ?
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
                        :
                        <div 
                            key={produto.codigo} 
                            className={`${style.configWrapper} ${styleProduto.configWrapper} ${styleProduto.compostoWrapper}`}>
                            <Config 
                                svg={svgsUtil.composto} 
                                title={produto.codigo} 
                                description={produto.descricao}
                                input={
                                    <NumberInput 
                                        placeholder={'______'} 
                                        valor={produtosPedido[index].unitarioPedido} 
                                        setValor={handleProdutoPedidoChange(index, 'unitarioPedido')}
                                        disabled
                                        data-valid={(produtosPedido[index].unitarioPedido) ? true : false}
                                        required
                                    />
                                }
                            />
                            {/* Adicionar variante que depende se o produto tem ou não ST
                                -> Sem st (novo TODO): valor x 2
                                -> Com st (existente): valor1 + valor2 
                            */}
                            <div 
                                className={`${style.extra} ${styleProduto.composto}`} 
                                onKeyDown={(e) => handleKeyDown(e, 'composto1', index)}
                            >
                                <span> 
                                    <div>
                                        <label htmlFor="">Composto 1</label>
                                        <NumberInput 
                                            placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                            valor={produtosPedido[index].composto1} 
                                            setValor={handleProdutoPedidoChange(index, 'composto1')} 
                                            required
                                            refProp={el => {if(el) produtosRef.current[index].ref1 = el}}
                                        />
                                    </div>        
                                    <p>+</p>
                                    <div>
                                        <label htmlFor="">Composto 2</label>
                                        <NumberInput 
                                            placeholder={NUMBER_INPUT_PLACEHOLDER} 
                                            valor={produtosPedido[index].composto2} 
                                            setValor={handleProdutoPedidoChange(index, 'composto2')} 
                                            required
                                            refProp={el => {if(el) produtosRef.current[index].ref2 = el}}
                                        />
                                    </div>
                                </span>
                                <button type='submit' hidden></button>                        
                            </div>
                        </div>
                    )
                    }
                </div>

                <button type="submit" hidden></button>

            </form>

            <span className={style.buttons}>

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
                    Gerar
                </button>

            </span>
        </div>
    )

}