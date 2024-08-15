
export default function getDifferentKeys<T extends Record<string, any>>(object1: T, object2: T): (keyof T)[] {

    return Object.keys(object1).filter( key => object1[key] !== object2[key])
}