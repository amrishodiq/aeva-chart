import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('chart-gradient')
export class ChartGradient extends LitElement {
    @property({ type: String }) from = '';
    @property({ type: String }) to = '';
    @property({ type: String }) orientation: 'vertical' | 'horizontal' | 'conic' = 'vertical';

    public get config() {
        return {
            from: this.from,
            to: this.to,
            orientation: this.orientation
        };
    }
}
