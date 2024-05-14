import LogoSvg from "@/components/SvgArray/LogoSvg";

export default function Loading() {

    return(
        <div
            style={{
                display: 'flex'
            }}
        >
            <LogoSvg loop />
            <p>Loading...</p>
        </div>
    )

}