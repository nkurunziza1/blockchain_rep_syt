import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

interface Course {
  course_id: string;
  course_name: string;
  duration_in_hours: string;
  credits: string;
  lecturer: string;
  year: string;
  department: string;
  grade?: string;
  status: string;
}

interface CoursesListProps {
  data: Course[];
}

import { courses } from "../../../constants";

const CoursesList: React.FC<CoursesListProps> = ({ data = courses }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  // Ensure we map over arrays only if data exists
  const departments = data.length > 0 ? [...new Set(data.map(course => course.department))] : [];
  const lecturers = data.length > 0 ? [...new Set(data.map(course => course.lecturer))] : [];
  const statuses = data.length > 0 ? [...new Set(data.map(course => course.status))] : [];

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "course_id",
      header: "Course ID",
    },
    {
      accessorKey: "course_name",
      header: "Course Name",
      cell: ({ row }) => <div>{row.original.course_name}</div>,
    },
    {
      accessorKey: "duration_in_hours",
      header: "Duration (Hours)",
    },
    {
      accessorKey: "credits",
      header: "Credits",
    },
    {
      accessorKey: "lecturer",
      header: "Lecturer",
      cell: ({ row }) => <div>{row.original.lecturer}</div>,
    },
    {
      accessorKey: "year",
      header: "Year",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "grade",
      header: "Grade",
      cell: ({ row }) => (
        <div>{row.original.grade ? row.original.grade : "N/A"}</div>
      ),
    },
  ];


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="w-full mx-auto py-6 px-4 text-gray-600">
      {/* Search Bar */}
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search courses..."
          value={globalFilter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-4">
          <Select onValueChange={(value) => setColumnFilters([{ id: "department", value }])}>
            <SelectTrigger className="border px-3 py-1 text-xs">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              {departments.length > 0 ? departments.map((dept, idx) => (
                <SelectItem key={idx} value={dept}>
                  {dept}
                </SelectItem>
              )) : <SelectItem disabled>No departments available</SelectItem>}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setColumnFilters([{ id: "lecturer", value }])}>
            <SelectTrigger className="border px-3 py-1 text-xs">
              <SelectValue placeholder="All Lecturers" />
            </SelectTrigger>
            <SelectContent>
              {lecturers.length > 0 ? lecturers.map((lecturer, idx) => (
                <SelectItem key={idx} value={lecturer}>
                  {lecturer}
                </SelectItem>
              )) : <SelectItem disabled>No lecturers available</SelectItem>}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setColumnFilters([{ id: "status", value }])}>
            <SelectTrigger className="border px-3 py-1 text-xs">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {statuses.length > 0 ? statuses.map((status, idx) => (
                <SelectItem key={idx} value={status}>
                  {status}
                </SelectItem>
              )) : <SelectItem disabled>No statuses available</SelectItem>}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Courses Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
       <div className="w-full ">
       <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
       </div>
    </div>
  );
};

export default CoursesList;
