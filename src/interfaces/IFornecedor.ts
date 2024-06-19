export interface IFornecedor {

    nome: string

    //strings that will be used as numbers
    fatorBase: string
    fatorBaseNormal: string
    fatorBaseST: string 

    //Configs
    transporte: boolean
    st: boolean
    desconto: boolean
    ipi: boolean
    unitarioNota: boolean
    composto: boolean

}