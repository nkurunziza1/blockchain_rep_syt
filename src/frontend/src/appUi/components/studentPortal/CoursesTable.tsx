import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { courses, programYears } from "../../../constants";
import useSearch from "../../../hooks/useSearch";
import { usePagination } from "../../../hooks/usePagination";
import { GrChapterPrevious } from "react-icons/gr";
import { GrChapterNext } from "react-icons/gr";

const CoursesTable = () => {
  const [selectedYear, setSelectedYear] = useState("");

  // Search functionality
  const {
    query,
    handleSearch,
    filteredData: filteredBySearch,
  } = useSearch(courses, {
    fields: ["course_name", "department", "lecturer"],
  });

  // Filter by selected year
  const filteredCourses = filteredBySearch.filter((course) =>
    selectedYear ? course.year === selectedYear : true
  );

  // Pagination setup
  const perPage = 5; // Number of courses per page
  const {
    activePage,
    nextPage,
    previousPage,
    goToPage,
    totalPages,
    items: paginatedCourses,
  } = usePagination(filteredCourses, 1, perPage);

  return (
    <section className="w-full mx-auto text-gray-800 flex flex-col justify-center gap-6 items-center h-full py-6 px-4">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold">List of Courses</h1>

        <div className="flex items-center justify-center">
          <h2 className="text-sm font-semibold mr-2 text-gray-600">
            Filter by Program Year:
          </h2>
          <select
            className="px-3 py-1 border border-green-500 rounded-md text-sm text-gray-600"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            {programYears.map((year, index) => (
              <option key={index} value={year}>
                {year} Year
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center w-full max-w-lg mt-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search courses by name, department, or lecturer..."
            value={query}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-green-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute top-3 right-3 text-gray-500" />{" "}
          {/* Search Icon */}
        </div>
      </div>

      {/* Courses Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden h-full mt-2">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="px-4 py-2 text-left font-bold text-gray-600">ID</th>
            <th className="px-4 py-2 text-left font-bold text-gray-600">
              Course Name
            </th>
            <th className="px-4 py-2 text-left font-bold text-gray-600">
              Credits
            </th>
            <th className="px-4 py-2 text-left font-bold text-gray-600">
              Duration (Hours)
            </th>
            <th className="px-4 py-2 text-left font-bold text-gray-600">
              Department
            </th>
            <th className="px-4 py-2 text-left font-bold text-gray-600">
              Year
            </th>
            <th className="px-4 py-2 text-left font-bold text-gray-600">
              Status
            </th>
            <th className="px-4 py-2 text-left font-bold text-gray-600">
              Lecturer
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedCourses.length > 0 ? (
            paginatedCourses.map((course: any) => (
              <tr
                key={course.course_id}
                className="border-b text-xs text-gray-500 max-h-20"
              >
                <td className="px-4 py-2">{course.course_id}</td>
                <td className="px-4 py-2">{course.course_name}</td>
                <td className="px-4 py-2">{course.credits}</td>
                <td className="px-4 py-2">{course.duration_in_hours}</td>
                <td className="px-4 py-2">{course.department}</td>
                <td className="px-4 py-2">{course.year}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-2 rounded ${
                      course.status === "Ongoing"
                        ? "bg-blue-200 text-blue-800"
                        : course.status === "Completed"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {course.status}
                  </span>
                </td>
                <td className="px-4 py-2">{course.lecturer}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-2 text-center" colSpan={9}>
                No courses match your search or selected year.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center text-sm">
          <button
            onClick={previousPage}
            disabled={activePage === 1}
            className="px-4 py-1 mx-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <GrChapterPrevious />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-4 py-1 mx-1 ${
                activePage === i + 1
                  ? "bg-cyan-700 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              } rounded font-semibold`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={nextPage}
            disabled={activePage === totalPages}
            className="px-4 py-1 mx-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <GrChapterNext />
          </button>
        </div>
      )}
    </section>
  );
};

export default CoursesTable;
