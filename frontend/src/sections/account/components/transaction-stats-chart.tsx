import React from 'react';
import Chart from 'react-apexcharts';

type RawStat = {
  periodStart: string;
  direction: 'IN' | 'OUT';
  total: number;
};

type Props = {
  stats: RawStat[];
  direction: 'IN' | 'OUT'; // specify chart type
  height?: number; // optional height for card layout
};

// --------------------------------------------------------

function transformStats(stats: RawStat[], direction: 'IN' | 'OUT') {
  const grouped = new Map<string, number>();

  for (const stat of stats) {
    if (stat.direction !== direction) continue;

    const key = new Date(stat.periodStart).toISOString().slice(0, 10);
    grouped.set(key, Math.abs(stat.total));
  }

  const categories = Array.from(grouped.keys()).sort();
  const data = categories.map((key) => grouped.get(key) ?? 0);

  return {
    series: [{ name: direction, data }],
    categories,
  };
}

// --------------------------------------------------------

export function CompactTransactionChart({ stats, direction, height = 160 }: Props) {
  const { categories, series } = transformStats(stats, direction);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      sparkline: { enabled: true }, // makes it minimal
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        borderRadius: 4,
      },
    },
    xaxis: {
      categories,
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: { show: false },
    },
    tooltip: {
      y: {
        formatter: (val) => `£${val.toFixed(2)}`,
      },
    },
    colors: [direction === 'IN' ? '#00C49F' : '#FF8042'],
  };

  return <Chart type="bar" series={series} options={options} height={height} />;
}
