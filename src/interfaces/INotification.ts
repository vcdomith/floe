export interface newNotification {

    tipo: 'sucesso' | 'erro' | 'aviso'
    mensagem: string

}

export interface INotification extends newNotification {

    id: string
    timer: NodeJS.Timeout

}