
interface RGB {
    r: number;
    g: number;
    b: number;
}


export default function interpolateColors(color1: string, color2: string, steps: number): string[] {
    const hexToRgb = (hex: string): RGB => {
        const bigint = parseInt(hex.substring(1), 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    };

    const rgbToHex = (r: number, g: number, b: number): string => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    const color1Rgb: RGB = hexToRgb(color1);
    const color2Rgb: RGB = hexToRgb(color2);

    const colors: string[] = [];

    const stepSize = {
        r: (color2Rgb.r - color1Rgb.r) / (steps + 1),
        g: (color2Rgb.g - color1Rgb.g) / (steps + 1),
        b: (color2Rgb.b - color1Rgb.b) / (steps + 1)
    };

    for (let i = 0; i < steps; i++) {
        const newColor: RGB = {
            r: Math.round(color1Rgb.r + stepSize.r * (i + 1)),
            g: Math.round(color1Rgb.g + stepSize.g * (i + 1)),
            b: Math.round(color1Rgb.b + stepSize.b * (i + 1))
        };
        colors.push(rgbToHex(newColor.r, newColor.g, newColor.b));
    }

    return colors;
}

// Example usage
// const color1: string = "#ff0000"; // Red
// const color2: string = "#0000ff"; // Blue
// const steps: number = 5; // Number of midpoints
// const interpolatedColors: string[] = interpolateColors(color1, color2, steps);
// console.log(interpolatedColors);
