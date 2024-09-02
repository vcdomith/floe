export interface newNotification {

    tipo: 'sucesso' | 'erro' | 'aviso'
    mensagem: string
    timeout?: number

}

export interface INotification extends newNotification {

    id: string
    timer: NodeJS.Timeout

}