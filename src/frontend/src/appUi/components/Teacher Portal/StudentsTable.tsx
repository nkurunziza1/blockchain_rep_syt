import React, { useEffect, useState } from "react";

import { getStudentApi } from "../../../api/students";
import toast from "react-hot-toast";
import TableContainer from "./table/tableContainer";

// Define interfaces for type safety
export interface Student {
  student_id: string;
  registration_id: string;
  full_name: {
    first: string;
    last: string;
  };
  email: string;
  phone_number: string;
  program: string;
  year_of_study: string;
  status: string;
  university: string;
}

const StudentsTable = () => {
  const [students, setStudents] = useState([]);
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const fetchedStudents = await getStudentApi();
        setStudents(fetchedStudents);
      } catch (error) {
        toast.error("Failed to fetch students");
      }
    };
    fetchStudents();
  }, []);
  return (
    <section className="w-full mx-auto text-gray-600 flex flex-col justify-start gap-6 items-center h-full py-6 px-4">
      <TableContainer paginatedStudents={students} />
    </section>
  );
};

export default StudentsTable;
