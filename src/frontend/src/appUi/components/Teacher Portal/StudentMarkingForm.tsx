import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Check, School, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import { getStudentApi } from "../../../api/students";
import { createMarks } from "../../../api/marks";
import { StudentMarksRecord } from "../../../types/students";

const categories = ["CAT", "EXAM"];

export const MarkingComponent = () => {
  // State for filter selections
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // State for available options
  const [availableSchools, setAvailableSchools] = useState<string[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>(
    []
  );
  const [availablePrograms, setAvailablePrograms] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [availableCourses, setAvailableCourses] = useState<
    {
      course_id: string;
      course_name: string;
    }[]
  >([]);

  // Other state
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [marksData, setMarksData] = useState<{
    [key: string]: {
      [category: string]: number;
    };
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const fetchedStudents = await getStudentApi();
        setStudents(fetchedStudents);
        const schools = Array.from(
          new Set(fetchedStudents.map((s: any) => s.school))
        );
        setAvailableSchools(schools as any);
      } catch (error) {
        toast.error("Failed to fetch students");
      }
    };
    fetchStudents();
  }, []);

  // Update departments when school is selected
  useEffect(() => {
    if (selectedSchool) {
      const departments = Array.from(
        new Set(
          students
            .filter((s) => s.school === selectedSchool)
            .map((s) => s.department)
        )
      );
      setAvailableDepartments(departments);
      setSelectedDepartment("");
      setSelectedProgram("");
      setSelectedYear("");
      setSelectedCourse("");
    }
  }, [selectedSchool, students]);

  // Update programs when department is selected
  useEffect(() => {
    if (selectedDepartment) {
      const programs = Array.from(
        new Set(
          students
            .filter(
              (s) =>
                s.school === selectedSchool &&
                s.department === selectedDepartment
            )
            .map((s) => s.program)
        )
      );
      setAvailablePrograms(programs);
      setSelectedProgram("");
      setSelectedYear("");
      setSelectedCourse("");
    }
  }, [selectedDepartment, selectedSchool, students]);

  // Update years when program is selected
  useEffect(() => {
    if (selectedProgram) {
      const years = Array.from(
        new Set(
          students
            .filter(
              (s) =>
                s.school === selectedSchool &&
                s.department === selectedDepartment &&
                s.program === selectedProgram
            )
            .map((s) => s.year_of_study)
        )
      );
      setAvailableYears(years);
      setSelectedYear("");
      setSelectedCourse("");
    }
  }, [selectedProgram, selectedDepartment, selectedSchool, students]);

  // Update courses when year is selected
  useEffect(() => {
    if (selectedYear) {
      const courses = Array.from(
        new Set(
          students
            .filter(
              (s) =>
                s.school === selectedSchool &&
                s.department === selectedDepartment &&
                s.program === selectedProgram &&
                s.year_of_study === Number(selectedYear)
            )
            .flatMap((s) =>
              s.enrolled_courses.map((course: any) =>
                JSON.stringify({
                  course_id: course.course_id,
                  course_name: course.course_name,
                })
              )
            )
        )
      ).map((courseStr) => JSON.parse(courseStr));
      setAvailableCourses(courses);
      setSelectedCourse("");
    }
  }, [
    selectedYear,
    selectedProgram,
    selectedDepartment,
    selectedSchool,
    students,
  ]);

  const handleFilter = () => {
    if (
      !selectedSchool ||
      !selectedDepartment ||
      !selectedProgram ||
      !selectedYear ||
      !selectedCourse
    ) {
      toast.error("Please select all filter criteria");
      return;
    }

    const filtered = students.filter(
      (student) =>
        student.school === selectedSchool &&
        student.department === selectedDepartment &&
        student.program === selectedProgram &&
        student.year_of_study === Number(selectedYear) &&
        student.enrolled_courses.some(
          (course: any) => course.course_id === selectedCourse
        )
    );

    setFilteredStudents(filtered);
    setSelectedCategories([]);
    setMarksData({});

    if (filtered.length === 0) {
      toast.error("No students found matching the criteria");
    } else {
      toast.success(`Found ${filtered.length} students`);
    }
  };

  // Rest of the component logic remains the same...
  const handleCategorySelect = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      }
      return [...prev, category];
    });
  };

  const handleMarksChange = (
    studentId: string,
    category: string,
    value: number
  ) => {
    if (value < 0 || value > 100) {
      toast.error("Marks must be between 0 and 100");
      return;
    }

    setMarksData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [category]: value,
      },
    }));
  };

  const handleMarkSubmit = async (student: any) => {
    const studentMarks = marksData[student.student_id];
    const missingCategories = selectedCategories.filter(
      (category) => !studentMarks?.[category]
    );

    if (missingCategories.length > 0) {
      toast.error(`Please enter marks for: ${missingCategories.join(", ")}`);
      return;
    }

    setIsLoading(true);
    try {
      const selectedCourseDetails = student.enrolled_courses.find(
        (course: any) => course.course_id === selectedCourse
      );

      const marksPayload = {
        studentRegNumber: student.registration_id,
        name: `${student.full_name.first} ${student.full_name.middle} ${student.full_name.last}`,
        email: student.email,
        department: student.department,
        university: student.school,
        year: student.year_of_study,
        program: student.program,
        course: selectedCourseDetails?.course_name || "",
        marks: selectedCategories.map((category) => ({
          category,
          marks: studentMarks[category],
        })),
      };

      await createMarks(marksPayload as any);

      setMarksData((prev) => {
        const newData = { ...prev };
        delete newData[student.student_id];
        return newData;
      });
    } catch (error) {
      console.error("Failed to submit marks");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <School className="w-6 h-6" />
          Student Marks Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Hierarchical Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* School Selection */}
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger>
                <SelectValue placeholder="Select School/University" />
              </SelectTrigger>
              <SelectContent>
                {availableSchools.map((school) => (
                  <SelectItem key={school} value={school}>
                    {school}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Department Selection */}
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
              disabled={!selectedSchool}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {availableDepartments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Program Selection */}
            <Select
              value={selectedProgram}
              onValueChange={setSelectedProgram}
              disabled={!selectedDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Program" />
              </SelectTrigger>
              <SelectContent>
                {availablePrograms.map((program) => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Selection */}
            <Select
              value={selectedYear}
              onValueChange={setSelectedYear}
              disabled={!selectedProgram}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    Year {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Course Selection */}
            <Select
              value={selectedCourse}
              onValueChange={setSelectedCourse}
              disabled={!selectedYear}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.map((course) => (
                  <SelectItem key={course.course_id} value={course.course_id}>
                    {course.course_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleFilter}
            disabled={isLoading || !selectedCourse}
            className="w-full"
          >
            <Users className="w-4 h-4 mr-2" />
            Filter Students
          </Button>

          {/* Category Selection */}
          {selectedCourse && filteredStudents.length > 0 && (
            <div className="flex gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategories.includes(category)
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleCategorySelect(category)}
                  className="w-24"
                >
                  {category}
                </Button>
              ))}
            </div>
          )}

          {/* Students List */}
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <Card key={student.student_id} className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">
                      {`${student.full_name.first} ${student.full_name.middle} ${student.full_name.last}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {student.registration_id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {student.program} - Year {student.year_of_study}
                    </p>
                  </div>

                  {selectedCategories.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedCategories.map((category) => (
                        <div key={category}>
                          <label className="text-sm font-medium">
                            {category} Score
                          </label>
                          <Input
                            type="number"
                            value={
                              marksData[student.student_id]?.[category] || ""
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              handleMarksChange(
                                student.student_id,
                                category,
                                Number(e.target.value)
                              )
                            }
                            min={0}
                            max={100}
                            className="mt-1"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedCategories.length > 0 && (
                    <Button
                      onClick={() => handleMarkSubmit(student)}
                      disabled={isLoading}
                      className="w-full"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Submit Marks
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarkingComponent;
