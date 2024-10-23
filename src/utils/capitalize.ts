
function capitalizeInner<T extends string>(string: T): T {

    if (typeof string !== 'string') return string as T
    
    const captalizedFirstLetter = string[0].toUpperCase()
    const lowercasePart = string.slice(1,)
    return `${captalizedFirstLetter + lowercasePart}` as T

}

export default function capitalize<T extends string>(string: T): T {

    if (typeof string !== 'string' || string === '') return string as T

    if (string !== '' && string.split(' ').length === 1) {
        return capitalizeInner(string)
    }

    const capitalizedWords = string.split(' ').map( word => capitalizeInner(word.toLowerCase()) )
    return capitalizedWords.join(' ') as T

}