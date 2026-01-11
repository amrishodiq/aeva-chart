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

            // Custom Tooltip Filter Index
            if (themeConfig.plugins?.tooltip?.filterIndex !== undefined) {
                const targetIndex = themeConfig.plugins.tooltip.filterIndex;
                finalOptions.plugins.tooltip.filter = (tooltipItem: any) => {
                    return tooltipItem.dataIndex === targetIndex;
                };
                delete finalOptions.plugins.tooltip.filterIndex;
            }

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

        // Gradient Support Integration
        const dataSetsWithGradients = Array.from(this.querySelectorAll('data-set')).filter(ds => ds.querySelector('chart-gradient'));

        if (dataSetsWithGradients.length > 0) {
            plugins.push({
                id: 'gradientBackground',
                beforeUpdate: (chart: any) => {
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return;

                    dataSetsWithGradients.forEach((dsEl: any) => {
                        // Find the corresponding dataset index in Chart.js
                        const allDsEls = Array.from(this.querySelectorAll('data-set'));
                        const dsIndex = allDsEls.indexOf(dsEl);
                        if (dsIndex === -1 || !chart.data.datasets[dsIndex]) return;

                        const dataset = chart.data.datasets[dsIndex];
                        const gradEls = Array.from(dsEl.querySelectorAll('chart-gradient')) as any[];

                        if (gradEls.length === 0) return;

                        // Create an array of colors if we have multiple data points and multiple gradients
                        // or even if we just want to apply one gradient specifically to one index.
                        const dataCount = dataset.data.length;

                        // We must ensure backgroundColor is an array if we want specific gradients per slice
                        // For non-pie/doughnut, we usually just apply one gradient to the whole dataset.
                        if (this.type === 'pie' || this.type === 'doughnut') {
                            // If it's not already an array, make it one with original colors
                            if (!Array.isArray(dataset.backgroundColor)) {
                                dataset.backgroundColor = new Array(dataCount).fill(dataset.backgroundColor || '#ccc');
                            }

                            gradEls.forEach((gradEl, gradIndex) => {
                                if (gradIndex < dataCount) {
                                    const { from, to, orientation } = gradEl.config;
                                    let gradient;
                                    if (orientation === 'conic') {
                                        const centerX = (chartArea.left + chartArea.right) / 2;
                                        const centerY = (chartArea.top + chartArea.bottom) / 2;
                                        // Start at the top (Chart.js default rotation is -0.5 * PI)
                                        gradient = ctx.createConicGradient(-Math.PI / 2, centerX, centerY);
                                    } else if (orientation === 'horizontal') {
                                        gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
                                    } else {
                                        gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                                    }
                                    gradient.addColorStop(0, from);
                                    gradient.addColorStop(1, to);
                                    dataset.backgroundColor[gradIndex] = gradient;
                                }
                            });
                        } else {
                            // For bar/line, usually apply the first gradient found to the whole dataset
                            const { from, to, orientation } = gradEls[0].config;
                            let gradient;
                            if (orientation === 'horizontal') {
                                gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
                            } else {
                                gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                            }
                            gradient.addColorStop(0, from);
                            gradient.addColorStop(1, to);
                            dataset.backgroundColor = gradient;
                            dataset.borderColor = gradient;
                        }
                    });
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