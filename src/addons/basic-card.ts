import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('basic-card')
export class BasicCard extends LitElement {
    @property({ type: String }) background = '#ffffff';
    @property({ type: String }) shadow = '8px 8px 16px rgba(0,0,0,0.1)';

    static styles = css`
        :host {
            display: block;
            width: 100%;
            margin: 12px 0;
        }
        .card {
            padding: 16px;
            border-radius: 12px;
            box-sizing: border-box;
            transition: all 0.3s ease;
            height: 100%;
        }
    `;

    render() {
        return html`
            <div class="card" style="background: ${this.background}; box-shadow: ${this.shadow};">
                <slot></slot>
            </div>
        `;
    }
}
