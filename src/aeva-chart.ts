import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import Chart from 'chart.js/auto';
@customElement('aeva-chart')
export class AevaChart extends LitElement {
    @property({ type: String }) type = 'line';
    @property({ type: String, attribute: 'chart-background' }) chartBackground = '';
    @property({ type: Object }) data = { datasets: [] };

    static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    canvas {
      width: 100%;
      height: 100%;
    }
  `;

    private chart: Chart | null = null;
    private canvas: HTMLCanvasElement | null = null;

    firstUpdated() {
        this.canvas = this.renderRoot.querySelector('canvas');
        if (this.canvas) {
            this.initChart();
        }
    }

    initChart() {
        if (!this.canvas) return;

        const ctx = this.canvas.getContext('2d');
        if (!ctx) return;

        // Parse colors from property (comma separated)
        const colors = this.chartBackground ? this.chartBackground.split(',').map(c => c.trim()).filter(c => c) : [];

        let fillValue: boolean | string = false;
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
            // We can approximate height or try to get it from canvas. 
            // 400 is a safe default for typical charts, or we can use chart area after layout (more complex)
            // For simplicity in this scaffold:
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);

            // Distribute colors evenly
            colors.forEach((color, index) => {
                const stop = index / (colors.length - 1);
                gradient.addColorStop(stop, color);
            });
            bgValue = gradient;
        }

        // Apply styles to datasets
        const datasets = this.data.datasets?.map((dataset: any) => ({
            ...dataset,
            fill: fillValue,
            backgroundColor: bgValue,
            // Keep previous defaults if not overriding
            borderColor: dataset.borderColor || 'orange',
            tension: dataset.tension || 0.4,
            pointBackgroundColor: dataset.pointBackgroundColor || 'orange',
            pointBorderColor: dataset.pointBorderColor || '#fff',
            pointBorderWidth: dataset.pointBorderWidth || 2,
        })) || [];

        this.chart = new Chart(this.canvas, {
            type: this.type as any,
            data: {
                ...this.data,
                datasets: datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            display: false, // 3. No grid
                        },
                    },
                    y: {
                        grid: {
                            display: false, // 3. No grid
                        },
                        ticks: {
                            display: false, // 4. No tick y
                        },
                        border: {
                            display: false // Hide y axis line if desired
                        }
                    },
                },
                plugins: {
                    legend: {
                        display: false // Optional: hide legend for cleaner look
                    }
                }
            },
        });
    }
    render() {
        return html`<canvas></canvas>`;
    }
}