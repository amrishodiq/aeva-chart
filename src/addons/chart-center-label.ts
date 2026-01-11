import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('chart-center-label')
export class ChartCenterLabel extends LitElement {
    @property({ type: String }) text = '';
    @property({ type: String, attribute: 'font-color' }) fontColor = '#000000';
    @property({ type: Number, attribute: 'font-size' }) fontSize = 20;
    @property({ type: String, attribute: 'font-family' }) fontFamily = 'Arial';
    @property({ type: String, attribute: 'font-style' }) fontStyle = 'normal';

    public get config() {
        return {
            text: this.text,
            color: this.fontColor,
            fontSize: this.fontSize,
            fontFamily: this.fontFamily,
            fontStyle: this.fontStyle
        };
    }
}
