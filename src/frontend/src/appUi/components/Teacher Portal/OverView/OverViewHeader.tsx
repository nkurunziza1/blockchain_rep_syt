// OverViewHeader.tsx
import React from 'react';
import TeacherCard from '../../ui/TeacherCard';
import { teacherTracks } from '../../../../constants';
import { Track } from '../../../../types/types';

const OverViewHeader: React.FC = () => {
  return (
    <div className='grid grid-cols-2 gap-2'>
      {teacherTracks.map((track: Track, index: number) => (
        <TeacherCard 
          key={index} 
          count={track.count} 
          sign={track.sign} 
          title={track.title} 
        />
      ))}
    </div>
  );
};

export default OverViewHeader;
