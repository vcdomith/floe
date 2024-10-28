export function chaveFormatSplit(chave: string) {
    if (chave.length !== 44) return
    return chave.match(/.{1,4}/g)
}

export function cnpjFormatSplit(cnpj: string) {
    if (cnpj.length !== 14) return
    return cnpj.match(/^.{2}.{3}.{3}.{4}.{2}$/g)
}