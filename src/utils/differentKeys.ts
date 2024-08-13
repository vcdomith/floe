
export default function getDifferentKeys<T extends Record<string, any>>(object1: T, object2: T): string[] {

    return Object.keys(object1).filter( key => object1[key] !== object2[key])
}