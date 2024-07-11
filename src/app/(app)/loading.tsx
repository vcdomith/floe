'use client'
import LogoSvg from "@/components/SvgArray/LogoSvg";
import { usePathname } from "next/navigation";

export default function Loading() {

    const route = usePathname()

    return(
        <div
            style={{
                position: 'fixed',
                // backgroundColor: 'wheat',
                top: 0,
                left: 0,
                width: '100vmax',
                height:' 100vmax',
                transition: 'background-color 600ms ease-out',
            }}
        >
            <LogoSvg loop />
            <p>Loading...</p>
        </div>
    )

}