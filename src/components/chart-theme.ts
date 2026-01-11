import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('chart-theme')
export class ChartTheme extends LitElement {
    // Explicit properties
    @property({ type: Boolean }) responsive = true;
    @property({ type: Boolean, attribute: 'maintain-aspect-ratio' }) maintainAspectRatio = false;
    @property({ type: String, attribute: 'legend-position' }) legendPosition = 'bottom';

    public get config() {
        const config: any = {};

        Array.from(this.attributes).forEach(attr => {
            const camelCaseName = attr.name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            let val: any = attr.value;

            if (val === 'true') val = true;
            else if (val === 'false') val = false;
            else if (!isNaN(Number(val)) && val.trim() !== '') val = Number(val);

            if (attr.name.startsWith('datalabels-')) {
                // Handle datalabels prefix
                if (!config.plugins) config.plugins = {};
                if (!config.plugins.datalabels) config.plugins.datalabels = {};

                const subName = attr.name.replace('datalabels-', '').replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                config.plugins.datalabels[subName] = val;
            } else if (attr.name.startsWith('legend-')) {
                // Handle legend prefix
                if (!config.plugins) config.plugins = {};
                if (!config.plugins.legend) config.plugins.legend = {};

                const subName = attr.name.replace('legend-', '').replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                config.plugins.legend[subName] = val;
            } else {
                config[camelCaseName] = val;
            }
        });

        // Ensure defaults if not overridden by attributes
        if (config.responsive === undefined) config.responsive = this.responsive;
        if (config.maintainAspectRatio === undefined) config.maintainAspectRatio = this.maintainAspectRatio;

        // Structured plugins map
        if (!config.plugins) config.plugins = {};
        if (!config.plugins.legend) config.plugins.legend = {};
        if (config.legendPosition) config.plugins.legend.position = config.legendPosition;

        // Clean up flattened legendPosition if it exists to avoid pollution
        delete config.legendPosition;

        return config;
    }
}