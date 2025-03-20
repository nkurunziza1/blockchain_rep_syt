import React from "react"
import { FaSearch } from "react-icons/fa";
import { usePagination } from "../../../hooks/usePagination";
import { GrChapterPrevious, GrChapterNext } from "react-icons/gr";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";


interface StudentFiltersProps {
    programYears: number[];
    programs: string[];
    statuses: string[];
    universities: string[];
    setSelectedYear: (year: string) => void;
    setSelectedProgram: (program: string) => void;
    setSelectedStatus: (status: string) => void;
    setSelectedUniversity: (university: string) => void;
}

export const StudentFilters: React.FC<StudentFiltersProps> = ({
    programYears,
    programs,
    statuses,
    universities,
    setSelectedYear,
    setSelectedProgram,
    setSelectedStatus,
    setSelectedUniversity
}) => {
    return (
        <div className="flex flex-wrap gap-4 mb-4">
            {/* Year Select */}
            <Select onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                    {programYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                            Year {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Program Select */}
            <Select onValueChange={setSelectedProgram}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Programs" />
                </SelectTrigger>
                <SelectContent>
                    {programs.map((program) => (
                        <SelectItem key={program} value={program}>
                            {program}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Status Select */}
            <Select onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                    {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* University Select */}
            <Select onValueChange={setSelectedUniversity}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Universities" />
                </SelectTrigger>
                <SelectContent>
                    {universities.map((university) => (
                        <SelectItem key={university} value={university}>
                            {university}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};