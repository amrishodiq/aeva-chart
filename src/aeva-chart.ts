import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import Chart from 'chart.js/auto';
import { getChartBackground } from './utils/canvas-utils';
import { ChartTheme } from './components/chart-theme';
import { ChartData } from './components/chart-data';
import { ChartAxis } from './components/chart-axis';
import { getPastelColors, getSolidColors, SolidPalette } from './themes/color-palette';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@customElement('aeva-chart')
export class AevaChart extends LitElement {
    @property({ type: String }) type = 'bar';

    static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
    }
    canvas {
      width: 100%;
      height: 100%;
    }
  `;

    private chart: Chart | null = null;

    @query('canvas')
    private canvas!: HTMLCanvasElement;

    firstUpdated() {
        if (this.canvas) {
            this.initChart();
        }
    }

    private handleSlotChange() {
        // Re-initialize chart when children change
        if (this.chart) {
            this.chart.destroy();
            this.initChart();
        } else {
            this.initChart();
        }
    }

    initChart() {
        if (!this.canvas) return;

        const ctx = this.canvas.getContext('2d');
        if (!ctx) return;

        // Check for child configuration components
        const themeEl = this.querySelector('chart-theme') as ChartTheme;
        const dataEl = this.querySelector('chart-data') as ChartData;
        const axisEls = Array.from(this.querySelectorAll('chart-axis')) as ChartAxis[];

        let finalData: any = { datasets: [] };
        let finalOptions: any = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { display: false } }, // Default
                y: { grid: { display: false }, ticks: { display: false }, border: { display: false } } // Default
            },
            plugins: {
                legend: { display: false }, // Default
                datalabels: { display: false } // Default to hidden
            }
        };

        if (dataEl && (dataEl as any).config) {
            finalData = (dataEl as any).config;
        }

        if (themeEl && (themeEl as any).config) {
            const themeConfig = (themeEl as any).config;

            // Extract known dataset properties to apply as defaults
            const datasetProps = ['backgroundColor', 'borderColor', 'borderWidth', 'borderRadius', 'pointRadius', 'pointBackgroundColor', 'borderSkipped', 'tension', 'fill'];
            const fontProps = ['fontFamily', 'fontSize', 'fontStyle', 'fontColor']; // Simplified font handling

            const datasetDefaults: any = {};
            const fontDefaults: any = {};
            const cleanThemeConfig = { ...themeConfig };

            Object.keys(themeConfig).forEach(key => {
                if (datasetProps.includes(key)) {
                    datasetDefaults[key] = themeConfig[key];
                    // Ideally remove from root options if strictly dataset prop, 
                    // but keeping it might be harmless or useful for some chart types.
                }
                if (key.startsWith('font')) {
                    // Simple mapping: font-size -> options.font.size
                    if (key === 'fontSize') fontDefaults.size = themeConfig[key];
                    if (key === 'fontFamily') fontDefaults.family = themeConfig[key];
                    if (key === 'fontStyle') fontDefaults.style = themeConfig[key];
                }
            });

            finalOptions = {
                ...finalOptions,
                ...cleanThemeConfig, // Merge everything as root options/plugins/etc
                plugins: {
                    ...finalOptions.plugins,
                    ...(cleanThemeConfig.plugins || {})
                }
            };

            // Apply dataset defaults under options.datasets[type]
            if (Object.keys(datasetDefaults).length > 0) {
                if (!finalOptions.datasets) finalOptions.datasets = {};
                finalOptions.datasets[this.type] = {
                    ...finalOptions.datasets[this.type],
                    ...datasetDefaults
                };
            }

            // Apply font defaults
            if (Object.keys(fontDefaults).length > 0) {
                finalOptions.font = {
                    ...finalOptions.font,
                    ...fontDefaults
                };
            }
        }

        // Apply axis configurations
        if (axisEls.length > 0) {
            const scales: any = {};
            axisEls.forEach(el => {
                if ((el as any).config) {
                    const conf = (el as any).config;
                    Object.assign(scales, conf);
                }
            });
            // Merge into options.scales
            finalOptions.scales = {
                ...finalOptions.scales,
                ...scales
            };
        }

        // Apply styles to datasets if they exist
        const datasets = finalData.datasets?.map((dataset: any) => ({
            ...dataset,
            backgroundColor: dataset.backgroundColor || getPastelColors()
        })) || [];

        // Center Label Integration
        const centerLabelEl = this.querySelector('chart-center-label') as any;
        const plugins: any[] = [];

        if (centerLabelEl && centerLabelEl.config && (this.type === 'doughnut' || this.type === 'pie')) {
            const labelConfig = centerLabelEl.config;
            plugins.push({
                id: 'centerLabel',
                beforeDraw: (chart: any) => {
                    const { ctx, chartArea: { top, bottom, left, right } } = chart;
                    ctx.save();
                    const centerX = (left + right) / 2;
                    const centerY = (top + bottom) / 2;

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = `${labelConfig.fontStyle} ${labelConfig.fontSize}px ${labelConfig.fontFamily}`;
                    ctx.fillStyle = labelConfig.color;
                    ctx.fillText(labelConfig.text, centerX, centerY);
                    ctx.restore();
                }
            });
        }

        this.chart = new Chart(this.canvas, {
            type: this.type as any,
            data: {
                ...finalData,
                datasets: datasets,
            },
            options: finalOptions,
            plugins: plugins
        });
    }

    render() {
        return html`
            <canvas></canvas>
            <slot @slotchange="${this.handleSlotChange}" style="display: none;"></slot>
        `;
    }
}