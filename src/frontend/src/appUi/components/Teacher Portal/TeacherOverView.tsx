import React from 'react';
import OverViewHeader from './OverView/OverViewHeader';
import CountDown from '../ui/CountDown';
import StudentStats from '../ui/StudentStats';
import ClassesProgressList from './OverView/ClassProgress';
import UpcomingActivities from './OverView/ActivitiesComp';

const TeacherOverView = () => {
  return (
    <section className="w-full h-full px-4 flex flex-col gap-4 pt-4 text-gray-800">
      <h1 className="text-2xl font-bold mb-3">Teacher's Portal Overview</h1>

      <div className="flex w-full gap-4">
        {/* Left side - Overview and Progress */}
        <div className="md:w-1/2 relative flex flex-col gap-3 rounded-lg shadow p-3">
          <OverViewHeader />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-2xl opacity-70"></div>
          <h1 className="text-xl font-bold">Avoid Being Withdrawn!</h1>
          <p className="text-md text-gray-500">
            Nkurunziza Alexandre, the next term is just around the corner! It looks like you haven't
            been active for the past 5 terms. If you do not register for courses in the upcoming term,
            you will be withdrawn from the university. Registration is now open! Register now to avoid
            dismissal by the end of this term, November 13th, 2024.
          </p>
          <button className="bg-cyan-600 text-white py-2 px-4 rounded-full self-start shadow-md text-sm">
            Register
          </button>

        </div>

        <div className="flex flex-col md:w-1/2 gap-4">
          <div className="flex flex-col items-end justify-start gap-3 rounded-lg shadow p-3">
            <h1 className="text-lg font-bold text-gray-600">Term begins on November 14th, 2024</h1>
            <CountDown />
            <ClassesProgressList />
            <div className="flex gap-3">
            <StudentStats />
            <UpcomingActivities />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeacherOverView;
