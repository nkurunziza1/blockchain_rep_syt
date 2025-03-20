import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../../../..//components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table";
import { Input } from "../../../../..//components/ui/input";
import { Button } from "../../../../..//components/ui/button";
import { toast } from "react-hot-toast";
import { GraduationCap, Save, Edit, ArrowLeft, History } from "lucide-react";
import Loading from "../../../loading";
import {
  getMarksHistory,
  getStudentMark,
  updateMarks,
} from "../../../../../api/marks/";
import { MarksHistoryDialog } from "../marksHistory";
import { cn } from "../../../../../lib/utils";

type MarksCategory = {
  category: string;
  marks: number;
};

type Course = {
  courseName: string;
  marks: MarksCategory[];
  createdAt: Date;
  updatedAt: Date;
};

type StudentMarksRecord = {
  id: string;
  studentid: string;
  name: string;
  email: string;
  studentRegNumber: string;
  department?: string;
  university?: string;
  year: number;
  program: string;
  courses: Course[];
  createdAt: Date;
  updatedAt: Date;
};

const StudentMarksDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [studentMarks, setStudentMarks] = useState<StudentMarksRecord | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedMarks, setEditedMarks] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [marksHistory, setMarksHistory] = useState<any[]>([]);
  const [historyFilters, setHistoryFilters] = useState({
    startDate: "",
    endDate: "",
  });
  const [isMarksModified, setIsMarksModified] = useState(false);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  const fetchMarksHistory = async () => {
    try {
      setIsLoading(true);

      // Only include filters if they have values
      const filters = {
        ...(historyFilters.startDate && {
          startDate: historyFilters.startDate,
        }),
        ...(historyFilters.endDate && { endDate: historyFilters.endDate }),
      };

      const response = await getMarksHistory(
        studentMarks?.studentRegNumber || "",
        filters
      );
      setMarksHistory(response.history);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to fetch marks history");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const fetchStudentMarks = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const response = await getStudentMark(id);

        if (response.success && response.marks.length > 0) {
          setStudentMarks(response.marks[0]);
          setEditedMarks(response.marks[0].courses);
        } else {
          toast.error("No marks found for this student");
        }
      } catch (error) {
        navigate("/teacher-portal/students-marks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentMarks();
  }, [id, navigate]);

  const handleMarkChange = (
    courseIndex: number,
    markIndex: number,
    newValue: string
  ) => {
    const inputKey = `${courseIndex}-${markIndex}`;
    setInputValues((prev) => ({
      ...prev,
      [inputKey]: newValue,
    }));
    if (newValue === "") {
      return;
    }
    const numericValue = parseFloat(newValue);
    if (isNaN(numericValue)) {
      return;
    }

    if (numericValue < 0 || numericValue > 100) {
      toast.error("Marks must be between 0 and 100");
      return;
    }

    setEditedMarks((prevMarks) => {
      const newMarks = [...prevMarks];
      const originalValue =
        studentMarks?.courses[courseIndex].marks[markIndex].marks;

      if (originalValue !== numericValue) {
        newMarks[courseIndex] = {
          ...newMarks[courseIndex],
          marks: [...newMarks[courseIndex].marks],
        };
        newMarks[courseIndex].marks[markIndex] = {
          ...newMarks[courseIndex].marks[markIndex],
          marks: numericValue,
        };
        setIsMarksModified(true);
      }
      return newMarks;
    });
  };

  const areMarksEqual = (original: Course[], edited: Course[]): boolean => {
    return original.every((course, courseIndex) =>
      course.marks.every(
        (mark, markIndex) =>
          mark.marks === edited[courseIndex].marks[markIndex].marks
      )
    );
  };

  // Add this useEffect to handle filter changes
  useEffect(() => {
    if (studentMarks?.studentRegNumber) {
      fetchMarksHistory();
    }
  }, [historyFilters, studentMarks?.studentRegNumber]);

  const handleSave = async () => {
    if (!studentMarks || !isMarksModified) return;

    // Double-check if there are actually changes to save
    if (areMarksEqual(studentMarks.courses, editedMarks)) {
      setIsMarksModified(false);
      return;
    }

    setIsLoading(true);
    try {
      const updateData: Partial<StudentMarksRecord> = {
        courses: editedMarks.map((course) => ({
          ...course,
          updatedAt: new Date(),
        })),
      };

      await updateMarks(studentMarks.id, updateData);
      setIsEditing(false);
      setIsMarksModified(false);
      setStudentMarks((prev) =>
        prev ? { ...prev, courses: editedMarks } : null
      );
      toast.success("Marks updated successfully");
    } catch (error) {
      toast.error("Failed to update marks");
      console.error("Error updating marks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedMarks(studentMarks?.courses || []);
      setInputValues({});
      setIsMarksModified(false);
    }
    setIsEditing(!isEditing);
  };

  const handleFilterChange = (filterType: string, date: Date | null) => {
    if (filterType === "reset") {
      setHistoryFilters({
        startDate: "",
        endDate: "",
      });
    } else {
      setHistoryFilters((prev) => {
        // Create a new date at the start/end of the day depending on filter type
        let formattedDate = "";
        if (date) {
          if (filterType === "startDate") {
            // Set to start of day
            date.setHours(0, 0, 0, 0);
          } else if (filterType === "endDate") {
            // Set to end of day
            date.setHours(23, 59, 59, 999);
          }
          formattedDate = date.toISOString();
        }

        return {
          ...prev,
          [filterType]: formattedDate,
        };
      });
    }
  };

  useEffect(() => {
    if (isEditing && editedMarks.length > 0) {
      const initialInputValues: { [key: string]: string } = {};
      editedMarks.forEach((course, courseIndex) => {
        course.marks.forEach((mark, markIndex) => {
          initialInputValues[`${courseIndex}-${markIndex}`] =
            mark.marks.toString();
        });
      });
      setInputValues(initialInputValues);
    }
  }, [isEditing, editedMarks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (!studentMarks) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        No student marks found
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <MarksHistoryDialog
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={marksHistory}
        filters={historyFilters}
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
      />
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              Student Marks Details
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/teacher-portal/students-marks")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button variant="outline" size="sm" onClick={handleEditToggle}>
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? "Cancel Edit" : "Edit Marks"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowHistory(true);
                  fetchMarksHistory();
                }}
              >
                <History className="w-4 h-4 mr-2" />
                View History
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Student Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-500">Student Name</p>
              <p className="text-sm font-semibold">{studentMarks.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Registration Number
              </p>
              <p className="text-sm font-semibold">
                {studentMarks.studentRegNumber}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm font-semibold">{studentMarks.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Program</p>
              <p className="text-sm font-semibold">{studentMarks.program}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Department</p>
              <p className="text-sm font-semibold">{studentMarks.department}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Year</p>
              <p className="text-sm font-semibold">{studentMarks.year}</p>
            </div>
          </div>

          {/* Marks Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Marks</TableHead>
                <TableHead className="text-right">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editedMarks.map((course, courseIndex) =>
                course.marks.map((mark, markIndex) => (
                  <TableRow key={`${courseIndex}-${markIndex}`}>
                    {markIndex === 0 && (
                      <TableCell rowSpan={course.marks.length}>
                        {course.courseName}
                      </TableCell>
                    )}
                    <TableCell>{mark.category}</TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={
                            inputValues[`${courseIndex}-${markIndex}`] ?? ""
                          }
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleMarkChange(
                              courseIndex,
                              markIndex,
                              e.target.value
                            )
                          }
                          min={0}
                          max={100}
                          className="w-24 ml-auto"
                          step="any"
                        />
                      ) : (
                        mark.marks
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Date(course.updatedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        {isEditing && (
          <CardFooter>
            <Button
              onClick={handleSave}
              // disabled={isLoading}
              disabled={isLoading || !isMarksModified}
              className={cn(
                "ml-auto",
                !isMarksModified && "cursor-not-allowed opacity-50"
              )}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default StudentMarksDetail;
