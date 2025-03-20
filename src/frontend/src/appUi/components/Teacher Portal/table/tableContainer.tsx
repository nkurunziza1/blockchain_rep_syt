import React, { ChangeEvent, useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon, ArrowUpDown } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { StudentFilters } from "../../filters/studentFilter";
import { getStudentMarks } from "../../../../api/marks";
import { Student } from "../StudentsTable";

interface StudentsTableProps {
  paginatedStudents: Student[];
}

const TableContainer: React.FC<StudentsTableProps> = ({
  paginatedStudents,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [query, setQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");

  const programYears = [2020, 2021, 2022, 2023];
  const programs = ["Computer Science", "Engineering", "Business"];
  const statuses = ["active", "inactive", "graduated"];
  const universities = ["Harvard", "MIT", "Stanford"];

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "registration_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div style={{ color: "black" }}>{row.original.registration_id}</div>
      ),
    },
    {
      accessorKey: "full_name",
      header: "Full Name",
      cell: ({ row }) => {
        const fullName = `${row.original.full_name.first} ${row.original.full_name.last}`;
        return <div>{fullName}</div>;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div style={{ color: "black" }}>{row.original.email}</div>
      ),
    },
    {
      accessorKey: "phone_number",
      header: "Phone",
    },
    {
      accessorKey: "program",
      header: "Program",
    },
    {
      accessorKey: "year_of_study",
      header: "Year",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "university",
      header: "University",
    },
  ];

  const table = useReactTable({
    data: paginatedStudents,
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
    <div className="w-full">
      <div className="flex  w-full justify-between items-center ">
        <div className=" flex items-center">
          <Input
            placeholder="Filter students..."
            value={globalFilter}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setGlobalFilter(event.target.value)
            }
            type="text"
            className="max-w-sm"
          />
        </div>
        {/* Filter Section */}
        <div className="pt-3">
          <StudentFilters
            programYears={programYears}
            programs={programs}
            statuses={statuses}
            universities={universities}
            setSelectedYear={setSelectedYear}
            setSelectedProgram={setSelectedProgram}
            setSelectedStatus={setSelectedStatus}
            setSelectedUniversity={setSelectedUniversity}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No students match your search or filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon /> Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
};

export default TableContainer;
