import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartComponentProps {
  chartData: any;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ chartData }) => {
  return (
    <div style={{ height: '400px', width: '100%' }}>
      <h2>График времени выполнения</h2>
      <Line data={chartData} />
    </div>
  );
};

export default ChartComponent;
