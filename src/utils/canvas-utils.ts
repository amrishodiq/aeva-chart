/**
 * Options for generating chart background
 */
export interface ChartBackgroundOptions {
    /**
     * Comma separated color strings.
     * - empty: no background
     * - single color: solid background
     * - multiple colors: gradient background
     */
    colorsString?: string;
    /**
     * Height of the gradient in pixels. 
     * Defaults to 400 if not specified.
     */
    gradientHeight?: number;
}

/**
 * Result of the chart background generation
 */
export interface ChartBackgroundResult {
    /**
     * Whether the chart should be filled
     */
    fill: boolean;
    /**
     * The background value: either a color string or a CanvasGradient
     */
    backgroundColor: string | CanvasGradient;
}

/**
 * Generates background style (solid or gradient) based on color string input.
 * 
 * @param ctx The canvas 2D rendering context
 * @param options Configuration options
 * @returns Object containing fill status and background color/gradient
 */
export function getChartBackground(
    ctx: CanvasRenderingContext2D,
    options: ChartBackgroundOptions = {}
): ChartBackgroundResult {
    const { colorsString = '', gradientHeight = 400 } = options;

    // Parse colors from property (comma separated)
    const colors = colorsString ? colorsString.split(',').map(c => c.trim()).filter(c => c) : [];

    let fillValue: boolean = false;
    let bgValue: string | CanvasGradient = 'rgba(0,0,0,0)';

    if (colors.length === 0) {
        // No background
        fillValue = false;
    } else if (colors.length === 1) {
        // Single color
        fillValue = true;
        bgValue = colors[0];
    } else {
        // Gradient
        fillValue = true;

        // Create vertical gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, gradientHeight);

        // Distribute colors evenly
        colors.forEach((color, index) => {
            const stop = index / (colors.length - 1);
            gradient.addColorStop(stop, color);
        });
        bgValue = gradient;
    }

    return {
        fill: fillValue,
        backgroundColor: bgValue
    };
}
