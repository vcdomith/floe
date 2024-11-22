export interface IFornecedor {

    nome: string
    nomeFantasia?: string
    cnpj?: string

    //strings that will be used as numbers
    fatorBase: string
    fatorBaseNormal: string
    fatorBaseST: string 

    //Configs
    usaTransporte: boolean
    usaSt: boolean
    usaDesconto: boolean
    usaIpi: boolean
    usaIpiProporcional: boolean
    usaUnitarioPedido: boolean
    usaComposto: boolean

}