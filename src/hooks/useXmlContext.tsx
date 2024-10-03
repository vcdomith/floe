import useSectionContext, { UseSectionContext } from "./useSectionContext";

export interface UseXmlContext {
    context: UseSectionContext
}

export default function useXmlContext(): UseXmlContext {

    const context = useSectionContext()

    return {
        context
    }

}