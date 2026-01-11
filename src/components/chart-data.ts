import { LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { DataSet } from "./data-set";

@customElement('chart-data')
export class ChartData extends LitElement {
    @property({ type: String }) labels = '';

    public get config() {
        const datasets = Array.from(this.querySelectorAll('data-set')).map((el: any) => el.config);
        const config: any = { datasets };

        Array.from(this.attributes).forEach(attr => {
            const camelCaseName = attr.name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            if (attr.name === 'labels') {
                config.labels = this.labels.split(',').map(l => l.trim());
            } else {
                const val = attr.value;
                if (val === 'true') config[camelCaseName] = true;
                else if (val === 'false') config[camelCaseName] = false;
                else if (!isNaN(Number(val)) && val.trim() !== '') config[camelCaseName] = Number(val);
                else config[camelCaseName] = val;
            }
        });

        return config;
    }
}