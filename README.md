# Aeva Chart

A versatile, declarative chart library for web and mobile using [Lit](https://lit.dev/) and [Chart.js](https://www.chartjs.org/).

## Features
- **Declarative Web Components**: Use HTML tags to configure your charts.
- **Lightweight**: Built with LitElement for minimum overhead.
- **Full Chart.js Power**: Access advanced Chart.js features via simple attributes.
- **Gradient Support**: Built-in support for vertical, horizontal, and conic gradients.
- **TypeScript**: First-class support for TypeScript.

## Installation

```bash
npm install aeva-chart
```

## Usage

### Basic Usage (HTML)

Include the bundle and use the tags directly in your HTML:

```html
<script type="module" src="node_modules/aeva-chart/dist/index.bundle.mjs"></script>

<aeva-chart type="bar">
  <chart-data labels="January, February, March">
    <data-set label="Sales" data="65, 59, 80" background-color="rgba(75, 192, 192, 0.2)" border-color="rgb(75, 192, 192)" border-width="1"></data-set>
  </chart-data>
</aeva-chart>
```

### Advanced Configuration

You can fully customize the chart using nested components:

#### Theme and Plugins
Use `<chart-theme>` to configure global settings and plugins like Legend, Tooltips, or DataLabels.

```html
<chart-theme 
  maintain-aspect-ratio="false" 
  legend-position="top"
  datalabels-display="true"
  datalabels-color="white"
></chart-theme>
```

#### Axis Configuration
Use `<chart-axis>` to customize X and Y axes.

```html
<chart-axis axis="y" grid-display="true" begin-at-zero="true" title-display="true" title-text="Amount"></chart-axis>
```

#### Gradients
Use `<chart-gradient>` inside a `<data-set>` to apply beautiful gradients.

```html
<data-set label="Revenue" data="100, 200, 150">
  <chart-gradient from="#ff8a00" to="#da1b60" orientation="vertical"></chart-gradient>
</data-set>
```

#### Center Labels (Doughnut/Pie)
```html
<aeva-chart type="doughnut">
  <chart-center-label text="75%" color="#333" font-size="24"></chart-center-label>
  <chart-data labels="Used, Remaining">
     <data-set data="75, 25"></data-set>
  </chart-data>
</aeva-chart>
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run dev mode:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Publishing to NPM

If you are a contributor and want to publish the library:

1. Build the library:
   ```bash
   npm run build
   ```

2. Login to your NPM account:
   ```bash
   npm login
   ```

3. Publish:
   ```bash
   npm run publish
   ```

## License
ISC