import React, { useState } from "react";
import { marks, courses, programYears } from "../../../constants";
import { FaSearch } from "react-icons/fa";
import useSearch from "../../../hooks/useSearch";
import { usePagination } from "../../../hooks/usePagination";
import { GrChapterPrevious, GrChapterNext } from "react-icons/gr";

const MarksTable = () => {
  const [selectedYear, setSelectedYear] = useState("");

  // Filter marks to include course information
  const marksWithCourseInfo = marks.map((mark) => {
    const course = courses.find((course) => course.course_id === mark.course_id);
    return {
      ...mark,
      course_name: course?.course_name,
      lecturer: course?.lecturer,
      year: course?.year,
      status: course?.status,
    };
  });

  // Search functionality
  const {
    query,
    handleSearch,
    filteredData: filteredBySearch,
  } = useSearch(marksWithCourseInfo, {
    fields: ["course_name", "lecturer"],
  });

  // Filter by selected year
  const filteredMarks = filteredBySearch.filter((mark) =>
    selectedYear ? mark.year === selectedYear : true
  );

  // Pagination setup
  const perPage = 5; // Number of marks per page
  const {
    activePage,
    nextPage,
    previousPage,
    goToPage,
    totalPages,
    items: paginatedMarks,
  } = usePagination(filteredMarks, 1, perPage);

  return (
    <section className="w-full mx-auto text-gray-800 flex flex-col justify-center gap-6 items-center h-full py-6 px-4">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl font-bold">Student Marks</h1>

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
            placeholder="Search marks by course name or lecturer..."
            value={query}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-green-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute top-3 right-3 text-gray-500" />{" "}
        </div>
      </div>

      {/* Marks Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden h-full mt-2">
        <thead className="bg-gray-200 text-sm">
          <tr>
            <th className="px-4 py-2 text-left font-bold text-gray-600">ID</th>
            <th className="px-4 py-2 text-left font-bold text-gray-600">
              Course Name
            </th>
            <th className="px-4 py-2 text-left font-bold text-gray-600">
              Lecturer
            </th>
            <th className="px-4 py-2 text-left font-bold text-gray-600">
              Mark
            </th>
            <th className="px-4 py-2 text-left font-bold text-gray-600">
              Grade
            </th>
            <th className="px-4 py-2 text-left font-bold text-gray-600">
              Year
            </th>
            <th className="px-4 py-2 text-left font-bold text-gray-600">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedMarks.length > 0 ? (
            paginatedMarks.map((mark: any, index: number) => (
              <tr
                key={index}
                className="border-b text-xs text-gray-500 max-h-20"
              >
                <td className="px-4 py-2">{mark.course_id}</td>
                <td className="px-4 py-2">{mark.course_name}</td>
                <td className="px-4 py-2">{mark.lecturer}</td>
                <td className="px-4 py-2">{mark.mark}</td>
                <td className="px-4 py-2">{mark.grade}</td>
                <td className="px-4 py-2">{mark.year}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-2 rounded ${
                      mark.status === "Ongoing"
                        ? "bg-blue-200 text-blue-800"
                        : mark.status === "Completed"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {mark.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-2 text-center" colSpan={7}>
                No marks match your search or selected year.
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

export default MarksTable;
