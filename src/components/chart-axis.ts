import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('chart-axis')
export class ChartAxis extends LitElement {
    private _boolConverter(value: string | null) {
        return value !== 'false';
    }

    @property({ type: String }) axis: 'x' | 'y' = 'x';
    @property({ converter: (v: string | null) => v !== 'false' }) display = true;
    @property({ attribute: 'grid-display', converter: (v: string | null) => v !== 'false' }) gridDisplay = true;
    @property({ attribute: 'ticks-display', converter: (v: string | null) => v !== 'false' }) ticksDisplay = true;
    @property({ attribute: 'border-display', converter: (v: string | null) => v !== 'false' }) borderDisplay = true;
    @property({ type: Boolean }) stacked = false;

    public get config() {
        const config: any = {
            display: this.display,
            stacked: this.stacked,
            grid: {
                display: this.gridDisplay
            },
            ticks: {
                display: this.ticksDisplay
            },
            border: {
                display: this.borderDisplay
            }
        };

        // Parse all attributes for additional Chart.js scale options
        // e.g. begin-at-zero="true", min="0", max="100"
        Array.from(this.attributes).forEach(attr => {
            if (['axis', 'grid-display', 'ticks-display', 'border-display'].includes(attr.name)) return;

            const camelCaseName = attr.name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            let val: any = attr.value;

            if (val === 'true') val = true;
            else if (val === 'false') val = false;
            else if (!isNaN(Number(val)) && val.trim() !== '') val = Number(val);

            // Special handling for nested standard properties if they are already in config
            if (camelCaseName === 'display' || camelCaseName === 'stacked') {
                config[camelCaseName] = val;
            } else if (camelCaseName.startsWith('grid')) {
                const subKey = camelCaseName.replace('grid', '');
                if (subKey) {
                    const finalSubKey = subKey.charAt(0).toLowerCase() + subKey.slice(1);
                    config.grid[finalSubKey] = val;
                }
            } else if (camelCaseName.startsWith('ticks')) {
                const subKey = camelCaseName.replace('ticks', '');
                if (subKey) {
                    const finalSubKey = subKey.charAt(0).toLowerCase() + subKey.slice(1);
                    config.ticks[finalSubKey] = val;
                }
            } else {
                config[camelCaseName] = val;
            }
        });

        return {
            [this.axis]: config
        };
    }
}
