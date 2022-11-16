import React from 'react';
import {
  Chart,
  CategoryScale,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useMediaQuery } from '@mui/material';

// FlowChart 컴포넌트에서 넘겨받은 prop 데이터 type
interface ItemType {
  year: number;
  month: number;
  totalCost: number;
}

export default function Graph({ items }: { items: ItemType[] }) {
  // Chart.js로부터 Line Chart 라이브러리를 이용하기 위한 설정값 세팅
  Chart.register(CategoryScale);
  Chart.register(LineController);
  Chart.register(LineElement);
  Chart.register(PointElement);
  Chart.register(LinearScale);
  // 웹 or 앱 구분 기준
  const matches = useMediaQuery('(min-width:500px)');
  // Line Chart에 표기될 이름 (날짜)
  const labels: String[] = items.map((item) =>
    item.year.toString().concat('.').concat(item.month.toString()),
  );
  // Line Chart를 구성할 데이터값 (월별 지출액)
  const datas: Number[] = items.map((item) => item.totalCost);
  const data = {
    labels: labels,
    datasets: [
      {
        label: '월별 추이',
        data: datas,
        fill: false,
        borderColor: '#F1B0BC',
        backgroundColor: '#97CDBD',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1,
      },
    ],
  };
  const options = {
    spanGaps: false,
    legend: {
      display: false,
    },
    plugins: {
      datalabels: matches
        ? {
            display: true,
            // 월별 지출액을 3단위마다 , 를 찍어주기 위한 표현식
            formatter: (value: any, context: any) => {
              return value
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
            },
          }
        : { display: false },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
          drawTicks: true,
        },
        afterDataLimits: (scale: any) => {
          scale.max = scale.max * 1.1;
        },
        title: {
          display: true,
          text: '단위: 원',
        },
        min: 0,
      },
    },
  };
  return (
    <div style={{ width: '80vw' }}>
      <Line data={data} options={options} />
    </div>
  );
}
