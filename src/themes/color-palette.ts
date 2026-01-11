export const PastelPalette = {
    Red: 'rgba(255, 99, 132, 0.5)',
    Blue: 'rgba(54, 162, 235, 0.5)',
    Yellow: 'rgba(255, 206, 86, 0.5)',
    Green: 'rgba(75, 192, 192, 0.5)',
    Purple: 'rgba(153, 102, 255, 0.5)',
    Orange: 'rgba(255, 159, 64, 0.5)',
    Grey: 'rgba(201, 203, 207, 0.5)'
} as const;

export const SolidPalette = {
    Red: 'rgba(255, 99, 132, 1)',
    Blue: 'rgba(54, 162, 235, 1)',
    Yellow: 'rgba(255, 206, 86, 1)',
    Green: 'rgba(75, 192, 192, 1)',
    Purple: 'rgba(153, 102, 255, 1)',
    Orange: 'rgba(255, 159, 64, 1)',
    Grey: 'rgba(201, 203, 207, 1)'
} as const;

export const getPastelColors = () => Object.values(PastelPalette);
export const getSolidColors = () => Object.values(SolidPalette);
