export default function chaveFormatSplit(chave: string) {
    if (chave.length !== 44) return
    return chave.match(/.{1,4}/g)
}