import React from 'react';
import { Chart, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

interface ItemType {
  id: string;
  value: string;
  rate: string;
}

/* Deprecated */
export default function Graph({ items }: { items: ItemType[] }) {
  Chart.register(ArcElement);
  Chart.register(ChartDataLabels);
  const labels: String[] = items.map((item) => item.id);
  const datas: Number[] = items.map((item) => parseInt(item.value));
  const data = {
    Plugin: [ChartDataLabels],
    labels: labels,
    datasets: [
      {
        label: '태그별 통계',
        data: datas,
        datalabels: {
          color: 'black',
        },
        borderWidth: 2,
        hoverBorderWidth: 3,
        backgroundColor: [
          'rgba(238, 102, 121, 1)',
          'rgba(98, 181, 229, 1)',
          'rgba(255, 198, 0, 1)',
        ],
        fill: true,
      },
    ],
  };
  const option = {
    plugins: {
      datalabels: {
        formatter: (value: any, context: any) => {
          const idx = context.dataIndex;
          return labels[idx];
        },
      },
    },
  };
  return (
    <div>
      <Doughnut data={data} options={option} />
    </div>
  );
}
