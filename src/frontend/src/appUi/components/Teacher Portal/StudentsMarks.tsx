import React, { useEffect, useState } from "react";
import { StudentsMarksTable } from "./table/table";
import { useNavigate } from "react-router-dom";
import { studentsMarks } from "../../../constants";
import { getStudentMarks } from "../../../api/marks";
import { StudentMarksRecord } from "../../../types/students";
const StudentsMarks = () => {
  const [marks, setMarks] = useState<StudentMarksRecord[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMarks = async () => {
      const data = await getStudentMarks();
      setMarks(data);
    };
    fetchMarks();
  }, []);

  const handleAddMarks = () => {
    navigate("/teacher-portal/students-marks/mark");
  };

  const handleView = (student: StudentMarksRecord) => {
    navigate(`/teacher-portal/students-marks/view/${student}`);
  };

  return (
    <div className="container mx-auto py-10">
      <StudentsMarksTable
        data={marks}
        onAddMarks={handleAddMarks}
        onView={handleView}
      />
    </div>
  );
};

export default StudentsMarks;
