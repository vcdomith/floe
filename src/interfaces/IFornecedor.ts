export interface IFornecedor {

    nome: string

    //strings that will be used as numbers
    fatorBase: string
    fatorNormal: string
    fatorST: string 

    //Configs
    transporte: boolean
    st: boolean
    desconto: boolean
    ipi: boolean
    unitarioNota: boolean
    composto: boolean

}