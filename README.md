# Aeva Chart

A versatile chart library for web and mobile using [Lit](https://lit.dev/) and [Chart.js](https://www.chartjs.org/).

## Features
- **Lightweight**: Built with LitElement.
- **Easy to use**: Simple declarative syntax.
- **Customizable**: Supports custom backgrounds (solid, gradient, or transparent).
- **TypeScript**: Written in TypeScript for type safety.

## Installation

```bash
npm install aeva-chart
```

## Usage

### Basic Usage

```html
<script type="module" src="path/to/dist/index.bundle.mjs"></script>

<aeva-chart></aeva-chart>

<script>
  const chart = document.querySelector('aeva-chart');
  chart.data = {
    labels: ['A', 'B', 'C'],
    datasets: [{
      label: 'Data',
      data: [10, 20, 30]
    }]
  };
</script>
```

### Custom Backgrounds

You can customize the chart background using the `chart-background` attribute:

**1. No Background (Default)**
```html
<aeva-chart></aeva-chart>
```

**2. Solid Color**
```html
<aeva-chart chart-background="orange"></aeva-chart>
```

**3. Gradient Background**
Provide multiple colors separated by commas to create a vertical gradient.
```html
<aeva-chart chart-background="orange, white"></aeva-chart>
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
3. Build:
   ```bash
   npm run build
   ```

4. Run dev mode (watch):
   ```bash
   npm run dev
   ```
