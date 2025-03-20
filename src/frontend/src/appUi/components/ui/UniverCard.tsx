import React from "react";
import { Universities } from "../../types/types";

const UniverCard: React.FC<Universities> = ({
  name,
  departments,
  description,
  establishedYear,
  location,
}) => {
  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-lg p-5">
      <div className="mb-4">
        {/* University Name */}
        <h1 className="font-bold text-xl text-gray-900 mb-3">
          {name || "University Name"}
        </h1>

        {/* Description */}
        <p className="text-gray-700 mb-3">
          {description || "No description available."}
        </p>

        {/* Established Year */}
        {establishedYear && (
          <p className="text-gray-500 mb-1">
            Established: {establishedYear}
          </p>
        )}

        {/* Location */}
        {location && (
          <p className="text-gray-500 mb-3">
            Location: {location}
          </p>
        )}

        {/* Departments */}
        {departments && departments.length > 0 && (
          <div className="text-gray-800">
            <p>Departments: {departments.length}</p>
            <ul className="list-disc list-inside pl-4">
              {departments.map((dept, index) => (
                <li key={index} className="text-gray-600">
                  {dept.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button className="text-cyan-700 hover:text-cyan-500 font-semibold">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default UniverCard;
