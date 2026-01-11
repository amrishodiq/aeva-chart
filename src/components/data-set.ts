import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement('data-set')
export class DataSet extends LitElement {
    // Explicit properties for convenience/Type-safety, but we will scan attributes for everything locally
    @property({ type: String }) label = '';
    @property({ type: String }) data = '';

    public get config() {
        const config: any = {};

        // Iterate over all attributes to support full Chart.js dataset configuration
        // e.g. point-background-color -> pointBackgroundColor
        Array.from(this.attributes).forEach(attr => {
            const camelCaseName = attr.name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

            if (attr.name === 'data') {
                config.data = this.data.split(',').map(v => parseFloat(v.trim()));
            } else if (attr.name === 'label') {
                config.label = this.label;
            } else {
                // Try to parse primitives
                let val: any = attr.value;
                if (val === 'true') val = true;
                else if (val === 'false') val = false;
                else if (!isNaN(Number(val)) && val.trim() !== '') val = Number(val);
                else if (camelCaseName === 'backgroundColor' || camelCaseName === 'borderColor') {
                    // Handle color arrays: "red, green" or "rgba(..), rgba(..)"
                    // Split only on commas that are not inside parentheses
                    if (val.includes(',')) {
                        const parts = val.split(/,(?![^(]*\))/);
                        if (parts.length > 1) {
                            val = parts.map((s: string) => s.trim());
                        }
                    }
                }

                config[camelCaseName] = val;
            }
        });

        // Default fallback if not specified in attributes (optional)
        // usage of existing properties like borderWidth in class was mapped from attribute, 
        // but now we take directly from attribute.

        return config;
    }
}