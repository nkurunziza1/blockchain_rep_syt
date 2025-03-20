import React from 'react';

const UpcomingActivities = () => {
  const activities = [
    { name: 'Parent-Teacher Meeting', date: 'Oct 25th' },
    { name: 'Exam Review Session', date: 'Nov 5th' },
    { name: 'End-of-Term Ceremony', date: 'Dec 15th' },
  ];

  return (
    <div className="p-2 bg-white rounded-lg border shadow-md w-full text-gray-800">
      <h2 className="text-md font-bold mb-2">Upcoming Activities</h2>
      <ul className="space-y-1">
        {activities.map((activity, index) => (
          <li key={index} className="flex justify-between text-sm text-gray-600">
            <span>{activity.name}</span>
            <span>{activity.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingActivities;