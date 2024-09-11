import Link from "next/link";

export default function FornecedorNotFound({ params }: { params: { fornecedor : string }}) {

    // const { fornecedor } = params

    return (
        <div>
            {/* {`Fornecedor ${fornecedor} não existe!`} */}
            {`Fornecedor não existe!`}
            <Link href='/fornecedores' prefetch>Voltar para fornecedores</Link>
        </div>
    )

}