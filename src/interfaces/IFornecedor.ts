export interface IFornecedor {

    nome: string

    //strings that will be used as numbers
    fatorBase: string
    fatorNormal: string
    fatorST: string 

    //Configs
    desconto: boolean
    ipi: boolean
    unitarioNota: boolean

}