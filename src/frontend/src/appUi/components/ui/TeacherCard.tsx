import React from 'react';
import { Track } from '../../types/types';

const TeacherCard: React.FC<Track> = ({ count, sign, title }) => {
  return (
    <div className='bg-white p-4 rounded-lg shadow-md border border-cyan-500 text-gray-700 hover:shadow-xl transition-shadow duration-300 ease-in-out'>
      <div className="flex items-center justify-between">
        <span className="text-4xl">{sign}</span>
        <div className="text-right">
          <h1 className="text-3xl font-bold text-cyan-700">{count}</h1>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
