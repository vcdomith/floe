'use client'
import LogoSvg from "@/components/SvgArray/LogoSvg";
import { usePathname } from "next/navigation";

export default function Loading() {

    const route = usePathname()

    return(
        <div
            style={{
                display: 'flex'
            }}
        >
            <LogoSvg loop />
            <h3>{route}</h3>
            <p>Loading...</p>
        </div>
    )

}