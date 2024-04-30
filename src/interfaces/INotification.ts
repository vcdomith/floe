export interface newNotification {

    tipo: 'sucesso' | 'erro' | 'aviso'
    mensagem: string

}

export interface INotification extends newNotification {

    id: number
    timer: NodeJS.Timeout

}