import React from 'react';

const ClassesProgressList = () => {
  const classesData = [
    { className: 'Math 101', progress: 80 },
    { className: 'Physics 201', progress: 75 },
    { className: 'Chemistry 301', progress: 90 },
    { className: 'Biology 101', progress: 65 },
    { className: 'History 101', progress: 88 },
    { className: 'CS 101', progress: 85 },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'text-green-500 border-green-500';
    if (progress >= 75) return 'text-yellow-500 border-yellow-500';
    return 'text-red-500 border-red-500';
  };

  return (
    <div className="p-4 bg-white rounded-lg border shadow-md w-full text-gray-600">
      <h2 className="text-md font-bold mb-4">Class Progress</h2>
      <ul className="grid grid-cols-2 gap-2">
        {classesData.map((classItem, index) => (
          <li key={index} className="flex justify-between items-center text-sm text-gray-600 font-bold">
            <span>{classItem.className}</span>
            <div className="flex items-center gap-4">
              <div
                className={`relative w-12 h-12 rounded-full border-4 flex items-center justify-center ${getProgressColor(
                  classItem.progress
                )}`}
                style={{
                  background: classItem.progress === 100 ? 'conic-gradient(green 100%, white 0%)' : 'none',
                }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {classItem.progress}%
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassesProgressList;
