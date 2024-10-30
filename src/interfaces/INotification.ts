import React from "react"

export interface newNotification {

    tipo: 'sucesso' | 'erro' | 'aviso'
    mensagem: React.ReactNode
    timeout?: number

}

export interface INotification extends newNotification {

    id: string
    timer: NodeJS.Timeout

}