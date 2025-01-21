import { useState } from "react";

export default function useDynamicState<T, K>({
    initialState,
    dependency
}: {
    initialState: K
    dependency: T
}) {

    const stateArr = useState(initialState)
    const [_, setState] = stateArr
    const [prev, setPrev] = useState(dependency)
    if (dependency !== prev) {
        setPrev(dependency)
        setState(initialState)
    }

    return stateArr

}