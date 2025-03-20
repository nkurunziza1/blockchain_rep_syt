import React from 'react';
import { studentsData } from '../../../constants';
// import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const StudentStats = () => {
  const labels = studentsData.map(student => student.name);
  const grades = studentsData.map(student => student.grade);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Student Grades',
        data: grades,
        backgroundColor: '#0e7490',
        borderColor: '#0891b2',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Grades',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Students',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="p-2 bg-white rounded-lg border shadow-md text-gray-600">
      <h2 className="text-sm font-bold mb-2">Student Statistics</h2>
      {/* <Line data={data} options={options} /> */}
    </div>
  );
};

export default StudentStats;
