import React, { FC } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { progressProps } from "../../types/types";

const ProgressCard:FC<progressProps> = ({progress,title,desc}) => {
  return (
    <div className="border border-green-400 rounded-lg shadow-xl p-2 text-center">
      <IoAlertCircleOutline className="text-green-500"/>
      <h1 className="text-4xl font-bold">{progress}</h1>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
};

export default ProgressCard;
