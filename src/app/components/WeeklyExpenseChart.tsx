import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface WeeklyExpenseChartProps {
  weeklyExpenses: { week: string; total: number }[];
}

const WeeklyExpenseChart: React.FC<WeeklyExpenseChartProps> = ({ weeklyExpenses }) => {
  const labels = weeklyExpenses.map((expense) => expense.week);

  const data = {
    labels,
    datasets: [
      {
        label: 'Expenses in ₹',
        data: weeklyExpenses.map((expense) => expense.total),
        fill: false, // Disable filling under the line
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderWidth: 2,
        tension: 0.3, // Add some curve to the line
        pointRadius: 4,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Expenses Line Chart',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Week',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Expense (₹)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '400px', height: '200px' }}> {/* Adjust dimensions here */}
      <Line data={data} options={options} />
    </div>
  );
};

export default WeeklyExpenseChart;
