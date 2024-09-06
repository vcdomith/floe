import { useState } from "react";

export default function useDynamicaState<T, K>({
    initialState,
    dependency
}: {
    initialState: K
    dependency: T
}) {

    const stateArr = useState(initialState)
    const [state, setState] = stateArr
    const [prev, setPrev] = useState(dependency)
    if (dependency !== prev) {
        setPrev(dependency)
        setState(initialState)
    }

    return stateArr

}