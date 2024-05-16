import LogoSvg from "@/components/SvgArray/LogoSvg";

export default function Loading() {

    return(
        <div
            style={{
                display: 'flex'
            }}
        >
            <LogoSvg loop />
            <h3>Loading in Config route</h3>
            <p>Loading...</p>
        </div>
    )

}