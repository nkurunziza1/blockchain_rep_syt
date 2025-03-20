import React from "react";
import ProgressCard from "../ui/ProgressCard";
import { progressList } from "../../../constants/progress";
import { progressProps } from "../../../types/types";

const OverView = () => {
  return (
    <section className="flex flex-col py-9 h-full gap-8 text-gray-800 mr-3">
      <h1 className="text-5xl font-bold">
        Bachelor's Degree in Computer Science
      </h1>
      <div className="h-full w-full flex gap-8">
        <div className="md:w-1/2  h-full rounded-xl shadow-xl p-5 flex flex-col justify-around border relative">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-3xl opacity-70"></div>
          <h1 className="text-3xl font-bold">Avoid Being Withdrawn!</h1>
          <p className="text-lg text-gray-500">
            Nkurunziza Alexandre the next term is just around the corner! It
            looks like you haven't been active for the past 5 terms. If you do
            not register for courses in the upcoming term, you will be withdrawn
            from the university. Registration is now open! Register now to avoid
            dismissal by the end of this term November 13th, 2024.
          </p>
          <button className="bg-green-600 text-white py-2 px-6 rounded-full self-start shadow-xl">
            Register
          </button>
        </div>
        <div className="w-1/2 grid grid-cols-2 rounded-xl shadow-xl p-5 border relative gap-5">
          {progressList.map((progress: any, i: number) => (
            <ProgressCard
              progress={progress.progress}
              title={progress.title}
              desc={progress.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OverView;
